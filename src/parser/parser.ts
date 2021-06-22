import { NAME, NUMBER, OP, STRING, tok_name } from "../tokenize/token.ts";
import { exact_token_types } from "../tokenize/Tokenizer.ts";
import type { Tokenizer } from "../tokenize/Tokenizer.ts";
import { tokens } from "../tokenize/token.ts";
import { pySyntaxError } from "../tokenize/tokenize.ts";
import type { TokenInfo } from "../tokenize/tokenize.ts";
import { Name, Load, TypeIgnore, Constant } from "../ast/astnodes.ts";
import { KeywordToken } from "./pegen_types.ts";
import { get_keyword_or_name_type } from "./pegen.ts";

/** If we have a memoized parser method that has a different call signature we'd need to adapt this */
type NoArgs = (this: Parser) => any | null;
type Expect = (this: Parser, arg: string) => TokenInfo | null;
type ParserMethod = NoArgs | Expect;

/** For non-memoized functions that we want to be logged.*/
export function logger(_target: Parser, _propertyKey: string, _descriptor: PropertyDescriptor) {}

/** memoize the return value from the parser method. All parser methods take no args except expect which takes a token string */
export function memoize(_target: Parser, propertyKey: string, descriptor: PropertyDescriptor) {
    const method: ParserMethod = descriptor.value;
    const methodName = propertyKey;
    function memoizeWrapper<R = any | null>(this: Parser, arg?: string): R {
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
    function memoizeLeftRecWrapper(this: Parser) {
        const mark = this.mark();
        const key = `${mark},${methodName},`;
        const cached = this._cache[key];
        // fastpath cache hit
        if (cached !== undefined) {
            this.reset(cached[1]);
            return cached[0];
        }
        // Slow path: no cache hit
        let lastresult: any | null;
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
    negative_lookahead<T = never, R = any | null>(func: (arg: T) => R, arg?: T): boolean;
    positive_lookahead<T = never, R = any | null>(func: (arg: T) => R, arg?: T): R;
    positive_lookahead<T = string, R = any | null>(func: (arg: T) => R, arg: T): R;
}

/** The base class for the generated Parser. Largely based on cpython/Tools/peg_generator/pegen/parser.py */
export class Parser {
    _tokenizer: Tokenizer;
    _cache: { [key: string]: [any, number] };
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
        const END = this._tokens[this.mark() - 1].end;
        return [START[0], START[1], END[0], END[1]];
    }

    @memoize
    name(): Name | null {
        let tok = this.peek();
        let type = get_keyword_or_name_type(this, tok.string);
        if (type === NAME) {
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
            /** @todo parsenumber() */
            return new Constant(new Number(tok.string), null, tok.start[0], tok.start[1], tok.end[0], tok.end[1]);
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
        if (type in exact_token_types) {
            if (tok.type === exact_token_types[type]) {
                return this.getnext();
            }
        }
        if (type in tokens) {
            if (tok.type === tokens[type]) {
                return this.getnext();
            }
        }
        if (tok.type === OP && tok.string === type) {
            return this.getnext();
        }
        return null;
    }

    positive_lookahead<T = never, R = any | null>(func: (arg?: T) => R, arg?: T): R {
        const mark = this.mark();
        const ok = func.call(this, arg);
        this.reset(mark);
        return ok;
    }
    negative_lookahead<T = never, R = any | null>(func: (arg: T) => R, arg: T): boolean {
        const mark = this.mark();
        const ok = func.call(this, arg);
        this.reset(mark);
        return !ok;
    }
    make_syntax_error(filename = "<unknown>") {
        const tok = this.diagnose();
        return new pySyntaxError("pegen parse failure", [filename, tok.start[0], 1 + tok.start[1], tok.line]);
    }
}
