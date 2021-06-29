// deno-lint-ignore-file camelcase
import { Ll, Lm, Lo, Lt, Lu, Mc, Mn, Nd, Nl, Pc } from "./unicode.ts";

const the_underscore = "_";
const Other_ID_Start = "\\u1885-\\u1886\\u2118\\u212E\\u309B-\\u309C";
const Other_ID_Continue = "\\u00B7\\u0387\\u1369-\\u1371\\u19DA";
const id_start = Lu + Ll + Lt + Lm + Lo + Nl + the_underscore + Other_ID_Start;
const id_continue = id_start + Mn + Mc + Nd + Pc + Other_ID_Continue;

const IS_IDENTIFIER_REGEX = new RegExp("^([" + id_start + "])+([" + id_continue + "])*$");

export function isIdentifier(s: string): boolean {
    return IS_IDENTIFIER_REGEX.test(s.normalize("NFKC"));
}

const IS_SPACE = /^\s+$/;
export function isSpace(s: string): boolean {
    return IS_SPACE.test(s);
}
