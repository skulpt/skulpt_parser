// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import { arg, Attrs, cmpop, expr, keyword, operator, Starred } from "../ast/astnodes.ts";

export class CmpopExprPair {
    constructor(readonly cmpop: cmpop, readonly expr: expr) {}
}

export class KeyValuePair<K = expr | null> {
    // K null signals that we're an unpacking like **a
    constructor(readonly key: K, readonly value: expr) {}
}

export class AugOperator {
    constructor(readonly kind: operator) {}
}

export class NameDefaultPair<V = expr | null> {
    constructor(readonly arg: arg, readonly value: V) {}
}

export class SlashWithDefault {
    constructor(readonly plain_names: arg[], readonly names_with_defaults: NameDefaultPair<expr>[]) {}
}
export class StarEtc {
    constructor(
        readonly vararg: arg | null,
        readonly kwonlyargs: NameDefaultPair<expr | null>[] | null,
        readonly kwarg: arg | null
    ) {}
}

type KeywordOrStarredElement<IsKeyword> = IsKeyword extends true
    ? keyword
    : IsKeyword extends false
    ? Starred
    : keyword | Starred;

export class KeywordOrStarred<IsKeyword extends boolean = boolean> {
    constructor(readonly element: KeywordOrStarredElement<IsKeyword>, readonly is_keyword: IsKeyword) {}
}

/** TARGET_TYPES used in error handling */
export const enum TARGETS_TYPE {
    STAR_TARGETS,
    DEL_TARGETS,
    FOR_TARGETS,
}
export const STAR_TARGETS = TARGETS_TYPE.STAR_TARGETS;
export const DEL_TARGETS = TARGETS_TYPE.DEL_TARGETS;
export const FOR_TARGETS = TARGETS_TYPE.FOR_TARGETS;

/* These definitions must match corresponding definitions in graminit.h. */
export const enum StartRule {
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
