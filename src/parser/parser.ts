// deno-lint-ignore-file camelcase
import { DEDENT, ENDMARKER, INDENT, NAME, NEWLINE, NUMBER, STRING } from "../tokenize/token.ts";
import type { Tokenizer } from "../tokenize/Tokenizer.ts";
import type { TokenInfo } from "../tokenize/tokenize.ts";
import { Name, Load, TypeIgnore, Constant, expr } from "../ast/astnodes.ts";
import { StartRule, TARGETS_TYPE } from "./pegen_types.ts";
import type { AST } from "../ast/astnodes.ts";
import { get_expr_name, get_invalid_target } from "./pegen.ts";
import { parsenumber } from "./parse_number.ts";
import { pyIndentationError, pySyntaxError } from "../ast/errors.ts";
import { KEYWORDS } from "./generated_parser.ts";

/** If we have a memoized parser method that has a different call signature we'd need to adapt this */
type ParserMethod = (this: Parser) => AST | TokenInfo | null;

/** For non-memoized functions that we want to be logged.*/
export function logger(_target: Parser, _propertyKey: string, _descriptor: PropertyDescriptor) {}

/** memoize the return value from the parser method. All parser methods take no args except expect which takes a token string */
export function memoize(_target: Parser, propertyKey: string, descriptor: PropertyDescriptor) {
    const method: ParserMethod = descriptor.value;
    const methodName = propertyKey;
    function memoizeWrapper(this: Parser): AST | TokenInfo | null {
        const mark = this._mark;
        const actionCache = this._cache[mark];
        const key = methodName;
        const cached = actionCache.get(key);
        // fastpath cache hit
        if (cached !== undefined) {
            this._mark = cached[1];
            return cached[0];
        }
        // Slow path: no cache hit
        const tree = method.call(this);
        actionCache.set(key, [tree, this._mark]);
        return tree;
    }
    descriptor.value = memoizeWrapper;
}

export function memoizeLeftRec(_target: Parser, propertyKey: string, descriptor: PropertyDescriptor) {
    const method: ParserMethod = descriptor.value;
    const methodName = propertyKey;
    function memoizeLeftRecWrapper(this: Parser): AST | TokenInfo | null {
        const mark = this._mark;
        const actionCache = this._cache[mark];
        const key = methodName;
        let cached = actionCache.get(key);
        // fastpath cache hit
        if (cached !== undefined) {
            this._mark = cached[1];
            return cached[0];
        }
        // Slow path: no cache hit
        let lastresult: AST | TokenInfo | null = null;
        let lastmark = mark;
        let currmark = mark;
        cached = [lastresult, lastmark];
        actionCache.set(key, cached);
        while (true) {
            this._mark = mark;
            const result = method.call(this);
            currmark = this._mark;
            if (result === null) {
                // failed
                break;
            }
            if (currmark <= lastmark) {
                // bailing
                break;
            }
            cached[0] = lastresult = result;
            cached[1] = lastmark = currmark;
        }
        this._mark = lastmark;
        const tree = lastresult;
        let endmark: number;
        if (tree !== null) {
            endmark = this._mark;
        } else {
            endmark = mark;
            this._mark = endmark;
        }
        cached[0] = tree;
        cached[1] = endmark;
        return tree;
    }
    descriptor.value = memoizeLeftRecWrapper;
}

// overloads for the expect method
export interface Parser {
    start_rule: StartRule;
    negative_lookahead<T = never, R = AST | TokenInfo | null>(func: (arg: T) => R, arg?: T): boolean;
    negative_lookahead<T = string, R = AST | TokenInfo | null>(func: (arg: T) => R, arg: T): boolean;
    positive_lookahead<T = never, R = AST | TokenInfo | null>(func: (arg: T) => R, arg?: T): R;
    positive_lookahead<T = string, R = AST | TokenInfo | null>(func: (arg: T) => R, arg: T): R;
}

/** The base class for the generated Parser. Largely based on cpython/Tools/peg_generator/pegen/parser.py */
export class Parser {
    _tok: Tokenizer;
    _cache: Map<string | number, [AST | TokenInfo | null, number]>[];
    _mark: number;
    _tokens: TokenInfo[];
    filename: string;

    type_ignore_comments: TypeIgnore[] = [];

    constructor(tokenizer: Tokenizer) {
        this._tok = tokenizer;
        this._mark = 0;
        this._cache = [new Map()];
        this._tokens = this._tok._tokens;
        this.filename = "<unknown>";
    }

