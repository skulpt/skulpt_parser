// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

/** @todo make sure this get's minified to the exact values in production */
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
    constructor(readonly raw: V) {}
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
    _getitem(_idx: number): pyConstant | null {
        return null;
    }
    get real(): null | number {
        return null;
    }
    get imag(): null | number {
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
    _getitem(idx: number) {
        const cc = this.raw.charCodeAt(idx);
        if (cc >= 0xd800 && cc < 0xe000) {
            return null;
        }
        return new pyStr(this.raw[idx]);
    }
}

// deno-lint-ignore no-explicit-any
type IntFn<T = any> = (v: T, w: T) => T;

let BIG_MAX: bigint;
let BIG_MIN: bigint;
let BIG_UPPER: bigint;
let BIG_LOWER: bigint;
let BIG_ZERO: bigint;
let BIG_ONE: bigint;
let BIG_DIV: (v: bigint, w: bigint) => bigint;
if (typeof BigInt !== "undefined") {
    // don't use 2n etc because that can't be compiled if BigInt is not supported
    BIG_LOWER = BigInt(Number.MAX_SAFE_INTEGER + 1);
    BIG_LOWER = BigInt(-Number.MAX_SAFE_INTEGER - 1);
    BIG_MAX = BigInt(2) ** BigInt(128 - 1) - BigInt(1);
    BIG_MIN = -BIG_MAX;
    BIG_ZERO = BigInt(0);
    BIG_ONE = BigInt(1);
    // because BigInt division truncates rather than doing floor division
    BIG_DIV = (v: bigint, w: bigint) =>
        (v ^ w) > BIG_ZERO ? v / w : v < BIG_ZERO ? (v - BIG_ONE) / w : (v + BIG_ONE) / w;
}
const NUM_UPPER = Number.MAX_SAFE_INTEGER;
const NUM_LOWER = -Number.MAX_SAFE_INTEGER;

/** convert back to number if we're within the safe number range. If we're outside of 128 bits don't optimize */
function convertBigResult(res: bigint): pyInt | null {
    if (res < BIG_UPPER && res > BIG_LOWER) {
        return new pyInt(Number(res));
    }
    if (res < BIG_MAX && res > BIG_MIN) {
        return new pyInt(res);
    }
    return null;
}

/** If the other is not a pyInt or pyBool return false  */
function checkComputableNumber(other: pyConstant) {
    const rawTypeOther = typeof other.raw;
    if (rawTypeOther === "bigint") {
        return true;
    } else if (rawTypeOther !== "number") {
        return false;
    } else if (other.type === ConstantType.float) {
        return false;
    }
    return true; // either other is a pyInt or pyBool
}

function doIntNumber(v: number | bigint, w: number | bigint, fn: IntFn) {
    let res: bigint | number;
    if (typeof v === "number" && typeof w === "number") {
        res = (fn as IntFn<number>)(v, w);
        if (res < NUM_UPPER && res > NUM_LOWER) {
            return new pyInt(res);
        }
    }
    if (typeof BigInt === "undefined") return null;
    v = BigInt(v);
    w = BigInt(w);
    res = (fn as IntFn<bigint>)(v, w);
    return convertBigResult(res);
}

function intDivision(v: number | bigint, w: number | bigint, numFn: IntFn<number>, bigFn: IntFn<bigint>) {
    if (w === 0) {
        return null; // can't divide by zero
    }
    let fn: IntFn;
    if (typeof v === "number" && typeof w === "number") {
        fn = numFn;
    } else {
        // we knowe we'll end up here and bigint division is like py floor division
        fn = bigFn;
    }
    return doIntNumber(v, w, fn);
}

// this could also be a JSBI.BigInt
// relying on Skulpt adding JSBI to the window object if bigint isn't available
export class pyInt extends pyConstant<number | bigint> {
    type = ConstantType.int;
    _add(other: pyConstant): null | pyInt {
        if (checkComputableNumber(other)) {
            return doIntNumber(this.raw, other.raw, (v, w) => v + w);
        }
        return null;
    }
    _sub(other: pyConstant): null | pyInt {
        if (checkComputableNumber(other)) {
            return doIntNumber(this.raw, other.raw, (v, w) => v - w);
        }
        return null;
    }
    _mult(other: pyConstant): null | pyInt {
        if (checkComputableNumber(other)) {
            return doIntNumber(this.raw, other.raw, (v, w) => v * w);
        }
        return null;
    }
    _pow(other: pyConstant): null | pyInt | pyFloat {
        if (checkComputableNumber(other)) {
            const exponent = other.raw;
            const isNegExponent = other.raw < 0;
            /** @todo we need to make sure that this doesn't get minified to Number.pow */
            if (this.raw === 0 && isNegExponent) return null;
            const res = doIntNumber(this.raw, isNegExponent ? -exponent : exponent, (v, w) => v ** w);
            if (res === null) {
                return res;
            } else if (isNegExponent) {
                return new pyFloat(1 / Number(res.raw));
            }
            return res;
        }
        return null;
    }
    _div(other: pyConstant): null | pyFloat {
        return pyFloat.prototype._div.call(this, other);
    }
    _mod(other: pyConstant): null | pyInt {
        if (checkComputableNumber(other)) {
            return intDivision(
                this.raw,
                other.raw,
                (v, w) => v - Math.floor(v / w) * w,
                (v, w) => v - BIG_DIV(v, w) * w
            );
        }
        return null;
    }
    _floordiv(other: pyConstant): null | pyInt {
        if (checkComputableNumber(other)) {
            return intDivision(this.raw, other.raw, (v, w) => Math.floor(v / w), BIG_DIV);
        }
        return null;
    }
    _pos() {
        const raw = this.raw;
        if (typeof raw === "object") return null;
        return new pyInt(raw); // could return this but we could also be a pyBool
    }
    _neg() {
        const raw = this.raw;
        if (typeof raw === "object") return null;
        return new pyInt(-raw);
    }
    _invert() {
        const raw = this.raw;
        if (typeof raw === "number") {
            if (raw < 2 ** 31 && raw > -(2 ** 31)) {
                return new pyInt(~raw);
            }
            // fallthrough
        }
        if (typeof BigInt !== "undefined") {
            return convertBigResult(~BigInt(raw));
        }
        return null;
    }
    // for bitshift slots we know `other` must be a pyInt (see pyLshift and friends)
    // we also kno BigInt is defined
    // just use bigint and scale back since
    // javascript bitshift slots don't work like python
    // but bigint bitshift slots do
    _lshift(other: pyInt): pyInt | null {
        if (other.raw < 0) return null;
        const res = BigInt(this.raw) << BigInt(other.raw);
        return convertBigResult(res);
    }
    _rshift(other: pyInt): pyInt | null {
        if (other.raw < 0) return null;
        const res = BigInt(this.raw) >> BigInt(other.raw);
        return convertBigResult(res);
    }
    _or(other: pyInt): pyInt | null {
        const res = BigInt(this.raw) | BigInt(other.raw);
        return convertBigResult(res);
    }
    _and(other: pyInt): pyInt | null {
        const res = BigInt(this.raw) & BigInt(other.raw);
        return convertBigResult(res);
    }
    _xor(other: pyInt): pyInt | null {
        const res = BigInt(this.raw) ^ BigInt(other.raw);
        return convertBigResult(res);
    }
    get real() {
        return Number(this.raw);
    }
    get imag() {
        return 0;
    }
}

