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
