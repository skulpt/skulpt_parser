// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import { assert } from "../util/assert.ts";

export const enum ConstantType {
    str = "str",
    int = "int",
    float = "float",
    complex = "complex",
    bytes = "bytes",
    none = "none",
    bool = "bool",
    ellipsis = "ellipsis",
    tuple = "tuple",
    long = "long",
}

// deno-lint-ignore no-explicit-any
export abstract class pyConstant<V = any> {
    abstract type: ConstantType;
    raw: V;
    constructor(v: V) {
        this.raw = v;
    }
    get [Symbol.toStringTag]() {
        return `${this.type}(${this.toString()})`;
    }
    toString(): string {
        return String(this.raw);
    }
    valueOf(): V {
        return this.raw;
    }
    _add(_other: pyConstant): null | pyConstant {
        return null;
    }
    _sub(_other: pyConstant): null | pyConstant {
        return null;
    }
    _mult(_other: pyConstant): null | pyConstant {
        return null;
    }
    _div(_other: pyConstant): null | pyConstant {
        return null;
    }
    _mod(_other: pyConstant): null | pyConstant {
        return null;
    }
    _pow(_other: pyConstant): null | pyConstant {
        return null;
    }
    _lshift(_other: pyConstant): null | pyConstant {
        return null;
    }
    _rshift(_other: pyConstant): null | pyConstant {
        return null;
    }
    _or(_other: pyConstant): null | pyConstant {
        return null;
    }
    _xor(_other: pyConstant): null | pyConstant {
        return null;
    }
    _and(_other: pyConstant): null | pyConstant {
        return null;
    }
    _floordiv(_other: pyConstant): null | pyConstant {
        return null;
    }
    _bool(): boolean {
        return !!this.raw;
    }
    _invert(): pyConstant | null {
        return null;
    }
    _pos(): pyConstant | null {
        return null;
    }
    _neg(): pyConstant | null {
        return null;
    }
}

const _escape = { "\n": "n", "\r": "r", "\t": "t", "\\": "\\", "'": "'", '"': '"' };

function _stringRepr(v: string): string {
    const quote = v.includes("'") && !v.includes('"') ? '"' : "'";
    const toEscape = new RegExp(`([\\n\\r\\\\\t${quote}])`, "g");
    v = v.replace(toEscape, (_m, m1) => "\\" + _escape[m1 as keyof typeof _escape]);
    // deno-lint-ignore no-control-regex
    v = v.replace(/[\x00-\x1f]/g, (m) => "\\x" + m.charCodeAt(0).toString(16).padStart(2, "0"));
    return quote + v + quote;
}

export class pyStr extends pyConstant<string> {
    type = ConstantType.str;
    toString() {
        return _stringRepr(this.raw);
    }
    _add(other: pyConstant) {
        if (other.type !== ConstantType.str) {
            return null;
        }
        return new pyStr(this.raw + other.raw);
    }
    _mult(other: pyConstant) {
        if (typeof other.raw !== "number") {
            return null;
        } else if (other.type === ConstantType.float) {
            return null;
        }
        const int = other.raw;
        if (int < 0 || int * this.raw.length > 4096) {
            return null;
        }
        return new pyStr(this.raw.repeat(int));
    }
}

type intFn = (v: any, w: any) => any;

let BIG_MAX: bigint;
let BIG_MIN: bigint;
let BIG_UPPER: bigint;
let BIG_LOWER: bigint;
const NUM_UPPER = Number.MAX_SAFE_INTEGER;
const NUM_LOWER = -Number.MAX_SAFE_INTEGER;

function convertBigResult(res: bigint): pyInt | null {
    // lazy load these since we don't know if BigInt exists
    // but if we've made it to this function then BigInt does exist.
    BIG_LOWER ??= BigInt(Number.MAX_SAFE_INTEGER + 1);
    BIG_LOWER ??= BigInt(-Number.MAX_SAFE_INTEGER - 1);
    BIG_MAX ??= BigInt(2) ** BigInt(128 - 1) - BigInt(1);
    BIG_MIN ??= -BIG_MAX;
    if (res < BIG_UPPER && res > BIG_LOWER) {
        return new pyInt(Number(res));
    }
    if (res < BIG_MAX && res > BIG_MIN) {
        return new pyInt(res);
    }
    return null;
}

function checkComputableNumber(self: pyConstant, other: pyConstant, intRequired = true) {
    const rawTypeSelf = typeof self.raw;
    const rawTypeOther = typeof other.raw;
    if (rawTypeSelf === "number") {
        if (intRequired && self.type === ConstantType.float) {
            return false;
        }
    } else if (rawTypeSelf !== "bigint") {
        return false;
    }
    if (rawTypeOther === "number") {
        if (intRequired && other.type === ConstantType.float) {
            return false;
        }
    } else if (rawTypeOther !== "bigint") {
        return false;
    }
    return true;
}

