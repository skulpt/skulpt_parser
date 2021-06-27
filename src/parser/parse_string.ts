// deno-lint-ignore-file camelcase
import { expr, FormattedValue } from "../ast/astnodes.ts";
import { pySyntaxError } from "../ast/errors.ts";
import { tokenizerFromString } from "../tokenize/mod.ts";
import { TokenInfo } from "../tokenize/tokenize.ts";
import { GeneratedParser } from "./generated_parser.ts";
import { Parser } from "./parser.ts";
import { assert } from "./pegen.ts";
import { FSTRING_INPUT } from "./pegen_types.ts";

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

function unexpected_end_of_string(p: Parser) {
    p.raise_error(pySyntaxError, "f-string: expecting '}'");
}

const WHITE_SPACE = /^\s*$/;

function fstring_compile_expr(p: Parser, str: string, expr_start: number, expr_end: number, t: TokenInfo): expr {
    assert(expr_end >= expr_start);
    assert(str[expr_start - 1] === "{");
    assert(str[expr_end] === "}" || str[expr_end] === "!" || str[expr_end] === ":");

    let s = str.substring(expr_start, expr_end);

    /* If the substring is all whitespace, it's an error.  We need to catch this
       here, and not when we call PyParser_SimpleParseStringFlagsFilename,
       because turning the expression '' in to '()' would go from being invalid
       to valid. */
    if (WHITE_SPACE.test(s)) {
        p.raise_error(pySyntaxError, "f-string: empty expression not allowed");
    }
    // The parentheses are needed in order to allow for leading whitespace within
    // the f-string expression. This consequently gets parsed as a group (see the
    // group rule in python.gram).
    s = "(" + s + ")";
    try {
        const tokenizer = tokenizerFromString(s);
        const p2 = new GeneratedParser(tokenizer, FSTRING_INPUT);
        return p2.parse();
    } catch (e) {
        // if (e.traceback && e.traceback[0]) {
        //     let tb = e.traceback[0];
        //     tb.lineno = (tb.lineno || 1) - 1 + LINENO(n);
        //     tb.filename = c.c_filename;
        // }
        throw e;
    }
}

function fstring_find_expr(
    p: Parser,
    str: string,
    start: number,
    end: number,
    raw: boolean,
    recurse_lvl: number
): [expr, number] {
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

    let format_spec: expr | null = null;
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
        } else if (nested_depth === 0 && (ch === "!" || ch === ":" || ch === "}")) {
            /* First, test for the special case of "!=". Since '=' is
               not an allowed conversion character, nothing is lost in
               this test. */
            if (ch === "!" && i + 1 < end && str[i + 1] === "=") {
                /* This isn't a conversion character, just continue. */
                continue;
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

    /* Compile the expression as soon as possible, so we show errors
       related to the expression before errors related to the
       conversion or format_spec. */
    const simple_expression = fstring_compile_expr(p, str, expr_start, expr_end, c, n);

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
        expr_text = str.slice(i);
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
        [format_spec, i] = fstring_parse(str, i, end, raw, recurse_lvl + 1, c, n);
    }

    if (i >= end || str[i] !== "}") unexpected_end_of_string(p);

    /* We're at a right brace. Consume it. */
    i++;

    if (expr_text && format_spec === null && conversion === null) {
        conversion = "r";
    }

    /* And now create the FormattedValue node that represents this
       entire expression with the conversion and format spec. */
    const expr = new FormattedValue(simple_expression, conversion, format_spec);

    return [expr, i];
}

const BRACES_RE = /(^|[^}])}(}})*($|[^}])/;
const SINGLE_BRACE_RE = /}}/g;

export function fstring_parse(p: Parser, str: string, start: number, end: number, raw: boolean, recurse_lvl: number) {
    const values = [];
    let idx = start;

    const addLiteral = (literal: string) => {
        if (literal.includes("}")) {
            if (BRACES_RE.test(literal)) {
                p.raise_error(pySyntaxError, "f-string: single '}' is not allowed");
            }
            literal = literal.replace(SINGLE_BRACE_RE, "}");
        }
        if (raw || literal.includes("\\")) {
            literal = decodeEscape(p, literal);
        }
        values.push(literal); // ???
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
            const [expr, endIdx] = fstring_find_expr(p, str, bidx, end, raw, recurse_lvl, c, n);
            values.push(expr);
            idx = endIdx;
        }
    }
}
