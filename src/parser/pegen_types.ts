import { arg, cmpop, expr, operator } from "../ast/astnodes.ts";

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

export class AugOperator {
    kind: operator;
    constructor(kind: operator) {
        this.kind = kind;
    }
}

export class NameDefaultPair {
    arg: arg;
    value: expr;
    constructor(arg: arg, value: expr) {
        this.arg = arg;
        this.value = value;
    }
}

export class SlashWithDefault {
    plain_names: any[]; /**@todo */
    names_with_defaults: NameDefaultPair[]; // asdl_seq* of NameDefaultsPair's
    constructor(plain_names: any[], names_with_defaults: NameDefaultPair[]) {
        this.plain_names = plain_names;
        this.names_with_defaults = names_with_defaults;
    }
}
export class StarEtc {
    vararg: arg;
    kwonlyargs: NameDefaultPair[]; // asdl_seq* of NameDefaultsPair's
    kwarg: arg;
    constructor(vararg: arg, kwonlyargs: NameDefaultPair[], kwarg: arg) {
        this.vararg = vararg;
        this.kwonlyargs = kwonlyargs;
        this.kwarg = kwarg;
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
