// deno-lint-ignore-file camelcase
import { DEDENT, ENDMARKER, INDENT, NAME, NEWLINE, NUMBER, OP, STRING, EXACT_TOKEN_TYPES, tokens } from "../tokenize/token.ts";
import type { Tokenizer } from "../tokenize/Tokenizer.ts";
import type { TokenInfo } from "../tokenize/tokenize.ts";
import { Name, Load, TypeIgnore, Constant, expr } from "../ast/astnodes.ts";
import { KeywordToken, StartRule, TARGETS_TYPE } from "./pegen_types.ts";
import type { AST } from "../ast/astnodes.ts";
import { get_expr_name, get_invalid_target, get_keyword_or_name_type } from "./pegen.ts";
import type { NameTokenInfo } from "./pegen.ts";
import { parsenumber } from "./parse_number.ts";
import { pyIndentationError, pySyntaxError } from "../ast/errors.ts";

/** If we have a memoized parser method that has a different call signature we'd need to adapt this */
type NoArgs = (this: Parser) => AST | TokenInfo | null;
type Expect = (this: Parser, arg: string) => TokenInfo | null;
type ParserMethod = NoArgs | Expect;

/** For non-memoized functions that we want to be logged.*/
export function logger(_target: Parser, _propertyKey: string, _descriptor: PropertyDescriptor) {}

/** memoize the return value from the parser method. All parser methods take no args except expect which takes a token string */
export function memoize(_target: Parser, propertyKey: string, descriptor: PropertyDescriptor) {
    const method: ParserMethod = descriptor.value;
    const methodName = propertyKey;
    function memoizeWrapper(this: Parser, arg?: string): AST | TokenInfo | null {
        const mark = this.mark();
        const key = `${mark},${methodName},${arg ?? ""}`;
        const cached = this._cache[key];
        // fastpath cache hit
        if (cached !== undefined) {
            this.reset(cached[1]);
            return cached[0];
        }
        // Slow path: no cache hit
        const tree = arg === undefined ? (method as NoArgs).call(this) : (method as Expect).call(this, arg);
        this._cache[key] = [tree, this.mark()];
        return tree;
    }
    descriptor.value = memoizeWrapper;
}

export function memoizeLeftRec(_target: Parser, propertyKey: string, descriptor: PropertyDescriptor) {
    const method: NoArgs = descriptor.value;
    const methodName = propertyKey;
    function memoizeLeftRecWrapper(this: Parser): AST | TokenInfo | null {
        const mark = this.mark();
        const key = `${mark},${methodName},`;
        const cached = this._cache[key];
        // fastpath cache hit
        if (cached !== undefined) {
            this.reset(cached[1]);
            return cached[0];
        }
        // Slow path: no cache hit
        let lastresult: AST | TokenInfo | null;
        let lastmark: number;
        let currmark: number;
        this._cache[key] = [(lastresult = null), (lastmark = mark)];
        while (true) {
            this.reset(mark);
            const result = method.call(this);
            currmark = this.mark();
            if (result === null) {
                // failed
                break;
            }
            if (currmark <= lastmark) {
                // bailing
                break;
            }
            this._cache[key] = [(lastresult = result), (lastmark = currmark)];
        }
        this.reset(lastmark);
        const tree = lastresult;
        let endmark: number;
        if (tree !== null) {
            endmark = this.mark();
        } else {
            endmark = mark;
            this.reset(endmark);
        }
        this._cache[key] = [tree, endmark];
        return tree;
    }
    descriptor.value = memoizeLeftRecWrapper;
}

// overloads for the expect method
export interface Parser {
    keywords: Map<string, KeywordToken>;
    start_rule: StartRule;
    negative_lookahead<T = never, R = AST | TokenInfo | null>(func: (arg: T) => R, arg?: T): boolean;
    negative_lookahead<T = string, R = AST | TokenInfo | null>(func: (arg: T) => R, arg: T): boolean;
    positive_lookahead<T = never, R = AST | TokenInfo | null>(func: (arg: T) => R, arg?: T): R;
    positive_lookahead<T = string, R = AST | TokenInfo | null>(func: (arg: T) => R, arg: T): R;
}

