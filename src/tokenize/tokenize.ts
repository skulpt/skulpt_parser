// deno-lint-ignore-file camelcase
import { w } from "../util/unicode.ts";
import { isIdentifier } from "../util/str_helpers.ts";
import { tokens, EXACT_TOKEN_TYPES } from "./token.ts";
import { pyIndentationError, pySyntaxError } from "../ast/errors.ts";

type token = number;
type position = [number, number];
export class TokenInfo {
    type: token;
    string: string;
    start: position;
    end: position;
    line: string;
    constructor(type: token, string: string, start: position, end: position, line: string) {
        this.type = type;
        this.string = string;
        this.start = start;
        this.end = end;
        this.line = line;
    }
    get exact_type(): token {
        if (this.type === tokens.OP && this.string in EXACT_TOKEN_TYPES) {
            return EXACT_TOKEN_TYPES[this.string];
        } else {
            return this.type;
        }
    }
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

const group = (...choices: string[]): string => "(" + choices.join("|") + ")";
const any = (...choices: string[]): string => group(...choices) + "*";
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
const Comment_ = "#[^\\r\\n]*";
const _Ignore = Whitespace + any("\\\\\\r?\\n" + Whitespace) + maybe(Comment_);
const Name = "[" + w + "]+";

const Exponent = "[eE][-+]?[0-9](?:_?[0-9])*";
const Pointfloat = group("[0-9](?:_?[0-9])*\\.(?:[0-9](?:_?[0-9])*)?", "\\.[0-9](?:_?[0-9])*") + maybe(Exponent);
const Expfloat = "[0-9](?:_?[0-9])*" + Exponent;
export const Floatnumber = group(Pointfloat, Expfloat);
const Imagnumber = group("[0-9](?:_?[0-9])*[jJ]", Floatnumber + "[jJ]");

// Return the empty string, plus all of the valid string prefixes.
function _all_string_prefixes(): string[] {
    return [
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
}

// Note that since _all_string_prefixes includes the empty string,
//  StringPrefix can be the empty string (making it optional).
const StringPrefix = group(..._all_string_prefixes());

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
// Single-line ' or " string.
const String_ = group(
    StringPrefix + "'[^\\n'\\\\]*(?:\\\\.[^\\n'\\\\]*)*'",
    StringPrefix + '"[^\\n"\\\\]*(?:\\\\.[^\\n"\\\\]*)*"'
);

// Sorting in reverse order puts the long operators before their prefixes.
// Otherwise if = came before ==, == would get recognized as two instances
// of =.

const EXACT_TOKENS_SORTED = Object.keys(EXACT_TOKEN_TYPES).sort();
const Special = group(...EXACT_TOKENS_SORTED.reverse().map((t) => regexEscape(t)));
const Funny = group("\\r?\\n", Special);

const ContStr = group(
    StringPrefix + "'[^\\n'\\\\]*(?:\\\\.[^\\n'\\\\]*)*" + group("'", "\\\\\\r?\\n"),
    StringPrefix + '"[^\\n"\\\\]*(?:\\\\.[^\\n"\\\\]*)*' + group('"', "\\\\\\r?\\n")
);
const PseudoExtras = group("\\\\\\r?\\n|$", Comment_, Triple);

// For a given string prefix plus quotes, endpats maps it to a regex
//  to match the remainder of that string. _prefix can be empty, for
//  a normal single or triple quoted string (with no prefix).
const endpats: { [endpat: string]: string } = {};
const prefixes = _all_string_prefixes();
for (const _prefix of prefixes) {
    endpats[_prefix + "'"] = Single;
    endpats[_prefix + '"'] = Double;
    endpats[_prefix + "'''"] = Single3;
    endpats[_prefix + '"""'] = Double3;
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

const Hexnumber = "0[xX](?:_?[0-9a-fA-F])+";
const Binnumber = "0[bB](?:_?[01])+";
const Octnumber = "0[oO](?:_?[0-7])+";
const Decnumber = "(?:0(?:_?0)*|[1-9](?:_?[0-9])*)";
const Intnumber = group(Hexnumber, Binnumber, Octnumber, Decnumber);
const Number_ = group(Imagnumber, Floatnumber, Intnumber);
const PseudoToken = Whitespace + group(PseudoExtras, Number_, Funny, ContStr, Name);

const PseudoTokenRegexp = new RegExp(PseudoToken);

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
    const numchars = "0123456789";
    let lnum = 0,
        parenlev = 0,
        continued = 0,
        contstr = "",
        needcont = 0,
        contline: null | string = null,
        indents: number[] = [0],
        capos: null | string = null,
        endprog = / /g, // keep type checker happy (endprog gets used before assignment)
        strstart: position = [0, 0], // keep type checker happy (strstart gets used before assignment)
        end: number,
        pseudomatch: RegExpExecArray | null;

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
        let endmatch: RegExpExecArray | null;

        if (contstr) {
            // continued string
            if (!line) {
                yield new TokenInfo(tokens.ERRORTOKEN, "EOF in multi-line statement", [lnum, pos], [lnum, pos], line);
                // if the Praser didn't throw they we throw
                throw new pySyntaxError("EOF in multi-line string", [filename, ...strstart, lastline]);
            }
            endprog.lastIndex = 0;
            endmatch = endprog.exec(line);
            if (endmatch) {
                pos = end = endmatch[0].length;
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
                if (line[pos] === " ") {
                    column += 1;
                } else if (line[pos] === "\t") {
                    column = Math.floor(column / tabsize + 1) * tabsize;
                } else if (line[pos] === "\f") {
                    column = 0;
                } else {
                    break;
                }
                pos += 1;
            }

            if (pos === max) {
                break;
            }

            if ("#\r\n".includes(line[pos])) {
                // skip comments or blank lines
                if (line[pos] === "#") {
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
            capos = line.charAt(pos);
            while (capos === " " || capos === "\f" || capos === "\t") {
                pos += 1;
                capos = line.charAt(pos);
            }

            pseudomatch = PseudoTokenRegexp.exec(line.substring(pos));
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
                    numchars.includes(initial) || // ordinary number
                    (initial === "." && token !== "." && token !== "...")
                ) {
                    yield new TokenInfo(tokens.NUMBER, token, spos, epos, line);
                } else if ("\r\n".includes(initial)) {
                    if (parenlev > 0) {
                        yield new TokenInfo(tokens.NL, token, spos, epos, line);
                    } else {
                        yield new TokenInfo(tokens.NEWLINE, token, spos, epos, line);
                    }
                } else if (initial === "#") {
                    //assert not token.endswith("\n")
                    yield new TokenInfo(tokens.COMMENT, token, spos, epos, line);
                } else if (triple_quoted.has(token)) {
                    endprog = RegExp(endpats[token]);
                    endmatch = endprog.exec(line.substring(pos));
                    if (endmatch) {
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
                    single_quoted.has(initial) ||
                    single_quoted.has(token.substring(0, 2)) ||
                    single_quoted.has(token.substring(0, 3))
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
                        endprog = RegExp(endpats[initial] || endpats[token[1]] || endpats[token[2]]);
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
                } else if (isIdentifier(initial)) {
                    // ordinary name
                    yield new TokenInfo(tokens.NAME, token, spos, epos, line);
                } else if (initial === "\\") {
                    // continued stmt
                    continued = 1;
                } else {
                    if ("([{".includes(initial)) {
                        parenlev += 1;
                    } else if (")]}".includes(initial)) {
                        parenlev -= 1;
                    }
                    const tok = new TokenInfo(tokens.OP, token, spos, epos, line);
                    tok.type = tok.exact_type;
                    yield tok;
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
