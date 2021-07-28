// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

// deno-lint-ignore-file camelcase
import { Constant, expr, FormattedValue, JoinedStr } from "../ast/astnodes.ts";
import { pyStr } from "../mock_types/constants.ts";
import { pySyntaxError } from "../mock_types/errors.ts";
import { tokenizerFromString } from "../tokenize/mod.ts";
import { TokenInfo } from "../tokenize/tokenize.ts";
import { GeneratedParser } from "./generated_parser.ts";
import { Parser } from "./parser.ts";
import { assert } from "../util/assert.ts";
import { StartRule } from "./pegen_types.ts";

// deno-lint-ignore no-control-regex
const NON_ASCII = /[^\x00-\x7F]/;

export function parsestr(p: Parser, t: TokenInfo): [string, boolean, boolean, boolean] {
    let s = t.string;
    let quote = s[0];
    let fmode = false,
        bytesmode = false,
        rawmode = false;
    let i = 0;
    // we already know the tokenizer has ensured the prefixes are correct
    if (quote !== "'" && quote !== '"') {
        while (true) {
            if (quote === "b" || quote === "B") {
                quote = s[++i];
                bytesmode = true;
            } else if (quote === "u" || quote === "U") {
                quote = s[++i];
            } else if (quote === "r" || quote === "R") {
                quote = s[++i];
                rawmode = true;
            } else if (quote === "f" || quote === "F") {
                quote = s[++i];
                fmode = true;
            } else {
                break;
            }
        }
    }

    if (s.length >= 6 + i && s[i + 1] === quote && s[i + 2] === quote) {
        /* A triple quoted string. We've already skipped one quote at
       the start and one at the end of the string. Now skip the
       two at the start. */
        s = s.slice(i + 3, -3);
    } else {
        s = s.slice(i + 1, -1);
    }

    if (fmode) {
        /* Just return the string. The caller will parse it. */
        return [s, fmode, bytesmode, rawmode];
    }

    if (bytesmode && NON_ASCII.test(s)) {
        p.raise_error(pySyntaxError, "bytes can only contain ASCII literal characters.");
    }

    rawmode ||= !s.includes("\\");

    if (rawmode) {
        return [s, fmode, bytesmode, rawmode];
    }
    return [decodeEscape(p, s), fmode, bytesmode, rawmode];
}

/** decodeEscape ported over from skulpt */
function decodeEscape(p: Parser, s: string) {
    let ch: string;
    const len = s.length;
    let ret = "";
    for (let i = 0; i < len; i++) {
        ch = s[i];
        if (ch === "\\") {
            ch = s[++i];
            if (ch === "n") {
                ret += "\n";
            } else if (ch === "\\") {
                ret += "\\";
            } else if (ch === "t") {
                ret += "\t";
            } else if (ch === "r") {
                ret += "\r";
            } else if (ch === "b") {
                ret += "\b";
            } else if (ch === "f") {
                ret += "\f";
            } else if (ch === "v") {
                ret += "\v";
            } else if (ch === "0") {
                ret += "\0";
            } else if (ch === '"') {
                ret += '"';
            } else if (ch === "'") {
                ret += "'";
            } else if (ch === "\n") {
                /* escaped newline, join lines */
            } else if (ch === "x") {
                if (i + 2 >= len) {
                    p.raise_error(pySyntaxError, "Truncated \\xNN escape");
                }
                ret += String.fromCharCode(parseInt(s.substr(i + 1, 2), 16));
                i += 2;
            } else if (ch === "u") {
                if (i + 4 >= len) {
                    p.raise_error(pySyntaxError, "Truncated \\uXXXX escape");
                }
                ret += String.fromCharCode(parseInt(s.substr(i + 1, 4), 16));
                i += 4;
            } else if (ch === "U") {
                if (i + 8 >= len) {
                    p.raise_error(pySyntaxError, "Truncated \\UXXXXXXXX escape");
                }
                ret += String.fromCodePoint(parseInt(s.substr(i + 1, 8), 16));
                i += 8;
            } else {
                // Leave it alone
                ret += "\\" + ch;
            }
        } else {
            ret += ch;
        }
    }
    return ret;
}