/** don't bother optimizing longs */
export class pyLong extends pyConstant<number | bigint> {
    type = ConstantType.long;
    toString() {
        return this.raw.toString() + "L";
    }
}

/** we allow the `this` argument of float to be any pyConstant. This means we don't need to worry about reversed slots. It's also what cpython does */
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
    _sub(this: pyConstant, other: pyConstant): pyFloat | null {
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
    _div(this: pyConstant, other: pyConstant): pyFloat | null {
        return doFloatNumber(this, other, (v, w) => {
            if (w === 0) return null; // can't divide by zero
            if (!isFinite(v) || !isFinite(w)) return null; // let's not bother optimizing this
            return v / w;
        });
    }
    _floordiv(this: pyConstant, other: pyConstant): pyFloat | null {
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
    get real() {
        return this.raw;
    }
    get imag() {
        return 0;
    }
}

function doComplexNumber(
    self: pyConstant,
    other: pyConstant,
    fn: (vreal: number, wreal: number, vimag: number, wimag: number) => pyComplex | null
) {
    const vreal = self.real;
    const wreal = other.real;
    if (vreal === null || wreal === null) {
        return null;
    }
    const vimag = self.imag as number;
    const wimag = other.imag as number;
    return fn(vreal, wreal, vimag, wimag);
}
export class pyComplex extends pyConstant<{ real: number; imag: number }> {
    type = ConstantType.complex;
    constructor({ real = 0, imag }: { real?: number; imag: number }) {
        // tokenizer will always have a real=0. But optimizations might instantiate with something else;
        super({ real, imag });
    }
    toString() {
        let head = "";
        let tail = "";
        if (this.raw.real) {
            head = "(" + this.raw.real;
            if (this.raw.imag >= 0) {
                head += "+";
            }
            tail = ")";
        }
        return head + this.raw.imag + "j" + tail;
    }
    _bool() {
        return !(this.raw.real === 0 && this.raw.imag === 0);
    }
    _add(other: pyConstant): pyComplex | null {
        return doComplexNumber(this, other, (vreal, wreal, vimag, wimag) => {
            const real = vreal + wreal;
            const imag = vimag + wimag;
            return new pyComplex({ real, imag });
        });
    }
    _sub(other: pyConstant): pyComplex | null {
        return doComplexNumber(this, other, (vreal, wreal, vimag, wimag) => {
            const real = vreal - wreal;
            const imag = vimag - wimag;
            return new pyComplex({ real, imag });
        });
    }
    _mult(other: pyConstant): pyComplex | null {
        return doComplexNumber(this, other, (vreal, wreal, vimag, wimag) => {
            const real = vreal * wreal - wimag * vimag;
            const imag = vreal * wimag + vimag * wreal;
            return new pyComplex({ real, imag });
        });
    }
    _pos(): pyComplex {
        return this;
    }
    _neg() {
        const real = -this.real;
        const imag = -this.imag;
        return new pyComplex({ real, imag });
    }
    get real() {
        return this.raw.real;
    }
    get imag() {
        return this.raw.imag;
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
    _getitem(idx: number) {
        return new pyInt(this.raw[idx]);
    }
}

/** we only get constant tuples from optimizations */
export class pyTuple extends pyConstant<pyConstant[]> {
    type = ConstantType.tuple;
    toString() {
        return "(" + this.raw.join(", ") + (this.raw.length === 1 ? "," : "") + ")";
    }
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
    _getitem(idx: number) {
        return this.raw[idx];
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
    _and(other: pyInt): pyBool | pyInt | null {
        if (other.type === ConstantType.bool) {
            return new pyBool((this.raw as number) & (other.raw as number));
        }
        return super._and(other);
    }
    _or(other: pyInt): pyBool | pyInt | null {
        if (other.type === ConstantType.bool) {
            return new pyBool((this.raw as number) | (other.raw as number));
        }
        return super._or(other);
    }
    _xor(other: pyInt): pyBool | pyInt | null {
        if (other.type === ConstantType.bool) {
            return new pyBool((this.raw as number) ^ (other.raw as number));
        }
        return super._xor(other);
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
