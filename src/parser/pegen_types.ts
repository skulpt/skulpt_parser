// deno-lint-ignore-file camelcase
import { arg, Attrs, cmpop, expr, keyword, operator, Starred } from "../ast/astnodes.ts";

export class CmpopExprPair {
    cmpop: cmpop;
    expr: expr;

    constructor(cmpop: cmpop, expr: expr) {
        this.cmpop = cmpop;
        this.expr = expr;
    }
}

export class KeyValuePair<K = expr | null> {
    key: K; // null signals that we're an unpacking like **a
    value: expr;
    constructor(key: K, value: expr) {
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

export class NameDefaultPair<V = expr | null> {
    arg: arg;
    value: V;
    constructor(arg: arg, value: V) {
        this.arg = arg;
        this.value = value;
    }
}

export class SlashWithDefault {
    plain_names: arg[];
    names_with_defaults: NameDefaultPair<expr>[]; // asdl_seq* of NameDefaultsPair's
    constructor(plain_names: arg[], names_with_defaults: NameDefaultPair<expr>[]) {
        this.plain_names = plain_names;
        this.names_with_defaults = names_with_defaults;
    }
}
export class StarEtc {
    vararg: arg | null;
    kwonlyargs: NameDefaultPair<expr | null>[] | null; // asdl_seq* of NameDefaultsPair's
    kwarg: arg | null;
    constructor(vararg: arg | null, kwonlyargs: NameDefaultPair<expr | null>[] | null, kwarg: arg | null) {
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

/** TARGET_TYPES used in error handling */
export enum TARGETS_TYPE {
    STAR_TARGETS,
    DEL_TARGETS,
    FOR_TARGETS,
}
export const STAR_TARGETS = TARGETS_TYPE.STAR_TARGETS;
export const DEL_TARGETS = TARGETS_TYPE.DEL_TARGETS;
export const FOR_TARGETS = TARGETS_TYPE.FOR_TARGETS;

/* These definitions must match corresponding definitions in graminit.h. */
export enum StartRule {
    SINGLE_INPUT = 256,
    FILE_INPUT,
    EVAL_INPUT,
    FUNC_TYPE_INPUT = 345,
    /* This doesn't need to match anything */
    FSTRING_INPUT = 800,
}

export function EXTRA_EXPR(head: expr, tail?: expr): Attrs {
    tail ??= head;
    return [head.lineno, head.col_offset, tail.end_lineno, tail.end_col_offset];
}