const NEWLINE = /\n/g;
/* Fix locations for the given node and its children. */
function fstring_find_expr_location(parent: TokenInfo, fstr: string, expr_start: number): [number, number] {
    /** note cpython is currently broken https://bugs.python.org/issue35212 */
    let line = parent.start[0];
    let offset = parent.start[1];

    const new_lines = [...fstr.substring(0, expr_start).matchAll(NEWLINE)];
    const num_lines = new_lines.length;
    if (num_lines === 0) {
        // no new line characters before the start of this expression
        // we need to know how offset the fstr is from the token.string
        // e.g. the token.string could start like any of f', rf', fr", fr""" etc
        offset += parent.string.indexOf(fstr);
        offset += expr_start;
    } else {
        // we're not on the first line so get the relative offset
        offset = expr_start - (new_lines[num_lines - 1].index as number);
        line += num_lines;
    }
    return [line, offset];
}

function unexpected_end_of_string(p: Parser) {
    p.raise_error(pySyntaxError, "f-string: expecting '}'");
}

const WHITE_SPACE = /^\s*$/;

function fstring_compile_expr(p: Parser, str: string, expr_start: number, expr_end: number, t: TokenInfo): expr {
    assert(expr_end >= expr_start);
    assert(str[expr_start - 1] === "{");
    const end_ch = str[expr_end];
    assert(end_ch === "}" || end_ch === "!" || end_ch === ":" || end_ch === "=");

    let s = str.substring(expr_start, expr_end);

    /* If the substring is all whitespace, it's an error.  We need to catch this
       here, and not when we call PyParser_SimpleParseStringFlagsFilename,
       because turning the expression '' in to '()' would go from being invalid
       to valid. */
    if (WHITE_SPACE.test(s)) {
        p.raise_error(pySyntaxError, "f-string: empty expression not allowed");
    }

    const [lines, cols] = fstring_find_expr_location(t, str, expr_start);

    // The parentheses are needed in order to allow for leading whitespace within
    // the f-string expression. This consequently gets parsed as a group (see the
    // group rule in python.gram).
    s = "(" + s + ")";

    const tokenizer = tokenizerFromString(s, p.filename);
    tokenizer.starting_lineno = lines - 1;
    tokenizer.starting_col_offset = cols - 1;
    const p2 = new GeneratedParser(tokenizer, StartRule.FSTRING_INPUT);
    p2.filename = p.filename;

    // this might throw - lineno and offsets already adjusted
    return p2.parse();
}

