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
    long = "long",
}

// deno-lint-ignore no-explicit-any
export abstract class pyConstant<V = any> {
    abstract type: ConstantType;
    raw: V;
    constructor(v: V) {
        this.raw = v;
    }
    toString(): string {
        return String(this.raw);
    }
    valueOf(): V {
        return this.raw;
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
}

// this could also be a JSBI.BigInt
// relying on Skulpt adding JSBI to the window object if bigint isn't available
export class pyInt extends pyConstant<number | bigint> {
    type = ConstantType.int;
}

export class pyLong extends pyConstant<number | bigint> {
    type = ConstantType.long;
    toString() {
        return this.raw.toString() + "L";
    }
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
}

export class pyComplex extends pyConstant<{ real: number; imag: number }> {
    type = ConstantType.complex;
    constructor({ real = 0, imag }: { real?: number; imag: number }) {
        // this is from the tokenizer and we shouldn't have a real except 0.
        assert(real === 0);
        super({ real, imag });
    }
    toString() {
        return this.raw.imag + "j";
    }
}

export class pyBytes extends pyConstant<Uint8Array> {
    type = ConstantType.bytes;
    toString() {
        return "b" + _stringRepr(new TextDecoder().decode(this.raw));
    }
}

export class pyNoneType extends pyConstant<null> {
    type = ConstantType.none;
    toString() {
        return "None";
    }
}

export class pyBool extends pyConstant<boolean> {
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
export const pyTrue = new pyBool(true);
export const pyFalse = new pyBool(false);
export const pyEllipsis = new pyEllipsisType("...");