function doIntNumber(v: number | bigint, w: number | bigint, fn: intFn) {
    const typev = typeof v;
    const typew = typeof w;
    let res;
    if (typev === "number" && typew === "number") {
        res = fn(v, w) as number;
        if (res < NUM_UPPER && res > -NUM_LOWER) {
            return new pyInt(res);
        }
    }
    if (typeof BigInt === "undefined") return null;
    v = BigInt(v);
    w = BigInt(w);
    res = fn(v, w) as bigint;
    return convertBigResult(res);
}

// this could also be a JSBI.BigInt
// relying on Skulpt adding JSBI to the window object if bigint isn't available
export class pyInt extends pyConstant<number | bigint> {
    type = ConstantType.int;
    _add(other: pyConstant): null | pyInt {
        if (checkComputableNumber(this, other)) {
            return doIntNumber(this.raw, other.raw, (v, w) => v + w);
        }
        return null;
    }
    _sub(other: pyConstant): null | pyInt {
        if (checkComputableNumber(this, other)) {
            return doIntNumber(this.raw, other.raw, (v, w) => v - w);
        }
        return null;
    }
    _mult(other: pyConstant): null | pyInt {
        if (checkComputableNumber(this, other)) {
            return doIntNumber(this.raw, other.raw, (v, w) => v * w);
        }
        return null;
    }
    _pow(other: pyConstant): null | pyInt | pyFloat {
        if (checkComputableNumber(this, other)) {
            const exponent = other.raw;
            const isNegExponent = other.raw < 0;
            const res = doIntNumber(this.raw, isNegExponent ? -exponent : exponent, (v, w) => v ** w);
            if (res === null) {
                return res;
            } else if (isNegExponent) {
                return new pyFloat(1 / Number(res.raw));
            } else {
                return res;
            }
        }
        return null;
    }
    _div(other: pyConstant): null | pyFloat {
        return pyFloat.prototype._div.call(this, other);
    }
    _floordiv(other: pyConstant): null | pyInt {
        if (checkComputableNumber(this, other)) {
            const v = this.raw;
            const w = other.raw;
            if (w === 0) return null;
            let fn: intFn;
            if (typeof v === "number" && typeof w === "number") {
                fn = (v, w) => Math.floor(v / w);
            } else {
                fn = (v, w) => v / w;
            }
            return doIntNumber(v, w, fn);
        }
        return null;
    }
    _pos() {
        const raw = this.raw;
        if (typeof raw === "object") return null;
        return new pyInt(raw);
    }
    _neg() {
        const raw = this.raw;
        if (typeof raw === "object") return null;
        return new pyInt(-raw);
    }
    _invert() {
        const raw = this.raw;
        if (typeof raw === "object") return null;
        return new pyInt(~raw);
    }
}

export class pyLong extends pyConstant<number | bigint> {
    type = ConstantType.long;
    toString() {
        return this.raw.toString() + "L";
    }
}

function doFloatNumber(self: pyConstant, other: pyConstant, fn: (v: number, w: number) => number | null) {
    let v = self.raw;
    let w = other.raw;
    const vtype = typeof v;
    const wtype = typeof w;
    if (vtype === "number") {
        // pass
    } else if (vtype === "bigint") {
        v = Number(v);
    } else {
        return null;
    }
    if (wtype === "number") {
        // pass
    } else if (wtype === "bigint") {
        w = Number(w);
    } else {
        return null;
    }
    const res = fn(v, w);
    return res === null ? res : new pyFloat(res);
}