function fstring_find_expr(
    this: FstringParser,
    p: Parser,
    str: string,
    start: number,
    end: number,
    raw: boolean,
    recurse_lvl: number,
    t: TokenInfo
): [FormattedValue, number, string | null] {
    /* Can only nest one level deep. */
    if (recurse_lvl >= 2) {
        p.raise_error(pySyntaxError, "f-string: expressions nested too deeply");
    }

    let i = start;
    assert(str[i] === "{");
    i++;
    const expr_start = i;
    /* null if we're not in a string, else the quote char we're trying to
       match (single or double quote). */
    let quote_char: string | null = null;
    /* If we're inside a string, 1=normal, 3=triple-quoted. */
    let string_type = 0;
    /* Keep track of nesting level for braces/parens/brackets in
       expressions. */
    let nested_depth = 0;

    let format_spec: JoinedStr | null = null;
    let conversion: string | null = null;
    let expr_text: string | null = null;

    assert(i <= end);

    for (; i < end; i++) {
        const ch = str[i];

        /* Nowhere inside an expression is a backslash allowed. */
        if (ch === "\\") {
            /* Error: can't include a backslash character, inside
               parens or strings or not. */
            p.raise_error(pySyntaxError, "f-string expression part cannot include a backslash");
        }
        if (quote_char !== null) {
            /* We're inside a string. See if we're at the end. */
            /* This code needs to implement the same non-error logic
               as tok_get from tokenizer.c, at the letter_quote
               label. To actually share that code would be a
               nightmare. But, it's unlikely to change and is small,
               so duplicate it here. Note we don't need to catch all
               of the errors, since they'll be caught when parsing the
               expression. We just need to match the non-error
               cases. Thus we can ignore \n in single-quoted strings,
               for example. Or non-terminated strings. */
            if (ch === quote_char) {
                /* Does this match the string_type (single or triple
                   quoted)? */
                if (string_type === 3) {
                    if (i + 2 < end && str[i + 1] === ch && str[i + 2] === ch) {
                        /* We're at the end of a triple quoted string. */
                        i += 2;
                        string_type = 0;
                        quote_char = null;
                        continue;
                    }
                } else {
                    /* We're at the end of a normal string. */
                    quote_char = null;
                    string_type = 0;
                    continue;
                }
            }
        } else if (ch === "'" || ch === '"') {
            /* Is this a triple quoted string? */
            if (i + 2 < end && str[i + 1] === ch && str[i + 2] === ch) {
                string_type = 3;
                i += 2;
            } else {
                /* Start of a normal string. */
                string_type = 1;
            }
            /* Start looking for the end of the string. */
            quote_char = ch;
        } else if (ch === "[" || ch === "{" || ch === "(") {
            // cpython checks for maximium nested depth here;
            nested_depth++;
        } else if (nested_depth !== 0 && (ch === "]" || ch === "}" || ch === ")")) {
            nested_depth--;
        } else if (ch === "#") {
            /* Error: can't include a comment character, inside parens
               or not. */
            p.raise_error(pySyntaxError, "f-string expression part cannot include '#'");
        } else if (
            nested_depth === 0 &&
            (ch === "!" || ch === ":" || ch === "}" || ch === "=" || ch === "<" || ch === ">")
        ) {
            /* First, test for the special case of "!=". Since '=' is
               not an allowed conversion character, nothing is lost in
               this test. */
            if (i + 1 < end) {
                if (str[i + 1] === "=" && (ch === "!" || ch === "=" || ch === "<" || ch === ">")) {
                    /* !=, ==, <=, >= */
                    /* This isn't a conversion character, just continue. */
                    i++;
                    continue;
                }
                /* Don't get out of the loop for these, if they're single
                   chars (not part of 2-char tokens). If by themselves, they
                   don't end an expression (unlike say '!'). */
                if (ch === ">" || ch === "<") {
                    continue;
                }
            }

            /* Normal way out of this loop. */
            break;
        } else {
            /* Just consume this char and loop around. */
        }
    }

    /* If we leave this loop in a string or with mismatched parens, we
       don't care. We'll get a syntax error when compiling the
       expression. But, we can produce a better error message, so
       let's just do that.*/
    if (quote_char) {
        p.raise_error(pySyntaxError, "f-string: unterminated string");
    }
    if (nested_depth) {
        p.raise_error(pySyntaxError, "f-string: mismatched '(', '{', or '['");
    }

    const expr_end = i;

    if (expr_start >= expr_end) {
        unexpected_end_of_string(p);
    }

    /* Compile the expression as soon as possible, so we show errors
       related to the expression before errors related to the
       conversion or format_spec. */
    const simple_expression = fstring_compile_expr(p, str, expr_start, expr_end, t);

    /* Check for =, which puts the text value of the expression in
       expr_text. */
    if (str[i] === "=") {
        i++;
        /* Skip over ASCII whitespace.  No need to test for end of string
           here, since we know there's at least a trailing quote somewhere
           ahead. */
        while (WHITE_SPACE.test(str[i])) {
            i++;
        }
        expr_text = str.slice(expr_start, i);
    }

    /* Check for a conversion char, if present. */
    if (str[i] === "!") {
        i++;
        if (i >= end) unexpected_end_of_string(p);

        conversion = str[i];
        i++;

        /* Validate the conversion. */
        if (!(conversion === "s" || conversion === "r" || conversion === "a")) {
            p.raise_error(pySyntaxError, "f-string: invalid conversion character: expected 's', 'r', or 'a'");
        }
    }

    /* Check for the format spec, if present. */
    if (i >= end) unexpected_end_of_string(p);
    if (str[i] === ":") {
        i++;
        if (i >= end) unexpected_end_of_string(p);
        /* Parse the format spec. */
        [format_spec, i] = fstring_parse(p, str, i, end, raw, recurse_lvl + 1, this.first, t, this.last);
    }

    if (i >= end || str[i] !== "}") unexpected_end_of_string(p);

    /* We're at a right brace. Consume it. */
    i++;

    if (expr_text && format_spec === null && conversion === null) {
        conversion = "r";
    }

    /* And now create the FormattedValue node that represents this
       entire expression with the conversion and format spec. */
    const expr = new FormattedValue(
        simple_expression,
        /** @todo change this to accept "r", "s", "a" but to match cpython ast we'll need to output the charCode */
        conversion === null ? -1 : conversion.charCodeAt(0),
        format_spec,
        this.a0,
        this.a1,
        this.a2,
        this.a3
    );

    return [expr, i, expr_text];
}

const BRACES_RE = /(^|[^}])}(}})*($|[^}])/;
const SINGLE_BRACE_RE = /}}/g;

