// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

// deno-lint-ignore-file camelcase
import { w } from "../util/unicode.ts";
import { initialIsIdentifier } from "../util/str_helpers.ts";
import { tokens, EXACT_TOKEN_TYPES } from "./token.ts";
import { pyIndentationError, pySyntaxError } from "../mock_types/errors.ts";

type token = number;
type position = [number, number];

export class TokenInfo {
    constructor(
        readonly type: token,
        readonly string: string,
        readonly start: position,
        readonly end: position,
        readonly line: string
    ) {}
    get lineno() {
        return this.start[0];
    }
    get col_offset() {
        return this.start[1];
    }
    get [Symbol.toStringTag]() {
        return "TokenInfo";
    }
}

const reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
    reHasRegExpChar = RegExp(reRegExpChar.source);

function regexEscape(string: string): string {
    return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
}

const capturegroup = (...choices: string[]): string => "(" + choices.join("|") + ")";
const group = (...choices: string[]): string => "(?:" + choices.join("|") + ")";
const maybe = (...choices: string[]): string => group(...choices) + "?";

function rstrip(input: string, what: string): string {
    let i: number;
    for (i = input.length; i > 0; --i) {
        if (what.indexOf(input.charAt(i - 1)) === -1) {
            break;
        }
    }
    return input.substring(0, i);
}

const Whitespace = "[ \\f\\t]*";
const Comment = "#[^\\r\\n]*";
const Name = "[" + w + "]+";

const Exponent = "[eE][-+]?[0-9](?:_?[0-9])*";
const Pointfloat = group("[0-9](?:_?[0-9])*\\.(?:[0-9](?:_?[0-9])*)?", "\\.[0-9](?:_?[0-9])*") + maybe(Exponent);
const Expfloat = "[0-9](?:_?[0-9])*" + Exponent;
export const Floatnumber = group(Pointfloat, Expfloat);
const Imagnumber = group("[0-9](?:_?[0-9])*[jJ]", Floatnumber + "[jJ]");

// Return the empty string, plus all of the valid string prefixes.
const _all_string_prefixes = [
    "",
    "FR",
    "RF",
    "Br",
    "BR",
    "Fr",
    "r",
    "B",
    "R",
    "b",
    "bR",
    "f",
    "rb",
    "rB",
    "F",
    "Rf",
    "U",
    "rF",
    "u",
    "RB",
    "br",
    "fR",
    "fr",
    "rf",
    "Rb",
];

// Note that since _all_string_prefixes includes the empty string,
//  StringPrefix can be the empty string (making it optional).
const StringPrefix = group(..._all_string_prefixes);

// these regexes differ from python because .exec doesn't do the
// same thing as .match in python. It's more like .search.
// .match matches from the start of the string.
// to get the same behaviour we can add a ^ to the start of the
// regex
// Tail end of ' string.
const Single = "^[^'\\\\]*(?:\\\\.[^'\\\\]*)*'";
// Tail end of " string.
const Double = '^[^"\\\\]*(?:\\\\.[^"\\\\]*)*"';
// Tail end of ''' string.
const Single3 = "^[^'\\\\]*(?:(?:\\\\.|'(?!''))[^'\\\\]*)*'''";
// Tail end of """ string.
const Double3 = '^[^"\\\\]*(?:(?:\\\\.|"(?!""))[^"\\\\]*)*"""';
const Triple = group(StringPrefix + "'''", StringPrefix + '"""');

// Sorting in reverse order puts the long operators before their prefixes.
// Otherwise if = came before ==, == would get recognized as two instances
// of =.
let EXACT_TOKENS_SORTED = [...EXACT_TOKEN_TYPES.keys()].sort();
let Special = group(...EXACT_TOKENS_SORTED.reverse().map((t) => regexEscape(t)));
let Funny = group("\\r?\\n", Special);

const ContStr = group(
    StringPrefix + "'[^\\n'\\\\]*(?:\\\\.[^\\n'\\\\]*)*" + group("'", "\\\\\\r?\\n"),
    StringPrefix + '"[^\\n"\\\\]*(?:\\\\.[^\\n"\\\\]*)*' + group('"', "\\\\\\r?\\n")
);
const PseudoExtras = group("\\\\\\r?\\n|$", Comment, Triple);

