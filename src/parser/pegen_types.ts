import { arg, cmpop, expr, keyword, operator, Starred } from "../ast/astnodes.ts";
import { pyNone, pyNoneType } from "../ast/constants.ts";

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

export type exprOrNone = expr | pyNoneType;
export class NameDefaultPair {
    arg: arg;
    value: exprOrNone;
    constructor(arg: arg, value: expr | null) {
        this.arg = arg;
        this.value = value ?? pyNone;
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

type KeywordOrStarredElement<IsKeyword> = IsKeyword extends true
    ? keyword
    : IsKeyword extends false
    ? Starred
    : keyword | Starred;

export class KeywordOrStarred<IsKeyword extends boolean = boolean> {
    element: KeywordOrStarredElement<IsKeyword>;
    is_keyword: IsKeyword;

    constructor(element: KeywordOrStarredElement<IsKeyword>, is_keyword: IsKeyword) {
        this.element = element;
        this.is_keyword = is_keyword;
    }
}

export class KeywordToken {
    name: string;
    type: number;

    constructor(name: string, type: number) {
        this.name = name;
        this.type = type;
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
