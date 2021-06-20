import { cmpop, expr } from "../ast/astnodes.ts";

export class CmpopExprPair {
    cmpop: cmpop;
    expr: expr;

    constructor(cmpop: cmpop, expr: expr) {
        this.cmpop = cmpop;
        this.expr = expr;
    }
}

export class KeyValuePair {
    key: expr;
    value: expr;
    constructor(key: expr, value: expr) {
        this.key = key;
        this.value = value;
    }
}

export class KeywordOrStarred {
    element: any;
    is_keyword: boolean;

    constructor(element: any, is_keyword: boolean) {
        this.element = element;
        this.is_keyword = is_keyword;
    }
}

/* These definitions must match corresponding definitions in graminit.h. */
export const SINGLE_INPUT = 256;
export const FILE_INPUT = 257;
export const EVAL_INPUT = 258;
export const FUNC_TYPE_INPUT = 345;

/* This doesn't need to match anything */
export const FSTRING_INPUT = 800;

export type StartRule = 256 | 257 | 258 | 345 | 800;
