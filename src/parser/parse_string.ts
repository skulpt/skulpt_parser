import { pySyntaxError } from "../ast/errors.ts";
import { TokenInfo } from "../tokenize/tokenize.ts";
import { Parser } from "./parser.ts";

// deno-lint-ignore no-control-regex
const nonAscii = /[^\x00-\x7F]/;

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
            } else if (quote == "r" || quote == "R") {
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

    if (bytesmode && nonAscii.test(s)) {
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