// For a given string prefix plus quotes, endpats maps it to a regex
//  to match the remainder of that string. _prefix can be empty, for
//  a normal single or triple quoted string (with no prefix).
const endpats: { [endpat: string]: RegExp } = {};
const prefixes = _all_string_prefixes;
for (const _prefix of prefixes) {
    endpats[_prefix + "'"] = new RegExp(Single);
    endpats[_prefix + '"'] = new RegExp(Double);
    endpats[_prefix + "'''"] = new RegExp(Single3);
    endpats[_prefix + '"""'] = new RegExp(Double3);
}

// A set of all of the single and triple quoted string prefixes,
//  including the opening quotes.
const single_quoted = new Set();
const triple_quoted = new Set();
for (const t of prefixes) {
    single_quoted.add(t + '"');
    single_quoted.add(t + "'");
    triple_quoted.add(t + '"""');
    triple_quoted.add(t + "'''");
}

const tabsize = 8;

let Hexnumber = "0[xX](?:_?[0-9a-fA-F])+";
let Binnumber = "0[bB](?:_?[01])+";
let Octnumber = "0[oO](?:_?[0-7])+";
let Decnumber = "(?:0(?:_?0)*|[1-9](?:_?[0-9])*)";
let Intnumber = group(Hexnumber, Binnumber, Octnumber, Decnumber);
let Number_ = group(Imagnumber, Floatnumber, Intnumber);
let PseudoToken = Whitespace + capturegroup(PseudoExtras, Number_, Funny, ContStr, Name);

let PseudoTokenRegexp = new RegExp(PseudoToken);

export function _switchVersion(py3: boolean) {
    if (py3) {
        EXACT_TOKEN_TYPES.delete("<>");
    } else {
        EXACT_TOKEN_TYPES.set("<>", EXACT_TOKEN_TYPES.get("!=") as tokens);
    }

    EXACT_TOKENS_SORTED = [...EXACT_TOKEN_TYPES.keys()].sort();
    Special = group(...EXACT_TOKENS_SORTED.reverse().map((t) => regexEscape(t)));
    Funny = group("\\r?\\n", Special);

    const LSuffix = py3 ? "" : "[Ll]?";
    Hexnumber = "0[xX](?:_?[0-9a-fA-F])+" + LSuffix;
    Binnumber = "0[bB](?:_?[01])+" + LSuffix;
    Octnumber = `0[oO]${py3 ? "" : "?"}(?:_?[0-7])+` + LSuffix; // SilentOctal in py2 mode
    Decnumber = "(?:0(?:_?0)*|[1-9](?:_?[0-9])*)" + LSuffix;
    Intnumber = group(Hexnumber, Binnumber, Octnumber, Decnumber);
    Number_ = group(Imagnumber, Floatnumber, Intnumber);
    PseudoToken = Whitespace + capturegroup(PseudoExtras, Number_, Funny, ContStr, Name);
    PseudoTokenRegexp = new RegExp(PseudoToken);
}

const UnknownFile = "<unknown>";

/** In python this should actually yield bytes */
export function tokenize(readline: IterableIterator<string>, filename = UnknownFile): IterableIterator<TokenInfo> {
    return _tokenize(readline, filename);
}

/** In python this the same api i.e. we yield strings except the readline is callable rather than a generator - see tokenize.py */
export function generate_tokens(
    readline: IterableIterator<string>,
    filename = UnknownFile
): IterableIterator<TokenInfo> {
    return _tokenize(readline, filename);
}

