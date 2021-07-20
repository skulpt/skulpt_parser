// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT
import { pyComplex, pyFloat, pyInt } from "../ast/constants.ts";
import { Floatnumber } from "../tokenize/tokenize.ts";
declare global {
    var JSBI: { BigInt: typeof BigInt };
}

const FLOAT_RE = new RegExp(Floatnumber);

/**
 * convert string to complex, float or int (or @todo long).
 * Much of the checking has been done in the tokenizer
 * we can rely on the resulting number being valid and positive
 * */
export function parsenumber(s: string): pyFloat | pyComplex | pyInt {
    /**@todo invalid decimal literals with bad underscores should be thrown in the tokenizer - this is thrown in cpython's tokenizer */
    s = s.replaceAll("_", ""); // we already know that we have a valid underscore number from the tokenizer

    const end = s[s.length - 1];
    // we know it's just a single floating point imaginary complex number
    if (end === "j" || end === "J") {
        return new pyComplex({ imag: parseFloat(s.slice(0, -1)) });
    }
    /** @todo Longs */

    // use the tokenizer float test
    if (FLOAT_RE.test(s)) {
        return new pyFloat(parseFloat(s));
    }

    // we know it's a valid octal, hex, binary or decimal so let Number do its thing
    const val = Number(s); // we can rely on this since we know s is positive and is already a valid int literal
    if (val > Number.MAX_SAFE_INTEGER) {
        const val = typeof BigInt === "undefined" ? JSBI.BigInt(s) : BigInt(s);
        return new pyInt(val);
    }
    return new pyInt(val);
}
