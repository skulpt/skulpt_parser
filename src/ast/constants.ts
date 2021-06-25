import { assert } from "../parser/pegen.ts";

export class pyConstant<V> {
    _v: V;
    constructor(v: V) {
        this._v = v;
    }
    toString(): string {
        return String(this._v);
    }
    valueOf(): V {
        return this._v;
    }
}

export class pyStr extends pyConstant<string> {
    toString() {
        const v = this._v;
        let quote = "'";
        if (v.includes("'") && !v.includes('"')) {
            quote = '"';
        }
        return quote + v + quote;
    }
}

/** @todo we cant really have bigint here - we could use JSBI or string instead */
export class pyInt extends pyConstant<number | bigint> {}

export class pyFloat extends pyConstant<number> {
    /** @todo - make this string a little more involved */
    toString() {
        const v = this._v;
        if ((v > 0 && v < 0.0001) || (v < 0 && v > -0.0001)) {
            return v.toExponential().replace(/(e[-+])([1-9])$/, "$10$2");
        } else {
            const ret = v.toString();
            return ret.includes(".") ? ret : ret + ".0";
        }
    }
}

export class pyComplex extends pyConstant<{ real: number; imag: number }> {
    constructor(c: { real?: number; imag?: number }) {
        const real = c.real ?? 0.0;
        const imag = c.imag ?? 0.0;
        super({ real, imag });
    }
    toString() {
        const { real, imag } = this._v;
        // this is from the tokenizer and we shouldn't have a real except 0.
        assert(real === 0);
        return imag + "j";
    }
}

export class pyBytes extends pyConstant<Uint8Array> {
    /** @todo toString() */
}

export class pyNoneType extends pyConstant<null> {
    toString() {
        return "None";
    }
}

export class pyBool extends pyConstant<boolean> {
    toString() {
        return this._v ? "True" : "False";
    }
}

export class pyEllipsisType extends pyConstant<"..."> {
    toString() {
        return "Ellipsis";
    }
}

export const pyNone = new pyNoneType(null);
export const pyTrue = new pyBool(true);
export const pyFalse = new pyBool(false);
export const pyEllipsis = new pyEllipsisType("...");