/** We largely ignore the encoding here. In python the readline might be a bytes iterator */
function* _tokenize(readline: IterableIterator<string>, filename = UnknownFile): IterableIterator<TokenInfo> {
    let lnum = 0,
        parenlev = 0,
        continued = 0,
        contstr = "",
        needcont = 0,
        contline: null | string = null,
        indents: number[] = [0],
        endprog = / /g, // keep type checker happy (endprog gets used before assignment)
        strstart: position = [0, 0]; // keep type checker happy (strstart gets used before assignment)

    // since we don't do this with bytes this is not used
    // if (encoding != null) {
    //     if (encoding === "utf-8-sig") {
    //         // BOM will already have been stripped.
    //         encoding = "utf-8";
    //     }

    //     yield new TokenInfo(tokens.ENCODING, encoding, [0, 0], [0, 0], "");
    // }

    let lastline = "";
    let line = "";
    while (true) {
        // loop over lines in stream
        // We capture the value of the line variable here because
        // readline uses the empty string '' to signal end of input,
        // hence `line` itself will always be overwritten at the end
        // of this loop.
        lastline = line;
        line = readline.next().value || "";

        // lets pretend this doesn't exist for now.
        // if encoding is not None:
        //     line = line.decode(encoding)
        lnum += 1;
        let pos = 0;
        const max = line.length;

        if (contstr) {
            // continued string
            if (!line) {
                yield new TokenInfo(tokens.ERRORTOKEN, "EOF in multi-line statement", [lnum, pos], [lnum, pos], line);
                // if the Praser didn't throw they we throw
                throw new pySyntaxError("EOF in multi-line string", [filename, ...strstart, lastline]);
            }
            endprog.lastIndex = 0;
            const endmatch = endprog.exec(line);
            if (endmatch !== null) {
                const end = (pos = endmatch[0].length);
                yield new TokenInfo(
                    tokens.STRING,
                    contstr + line.substring(0, end),
                    strstart,
                    [lnum, end],
                    contline + line
                );
                contstr = "";
                needcont = 0;
                contline = null;
            } else if (
                needcont &&
                line.substring(line.length - 2) !== "\\\n" &&
                line.substring(line.length - 3) !== "\\\r\n"
            ) {
                yield new TokenInfo(
                    tokens.ERRORTOKEN,
                    contstr + line,
                    strstart,
                    [lnum, line.length],
                    contline as string
                );
                contstr = "";
                contline = null;
                continue;
            } else {
                contstr = contstr + line;
                contline = contline + line;
                continue;
            }
        } else if (parenlev === 0 && !continued) {
            // new statement
            if (!line) {
                break;
            }
            let column = 0;
            while (pos < max) {
                // measure leading whitespace
                const curr = line[pos];
                if (curr === " ") {
                    column += 1;
                } else if (curr === "\t") {
                    column = Math.floor(column / tabsize + 1) * tabsize;
                } else if (curr === "\f") {
                    column = 0;
                } else {
                    break;
                }
                pos += 1;
            }

            if (pos === max) {
                break;
            }

            const curr = line[pos];
            if (curr === "#" || curr === "\r" || curr === "\n") {
                // skip comments or blank lines
                if (curr === "#") {
                    const commentoken = rstrip(line.substring(pos), "\r\n");
                    yield new TokenInfo(
                        tokens.COMMENT,
                        commentoken,
                        [lnum, pos],
                        [lnum, pos + commentoken.length],
                        line
                    );
                    pos += commentoken.length;
                }

                yield new TokenInfo(tokens.NL, line.substring(pos), [lnum, pos], [lnum, line.length], line);
                continue;
            }

            if (column > indents[indents.length - 1]) {
                // count indents or dedents
                indents.push(column);
                yield new TokenInfo(tokens.INDENT, line.substring(pos), [lnum, 0], [lnum, pos], line);
            }

            while (column < indents[indents.length - 1]) {
                if (!indents.includes(column)) {
                    throw new pyIndentationError("unindent does not match any outer indentation level", [
                        filename,
                        lnum,
                        pos,
                        line,
                    ]);
                }

                indents = indents.slice(0, -1);

                yield new TokenInfo(tokens.DEDENT, "", [lnum, pos], [lnum, pos], line);
            }
        } else {
            // continued statement
            if (!line) {
                yield new TokenInfo(tokens.ERRORTOKEN, "EOF in multi-line statement", [lnum, pos], [lnum, pos], line);
                // if the Praser didn't throw they we throw
                throw new pySyntaxError("EOF in multi-line statement", [filename, lnum, 0, lastline]);
            }
            continued = 0;
        }

        while (pos < max) {
            // js regexes don't return any info about matches, other than the
            // content. we'd like to put a \w+ before pseudomatch, but then we
            // can't get any data
            let capos = line[pos];
            while (capos === " " || capos === "\f" || capos === "\t") {
                capos = line[++pos];
            }

            const pseudomatch = PseudoTokenRegexp.exec(line.substring(pos));
            let maybeQuote = false;

            if (pseudomatch !== null) {
                // scan for tokens
                const start = pos;
                const end = start + pseudomatch[1].length;
                const spos: position = [lnum, start];
                const epos: position = [lnum, end];
                pos = end;
                if (start === end) {
                    continue;
                }

                let token = line.substring(start, end);
                const initial = line[start];
                if (
                    (initial === "." && token !== "." && token !== "...") ||
                    initial === "0" ||
                    initial === "1" ||
                    initial === "2" ||
                    initial === "3" ||
                    initial === "4" ||
                    initial === "5" ||
                    initial === "6" ||
                    initial === "7" ||
                    initial === "8" ||
                    initial === "9"
                ) {
                    yield new TokenInfo(tokens.NUMBER, token, spos, epos, line);
                } else if (initial === "\r" || initial === "\n") {
                    if (parenlev > 0) {
                        yield new TokenInfo(tokens.NL, token, spos, epos, line);
                    } else {
                        yield new TokenInfo(tokens.NEWLINE, token, spos, epos, line);
                    }
                } else if (initial === "#") {
                    //assert not token.endswith("\n")
                    yield new TokenInfo(tokens.COMMENT, token, spos, epos, line);
                } else if (
                    token === "'''" ||
                    token === '"""' ||
                    ((maybeQuote =
                        initial === "f" ||
                        initial === "r" ||
                        initial === "b" ||
                        initial === "u" ||
                        initial === "F" ||
                        initial === "R" ||
                        initial === "B" ||
                        initial === "U") &&
                        triple_quoted.has(token))
                ) {
                    endprog = endpats[token];
                    const endmatch = endprog.exec(line.substring(pos));
                    if (endmatch !== null) {
                        // all on one line
                        pos = endmatch[0].length + pos;
                        token = line.substring(start, pos);
                        yield new TokenInfo(tokens.STRING, token, spos, [lnum, pos], line);
                    } else {
                        strstart = [lnum, start]; // multiple lines
                        contstr = line.substring(start);
                        contline = line;
                        break;
                    }
                    // Check up to the first 3 chars of the token to see if
                    //  they're in the single_quoted set. If so, they start
                    //  a string.
                    // We're using the first 3, because we're looking for
                    //  "rb'" (for example) at the start of the token. If
                    //  we switch to longer prefixes, this needs to be
                    //  adjusted.
                    // Note that initial == token[:1].
                    // Also note that single quote checking must come after
                    //  triple quote checking (above).
                } else if (
                    initial === "'" ||
                    initial === '"' ||
                    (maybeQuote &&
                        (single_quoted.has(token.substring(0, 2)) || single_quoted.has(token.substring(0, 3))))
                ) {
                    if (token[token.length - 1] === "\n") {
                        // continued string
                        strstart = [lnum, start];
                        // Again, using the first 3 chars of the
                        //  token. This is looking for the matching end
                        //  regex for the correct type of quote
                        //  character. So it's really looking for
                        //  endpats["'"] or endpats['"'], by trying to
                        //  skip string prefix characters, if any.
                        endprog = endpats[initial] || endpats[token[1]] || endpats[token[2]];
                        contstr = line.substring(start);
                        needcont = 1;
                        contline = line;
                        break;
                    } else {
                        // ordinary string
                        yield new TokenInfo(tokens.STRING, token, spos, epos, line);
                    }
                } else if (initial === "a") {
                    // maybe async
                    if (token === "async") {
                        yield new TokenInfo(tokens.ASYNC, token, spos, epos, line);
                    } else if (token === "await") {
                        yield new TokenInfo(tokens.AWAIT, token, spos, epos, line);
                    } else {
                        yield new TokenInfo(tokens.NAME, token, spos, epos, line);
                    }
                } else if (maybeQuote || initialIsIdentifier(initial)) {
                    // if maybeQuote is true at this stage
                    // then initial must be one of the string identifiers
                    // ordinary name
                    yield new TokenInfo(tokens.NAME, token, spos, epos, line);
                } else if (initial === "\\") {
                    // continued stmt
                    continued = 1;
                } else {
                    if (initial === "(" || initial === "[" || initial === "{") {
                        parenlev += 1;
                    } else if (initial === ")" || initial === "]" || initial === "}") {
                        parenlev -= 1;
                    }
                    const type = EXACT_TOKEN_TYPES.get(token) || tokens.OP;
                    yield new TokenInfo(type, token, spos, epos, line);
                }
            } else {
                yield new TokenInfo(tokens.ERRORTOKEN, line[pos], [lnum, pos], [lnum, pos + 1], line);
                pos += 1;
            }
        }
    }

    // Add an implicit NEWLINE if the input doesn't end in one
    if (lastline && !"\r\n".includes(lastline[lastline.length - 1])) {
        yield new TokenInfo(tokens.NEWLINE, "", [lnum - 1, lastline.length], [lnum - 1, lastline.length + 1], "");
    }
    for (const _ in indents.slice(1)) {
        // pop remaining indent levels
        yield new TokenInfo(tokens.DEDENT, "", [lnum, 0], [lnum, 0], "");
    }

    yield new TokenInfo(tokens.ENDMARKER, "", [lnum, 0], [lnum, 0], "");
}