/** find literal expressions and concat each with `this.last_str`. When we hit an expression outsource to find_expr. Push Constant and FormattedValue nodes onto `this.expr_list` */
export function fstring_find_literal_and_expr(
    this: FstringParser,
    str: string,
    start: number,
    end: number,
    raw: boolean,
    recurse_lvl: number,
    t: TokenInfo
) {
    const p: Parser = this.parser;
    let idx = start;

    const addLiteral = (literal: string) => {
        if (literal.includes("}")) {
            if (BRACES_RE.test(literal)) {
                p.raise_error(pySyntaxError, "f-string: single '}' is not allowed");
            }
            literal = literal.replace(SINGLE_BRACE_RE, "}");
        }
        if (!raw && literal.includes("\\")) {
            literal = decodeEscape(p, literal);
        }
        this.concat(literal);
    };

    while (idx < end) {
        let bidx = str.indexOf("{", idx);
        if (recurse_lvl !== 0) {
            // If there's a closing brace before the next open brace,
            // that's our end-of-expression
            const cbidx = str.indexOf("}", idx);
            if (cbidx !== -1) {
                if (bidx === -1) {
                    end = cbidx;
                } else if (bidx > cbidx) {
                    bidx = -1;
                    end = cbidx;
                }
            }
        }
        if (bidx === -1) {
            addLiteral(str.substring(idx, end));
            idx = end;
            break;
        } else if (bidx + 1 < end && str[bidx + 1] === "{") {
            // Swallow the double {{
            addLiteral(str.substring(idx, bidx + 1));
            idx = bidx + 2;
            continue;
        } else {
            addLiteral(str.substring(idx, bidx));
            idx = bidx;

            // And now parse the f-string expression itself
            const [expr, endIdx, expr_text] = fstring_find_expr.call(this, p, str, bidx, end, raw, recurse_lvl, t);

            if (expr_text !== null) {
                this.concat(expr_text);
            }
            if (this.last_str) {
                this.expr_list.push(this.mkStrNode(this.last_str));
                this.last_str = "";
            }
            this.expr_list.push(expr);
            idx = endIdx;
        }
    }
    return idx;
}

export class FstringParser {
    last_str = "";
    fmode = false;
    expr_list: (Constant | FormattedValue)[] = [];
    a0: number;
    a1: number;
    a2: number;
    a3: number;
    kind: "u" | null;
    constructor(readonly parser: Parser, readonly first: TokenInfo, readonly last: TokenInfo) {
        // attrs aka lineno, col_offset, end_lineno, end_col_offset
        this.a0 = first.start[0];
        this.a1 = first.start[1];
        this.a2 = last.end[0];
        this.a3 = last.end[1];
        // all concatenated string nodes get the same 'kind' as the initial token string
        // this only seems useful for unparsing AST
        this.kind = first.string[0] === "u" ? "u" : null;
    }
    concatFstring(
        fstr: string,
        start: number,
        end: number,
        rawmode: boolean,
        recurse_lvl: number,
        t: TokenInfo
    ): number {
        this.fmode = true;
        return fstring_find_literal_and_expr.call(this, fstr, start, end, rawmode, recurse_lvl, t);
    }
    concat(str: string) {
        this.last_str += str;
    }
    mkStrNode(str: string) {
        return new Constant(new pyStr(str), this.kind, this.a0, this.a1, this.a2, this.a3);
    }
    finish(): JoinedStr | Constant {
        if (!this.fmode) {
            assert(this.expr_list.length === 0);
            return this.mkStrNode(this.last_str);
        }
        /* Create a Constant node out of last_str, if needed. It will be the
       last node in our expression list. */
        if (this.last_str) {
            this.expr_list.push(this.mkStrNode(this.last_str));
        }
        return new JoinedStr(this.expr_list, this.a0, this.a1, this.a2, this.a3);
    }
}

/* Given an f-string (with no 'f' or quotes) that's in *str and ends
   at end, parse it into an expr_ty.  Return NULL on error.  Adjust
   str to point past the parsed portion. */
export function fstring_parse(
    p: Parser,
    str: string,
    start: number,
    end: number,
    raw: boolean,
    recurse_lvl: number,
    first: TokenInfo,
    t: TokenInfo,
    last: TokenInfo
): [JoinedStr, number] {
    const fstringParser = new FstringParser(p, first, last);
    const i = fstringParser.concatFstring(str, start, end, raw, recurse_lvl, t);
    return [fstringParser.finish() as JoinedStr, i];
}