/** The base class for the generated Parser. Largely based on cpython/Tools/peg_generator/pegen/parser.py */
export class Parser {
    _tokenizer: Tokenizer;
    _cache: { [key: string]: [AST | TokenInfo | null, number] };
    mark: () => number;
    reset: (number: number) => null | void;
    peek: () => TokenInfo;
    getnext: () => TokenInfo;
    diagnose: () => TokenInfo;
    _tokens: TokenInfo[];

    type_ignore_comments: TypeIgnore[] = [];

    constructor(tokenizer: Tokenizer) {
        this._tokenizer = tokenizer;
        this._cache = {};
        this.mark = this._tokenizer.mark.bind(this._tokenizer);
        this.reset = this._tokenizer.reset.bind(this._tokenizer);
        this.peek = this._tokenizer.peek.bind(this._tokenizer);
        this.getnext = this._tokenizer.getnext.bind(this._tokenizer);
        this.diagnose = this._tokenizer.diagnose.bind(this._tokenizer);
        this._tokens = this._tokenizer._tokens;
    }

    extra(start: number): [number, number, number, number] {
        const START = this._tokens[start].start;
        let m = this.mark() - 1;
        let END_TOKEN = this._tokens[m];
        while (m >= 0) {
            const type = END_TOKEN.type;
            if (type !== ENDMARKER && (type < NEWLINE || type > DEDENT)) {
                break;
            }
            END_TOKEN = this._tokens[m--];
        }
        const END = END_TOKEN.end;
        return [START[0], START[1], END[0], END[1]];
    }

    raise_error(errType: typeof pySyntaxError, msg: string, ...formatArgs: string[]): never {
        // console.log(this.mark())
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
            /** @todo */
        }

        /** @todo should we just set the error indicator and return null then check this in the memoize decorator? */
        // this.error_indicator = 1;
        for (const arg of formatArgs) {
            msg = msg.replace("%s", arg);
        }
        let i = this.mark() - 1;
        let errLine = "";
        while (i >= 0) {
            const tok = this._tokens[i];
            if (tok.lineno === lineno) {
                errLine = tok.line;
                break;
            }
            i--;
        }
        throw new errType(msg, ["<file>", lineno, offset, errLine]);
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

    @memoize
    name(): Name | null {
        let tok = this.peek();
        if (tok.type === NAME && get_keyword_or_name_type(this, tok as NameTokenInfo) === NAME) {
            tok = this.getnext();
            return new Name(tok.string, Load, tok.start[0], tok.start[1], tok.end[0], tok.end[1]);
        }
        return null;
    }

    @memoize
    string(): TokenInfo | null {
        const tok = this.peek();
        if (tok.type === STRING) {
            // this gets handled by concatenate strings which always follows this.string();
            return this.getnext();
        }
        return null;
    }

    @memoize
    number(): Constant | null {
        let tok = this.peek();
        if (tok.type === NUMBER) {
            tok = this.getnext();
            return new Constant(parsenumber(tok.string), null, tok.start[0], tok.start[1], tok.end[0], tok.end[1]);
        }
        return null;
    }

    @memoize
    op(): TokenInfo | null {
        // this never gets called in the generated parser - probably only relevant for the grammar parser
        const tok = this.peek();
        if (tok.type === OP) {
            return this.getnext();
        }
        return null;
    }

    @memoize
    expect(type: string): TokenInfo | null {
        const tok = this.peek();
        if (tok.string === type) {
            return this.getnext();
        }
        if (type in EXACT_TOKEN_TYPES) {
            if (tok.type === EXACT_TOKEN_TYPES[type]) {
                return this.getnext();
            }
        }
        if (type in tokens) {
            if (tok.type === tokens[type as keyof typeof tokens]) {
                return this.getnext();
            }
        }
        if (tok.type === OP && tok.string === type) {
            return this.getnext();
        }
        return null;
    }

    positive_lookahead<T = never, R = AST | TokenInfo | null>(func: (arg?: T) => R, arg?: T): R {
        const mark = this.mark();
        const ok = func.call(this, arg);
        this.reset(mark);
        return ok;
    }

    negative_lookahead<T = never, R = AST | TokenInfo | null>(func: (arg: T) => R, arg: T): boolean {
        const mark = this.mark();
        const ok = func.call(this, arg);
        this.reset(mark);
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