export class pyFloat extends pyConstant<number> {
    type = ConstantType.float;
    toString() {
        const v = this.raw;
        if ((v > 0 && v < 0.0001) || (v < 0 && v > -0.0001)) {
            return v.toExponential().replace(/(e[-+])([1-9])$/, "$10$2");
        } else {
            const ret = v.toString();
            return ret.includes(".") ? ret : ret + ".0";
        }
    }
    _add(other: pyConstant): pyFloat | null {
        return doFloatNumber(this, other, (v, w) => v + w);
    }
    _sub(other: pyConstant): pyFloat | null {
        return doFloatNumber(this, other, (v, w) => v - w);
    }
    _mult(other: pyConstant): pyFloat | null {
        return doFloatNumber(this, other, (v, w) => v * w);
    }
    _pow(other: pyConstant): pyFloat | null {
        return doFloatNumber(this, other, (v, w) => {
            if (v < 0 && w % 1 !== 0) return null; // negative number cannot be raised to a fractional power
            if (v === 0 && w < 0) return null; // 0.0 cannot be raised to a negative power
            const res = Math.pow(v, w);
            if (Math.abs(res) === Infinity && Math.abs(v) !== Infinity && Math.abs(w) !== Infinity) {
                return null; // Numerical result out of range
            }
            return res;
        });
    }
    _div(other: pyConstant): pyFloat | null {
        return doFloatNumber(this, other, (v, w) => {
            if (w === 0) return null;
            if (!isFinite(v) || !isFinite(w)) return null;
            return v / w;
        });
    }
    _floordiv(other: pyConstant): pyFloat | null {
        return doFloatNumber(this, other, (v, w) => {
            if (w === 0) return null;
            if (!isFinite(v) || !isFinite(w)) return null;
            return Math.floor(v / w);
        });
    }
    _pos() {
        return this;
    }
    _neg() {
        return new pyFloat(-this.raw);
    }
}

export class pyComplex extends pyConstant<{ real: number; imag: number }> {
    type = ConstantType.complex;
    constructor({ real = 0, imag }: { real?: number; imag: number }) {
        // this is from the tokenizer and we shouldn't have a real except 0.
        // assert(real === 0);
        super({ real, imag });
    }
    toString() {
        return this.raw.imag + "j";
    }
    _bool() {
        return this.raw.real === 0 && this.raw.imag === 0;
    }
    _pos(): pyComplex {
        return this;
    }
    _neg() {
        let { real, imag } = this.raw;
        real = -real;
        imag = -imag;
        return new pyComplex({ real, imag });
    }
}

export class pyBytes extends pyConstant<Uint8Array> {
    type = ConstantType.bytes;
    toString() {
        return "b" + _stringRepr(new TextDecoder().decode(this.raw));
    }
    _bool() {
        return !!this.raw.length;
    }
    _add(other: pyConstant): pyBytes | null {
        if (other.type === ConstantType.bytes) {
            const newArr = new Uint8Array(this.raw.length + (other as pyBytes).raw.length);
            newArr.set(this.raw, 0);
            newArr.set(other.raw, this.raw.length);
            return new pyBytes(newArr);
        }
        return null;
    }
    _mult(other: pyConstant): pyBytes | null {
        if (typeof other.raw !== "number") {
            return null;
        } else if (other.type === ConstantType.float) {
            return null;
        }
        const int = other.raw;
        const arr = this.raw;
        const arrLen = arr.length;
        const newLen = int * arrLen;
        if (int < 0 || newLen > 4096) {
            return null;
        }
        const newRaw = new Uint8Array(newLen);
        for (let i = 0; i < newLen; i += arrLen) {
            newRaw.set(arr, i);
        }
        return new pyBytes(newRaw);
    }
}

export class pyTuple extends pyConstant<pyConstant[]> {
    type = ConstantType.tuple;
    _bool() {
        return !!this.raw.length;
    }
    _add(other: pyConstant): pyTuple | null {
        if (other.type === ConstantType.tuple) {
            return new pyTuple(this.raw.concat(other.raw));
        }
        return null;
    }
    _mult(other: pyConstant): pyTuple | null {
        if (typeof other.raw !== "number") {
            return null;
        } else if (other.type === ConstantType.float) {
            return null;
        }
        const int = other.raw;
        const arr = this.raw;
        const arrLen = arr.length;
        const newLen = int * arrLen;
        if (int < 0 || newLen > 256) {
            return null;
        }
        const newRaw = new Array(newLen);
        for (let i = 0; i < newLen; i += arrLen) {
            for (let j = 0; j < arrLen; j++) {
                newRaw[i + j] = arr[j];
            }
        }
        return new pyTuple(newRaw);
    }
    toString() {
        return "(" + this.raw.join(", ") + (this.raw.length === 1 ? "," : "") + ")";
    }
}

export class pyNoneType extends pyConstant<null> {
    type = ConstantType.none;
    toString() {
        return "None";
    }
}

export class pyBool extends pyInt {
    type = ConstantType.bool;
    toString() {
        return this.raw ? "True" : "False";
    }
}

export class pyEllipsisType extends pyConstant<"..."> {
    type = ConstantType.ellipsis;
    toString() {
        return "Ellipsis";
    }
}

export const pyNone = new pyNoneType(null);
export const pyTrue = new pyBool(1);
export const pyFalse = new pyBool(0);
export const pyEllipsis = new pyEllipsisType("...");