    extra(start: number): [number, number, number, number] {
        const START = this._tokens[start].start;
        let m = this._mark - 1;
        let END_TOKEN = this._tokens[m];
        while (m >= 0) {
            const type = END_TOKEN.type;
            if (type !== ENDMARKER && (type < NEWLINE || type > DEDENT)) {
                break;
            }
            END_TOKEN = this._tokens[--m];
        }
        const END = END_TOKEN.end;
        return [START[0], START[1], END[0], END[1]];
    }

    peek(): TokenInfo {
        if (this._mark === this._tokens.length) {
            this._cache.push(new Map());
            return this._tok.getnext();
        }
        return this._tokens[this._mark];
    }

    diagnose(): TokenInfo {
        if (this._tokens.length === 0) {
            this.peek();
        }
        return this._tokens[this._tokens.length - 1];
    }

    raise_error(errType: typeof pySyntaxError, msg: string, ...formatArgs: string[]): never {
        const tok = this.diagnose();
        return this.raise_error_known_location(errType, tok.start[0], tok.start[1] + 1, msg, ...formatArgs);
    }

    raise_error_known_location(
        errType: typeof pySyntaxError,
        lineno: number,
        offset: number,
        msg: string,
        ...formatArgs: string[]
    ): never {
        if (this.start_rule === StartRule.FSTRING_INPUT) {
            msg = "f-string: " + msg;
        }

        /** @todo should we just set the error indicator and return null then check this in the memoize decorator? */
        // this.error_indicator = 1;
        for (const arg of formatArgs) {
            msg = msg.replace("%s", arg);
        }
        let tok = this.diagnose();
        let i = this._tokens.length - 1;
        while (tok.lineno !== lineno && i > 0) {
            tok = this._tokens[--i];
        }
        throw new errType(msg, [this.filename, lineno, offset, tok.line]);
    }

    raise_error_invalid_target(type: TARGETS_TYPE, e: expr | null): never {
        // const invalidTarget = get_inalid_target(e, type); CHECK_NULL_NOT_ALLOWED
        const invalidTarget = get_invalid_target(e, type);
        if (invalidTarget !== null) {
            const msg =
                type === TARGETS_TYPE.STAR_TARGETS || type === TARGETS_TYPE.FOR_TARGETS
                    ? "cannot assign to %s"
                    : "cannot delete %s";
            return this.raise_error_known_location(
                pySyntaxError,
                invalidTarget.lineno,
                invalidTarget.col_offset,
                msg,
                get_expr_name(invalidTarget)
            );
        }
        return this.raise_error(pySyntaxError, "invalid syntax");
    }

    name(): Name | null {
        const tok = this.peek();
        if (tok.type === NAME && !KEYWORDS.has(tok.string)) {
            this._mark++;
            return new Name(tok.string, Load, tok.start[0], tok.start[1], tok.end[0], tok.end[1]);
        }
        return null;
    }

    string(): TokenInfo | null {
        const tok = this.peek();
        if (tok.type === STRING) {
            // this gets handled by concatenate strings which always follows this.string();
            this._mark++;
            return tok;
        }
        return null;
    }

    number(): Constant | null {
        const tok = this.peek();
        if (tok.type === NUMBER) {
            this._mark++;
            return new Constant(parsenumber(tok.string), null, tok.start[0], tok.start[1], tok.end[0], tok.end[1]);
        }
        return null;
    }

    keyword(type: string): TokenInfo | null {
        const tok = this.peek();
        if (tok.string === type) {
            this._mark++;
            return tok;
        } else {
            return null;
        }
    }

    expect(type: number): TokenInfo | null {
        const tok = this.peek();
        if (type === tok.type) {
            this._mark++;
            return tok;
        }
        return null;
    }

    positive_lookahead<T = never, R = AST | TokenInfo | null>(func: (arg?: T) => R, arg?: T): R {
        const mark = this._mark;
        const ok = func.call(this, arg);
        this._mark = mark;
        return ok;
    }

    negative_lookahead<T = never, R = AST | TokenInfo | null>(func: (arg: T) => R, arg: T): boolean {
        const mark = this._mark;
        const ok = func.call(this, arg);
        this._mark = mark;
        return !ok;
    }

    make_syntax_error(): never {
        const tok = this.diagnose();
        const { type: lastTokenType } = tok;
        if (lastTokenType === INDENT) {
            this.raise_error(pyIndentationError, "unexpected indent");
        } else if (lastTokenType === DEDENT) {
            this.raise_error(pyIndentationError, "unexpected unindent");
        }
        throw this.raise_error(pySyntaxError, "invalid syntax");
    }
}
