// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import { ConstantType, pyConstant } from "./constants.ts";

export function BigUp(v: number | bigint) {}

// export const Add = new AddType();
// export const Sub = new SubType();
// export const Mult = new MultType();
// export const MatMult = new MatMultType();
// export const Div = new DivType();
// export const Mod = new ModType();
// export const Pow = new PowType();
// export const LShift = new LShiftType();
// export const RShift = new RShiftType();
// export const BitOr = new BitOrType();
// export const BitXor = new BitXorType();
// export const BitAnd = new BitAndType();
// export const FloorDiv = new FloorDivType();

export function pyNumber_Add(v: pyConstant, w: pyConstant) {
    const res = v._add(w);
    if (res !== null) {
        return res;
    }
    const vtype = v.type;
    const wtype = w.type;
    if ((wtype !== vtype && wtype === ConstantType.float) || wtype === ConstantType.complex) {
        // for add it's reflective for our mock types so no need for radd
        return w._add(v);
    }
    return null;
}

export function pyNumber_Sub(v: pyConstant, w: pyConstant) {
    const res = v._sub(w);
    if (res !== null) {
        return res;
    }
    const vtype = v.type;
    const wtype = w.type;
    if ((wtype !== vtype && wtype === ConstantType.float) || wtype === ConstantType.complex) {
        // for add it's reflective for our mock types so no need for radd
        return w._sub.call(v, w);
    }
    return null;
}

export function pyNumber_Mult(v: pyConstant, w: pyConstant) {
    const res = v._mult(w);
    if (res !== null) {
        return res;
    }
    const vtype = v.type;
    const wtype = w.type;
    if (
        (wtype !== vtype && vtype === ConstantType.int) ||
        wtype === ConstantType.float ||
        wtype === ConstantType.complex
    ) {
        // for add it's reflective for our mock types so no need for radd
        return w._add(v);
    }
    return null;
}

export function pyNumber_Pow(v: pyConstant, w: pyConstant) {
    const res = v._pow(w);
    if (res !== null) {
        return res;
    }
    const vtype = v.type;
    const wtype = w.type;
    if ((wtype !== vtype && wtype === ConstantType.float) || wtype === ConstantType.complex) {
        // for add it's reflective for our mock types so no need for radd
        return w._pow(v);
    }
    return null;
}

export function pyNumber_Pos(v: pyConstant) {
    return v._pos();
}

export function pyNumber_Neg(v: pyConstant) {
    return v._neg();
}

export function pyNumber_Invert(v: pyConstant) {
    return v._invert();
}

export function pyIsTrue(v: pyConstant) {
    return v._bool();
}
