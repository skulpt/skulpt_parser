// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import { ConstantType, pyConstant } from "./constants.ts";

type BinOpName =
    | "_add"
    | "_sub"
    | "_mult"
    | "_pow"
    | "_div"
    | "_mod"
    | "_floordiv"
    | "_lshift"
    | "_rshift"
    | "_and"
    | "_or"
    | "_xor";

function numberBinOp(op: BinOpName, reflect = false, includeInt = false) {
    return (v: pyConstant, w: pyConstant): pyConstant | null => {
        const res = v[op](w);
        if (res !== null) {
            return res;
        }
        const vtype = v.type;
        const wtype = w.type;
        if (
            wtype !== vtype &&
            (wtype === ConstantType.float ||
                wtype === ConstantType.complex ||
                (includeInt && vtype === ConstantType.int))
        ) {
            // for add it's reflective for our mock types so no need for radd
            return reflect ? w[op].call(v, w) : w[op](v);
        }
        return null;
    };
}

export const pyAdd = numberBinOp("_add");
export const pySub = numberBinOp("_sub", true);
export const pyMult = numberBinOp("_mult", false, true); // sq_repeat for tuple and str
export const pyPow = numberBinOp("_pow");
export const pyDiv = numberBinOp("_div", true);
export const pyMod = numberBinOp("_mod", true);
export const pyFloorDiv = numberBinOp("_floordiv", true);

function intOnlyBinOp(op: BinOpName) {
    if (typeof BigInt === "undefined") {
        // don't bother optimizing if we don't have BigInt available for bit shift slots
        return () => null;
    }
    return (v: pyConstant, w: pyConstant): pyConstant | null => {
        const vtype = v.type;
        const wtype = w.type;
        if (vtype !== ConstantType.int && vtype !== ConstantType.bool) {
            return null;
        }
        if (wtype !== ConstantType.int && wtype !== ConstantType.bool) {
            return null;
        }
        return v[op](w);
    };
}

export const pyLshift = intOnlyBinOp("_lshift");
export const pyRshift = intOnlyBinOp("_rshift");
export const pyOr = intOnlyBinOp("_or");
export const pyAnd = intOnlyBinOp("_and");
export const pyXor = intOnlyBinOp("_xor");

export function pyPos(v: pyConstant) {
    return v._pos();
}

export function pyNeg(v: pyConstant) {
    return v._neg();
}

export function pyInvert(v: pyConstant) {
    return v._invert();
}

export function pyIsTrue(v: pyConstant) {
    return v._bool();
}

/** we can only get from tuples, str or bytes. And only if the item is a pyInt with an internal number */
export function pyGetItem(v: pyConstant, item: pyConstant) {
    const len = v.raw?.length;
    if (len === undefined) {
        return null;
    }
    let idx = item.raw;
    if (typeof idx !== "number") {
        return null;
    } else if (item.type === ConstantType.float) {
        return null;
    }
    if (idx < 0) {
        idx += len;
    }
    if (idx < 0 || idx >= len) {
        return null;
    }
    return v._getitem(idx);
}
