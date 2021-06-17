import { NAME, NUMBER, OP, STRING, tok_name } from "../tokenize/token.ts";
import { exact_token_types, Tokenizer } from "../tokenize/Tokenizer.ts";
import { tokens } from "../tokenize/token.ts";
import { pySyntaxError, TokenInfo } from "../tokenize/tokenize.ts";

import { Name, Load, TypeIgnore, Constant } from "../ast/astnodes.ts";
import { Colors } from "../../deps.ts";

/** For non-memoized functions that we want to be logged.*/
export function logger(target: Parser, propertyKey: string, descriptor: PropertyDescriptor) {
    const method: (...args: any[]) => any = descriptor.value;
    const method_name = propertyKey;
    function logger_wrapper(this: Parser, ...args: any[]) {
        if (!this._verbose) {
            return method.call(this, ...args);
        }
        const fill = "  ".repeat(this._level);
        console.log(`${fill}${method_name}(${args}) .... (looking at ${this.showpeek().toString().slice(0, 200)})`);
        this._level++;
        const tree = method.call(this, ...args);
        this._level--;
        console.log(`${fill}... ${method_name}(${args}) --> ${String(tree).slice(0, 200)}`);
        return tree;
    }
    descriptor.value = logger_wrapper;
}

export function memoize(target: Parser, propertyKey: string, descriptor: PropertyDescriptor) {
    const method: (...args: any[]) => any = descriptor.value;
    const method_name = propertyKey;
    function memoize_wrapper(this: Parser, ...args: any[]) {
        let mark = this.mark();
        let key = [mark, method_name, args].toString();
        // fast path: cache hit and not verbose
        if (key in this._cache && !this._verbose) {
            // work out how to _cache
            const [tree, endmark] = this._cache[key];
            this.reset(endmark);
            return tree;
        }
        // slow path verbose or cache not hit
        const verbose = this._verbose;
        const fill = "  ".repeat(this._level);
        let tree, endmark;
        if (!(key in this._cache)) {
            if (verbose) {
                console.log(
                    `${fill}${method_name}(${args}) ... (looking at ${this.showpeek().toString().slice(0, 200)})`
                );
            }
            this._level++;
            tree = method.call(this, ...args);
            this._level--;
            if (verbose) {
                console.log(`${fill}... ${method_name}(${args}) -> ${String(tree).slice(0, 200)}`);
            }
            endmark = this.mark();
            this._cache[key] = [tree, endmark];
        } else {
            [tree, endmark] = this._cache[key];
            if (verbose) {
                console.log(`${fill}${method_name}(${args}) -> ${String(tree).slice(200)}`);
            }
            this.reset(endmark);
        }
        return tree;
    }
    descriptor.value = memoize_wrapper;
}

export function memoize_left_rec(target: Parser, propertyKey: string, descriptor: PropertyDescriptor) {
    const method: (...args: any[]) => any = descriptor.value;
    const method_name = propertyKey;
    function memoize_left_rec_wrapper(this: Parser) {
        const mark = this.mark();
        const key = [mark, method_name, []].toString();
        let endmark, tree;
        // fastpath cache hit and not verbose
        if (key in this._cache && !this._verbose) {
            [tree, endmark] = this._cache[key];
            this.reset(endmark);
            return tree;
        }
        // # Slow path: no cache hit, or verbose.
        const verbose = this._verbose;
        const fill = "  ".repeat(this._level);
        if (!(key in this._cache)) {
            if (verbose) {
                console.log(`${fill}${method_name} ... (looking at ${this.showpeek()})`);
            }
            this._level++;
            /*
            # For left-recursive rules we manipulate the cache and
            # loop until the rule shows no progress, then pick the
            # previous result.  For an explanation why this works, see
            # https://github.com/PhilippeSigaud/Pegged/wiki/Left-Recursion
            # (But we use the memoization cache instead of a static
            # variable; perhaps this is similar to a paper by Warth et al.
            # (http://web.cs.ucla.edu/~todd/research/pub.php?id=pepm08).

            # Prime the cache with a failure.
            */
            let [lastresult, lastmark] = (this._cache[key] = [null, mark]);
            let depth = 0;
            if (verbose) {
                console.log(`${fill}Recursive ${method_name} at ${mark} depth ${depth}`);
            }
            while (true) {
                this.reset(mark);
                const result = method.call(this);
                endmark = this.mark();
                depth++;
                if (verbose) {
                    console.log(
                        `${fill}Recursive ${method_name} at ${mark} depth ${depth}: ${String(result).slice(
                            0,
                            200
                        )} to ${endmark}`
                    );
                }
                if (!result) {
                    if (verbose) {
                        console.log(`${fill}Fail with ${String(lastresult).slice(0, 200)} to ${lastmark}`);
                    }
                    break;
                }
                if (endmark <= lastmark) {
                    if (verbose) {
                        console.log(`${fill}Bailing with ${String(lastresult).slice(0, 200)} to ${lastmark}`);
                    }
                    break;
                }
                this._cache[key] = [lastresult, lastmark] = [result, endmark];
            }
            this.reset(lastmark);
            tree = lastresult;
            this._level--;

            if (verbose) {
                console.log(`${fill}${method_name}() -> ${String(tree).slice(0, 200)} [cached]`);
            }
            if (tree) {
                endmark = this.mark();
            } else {
                endmark = mark;
                this.reset(endmark);
            }
            this._cache[key] = [tree, endmark];
        } else {
            [tree, endmark] = this._cache[key];
            if (verbose) {
                console.log(`${fill}${method_name}() -> ${String(tree).slice(0, 200)} [fresh]`);
            }
            if (tree) {
                this.reset(endmark);
            }
        }
        return tree;
    }
    descriptor.value = memoize_left_rec_wrapper;
}

export class Parser {
    _tokenizer: Tokenizer;
    _verbose: boolean;
    _level: number;
    _cache: { [key: string]: [any, any] };
    mark: () => number;
    reset: (number: number) => null | void;
    _tokens: TokenInfo[];

    type_ignore_comments: TypeIgnore[] = [];

    constructor(tokenizer: Tokenizer, verbose = false) {
        this._tokenizer = tokenizer;
        this._verbose = verbose;
        this._level = 0;
        this._cache = {};
        this.mark = this._tokenizer.mark.bind(this._tokenizer);
        this.reset = this._tokenizer.reset.bind(this._tokenizer);
        this._tokens = this._tokenizer._tokens;
    }
    start() {
        return null;
    }
    showpeek(): string {
        const tok = this._tokenizer.peek();
        return `${tok.start[0]}.${tok.start[1]}: ${tok_name[tok.type]}:'${tok.string}'`;
    }

    @memoize
    name(): Name | null {
        let tok = this._tokenizer.peek();
        if (tok.type === NAME) {
            tok = this._tokenizer.getnext();
            return new Name(tok.string, new Load(), tok.start[0], tok.start[1], tok.end[0], tok.end[1]);
        }
        return null;
    }
    string(): null | Constant {
        let tok = this._tokenizer.peek();
        if (tok.type === STRING) {
            tok = this._tokenizer.getnext();
            return new Constant(tok.string, "str", tok.start[0], tok.start[1], tok.end[0], tok.end[1]);
        }
        return null;
    }
    @memoize
    number(): null | Constant {
        let tok = this._tokenizer.peek();
        if (tok.type === NUMBER) {
            tok = this._tokenizer.getnext();
            return new Constant(tok.string, "float", tok.start[0], tok.start[1], tok.end[0], tok.end[1]);
        }
        return null;
    }
    @memoize
    op(): TokenInfo | null {
        const tok = this._tokenizer.peek();
        if (tok.type === OP) {
            // i'm guessing this needs to return something else...
            return this._tokenizer.getnext();
        }
        return null;
    }
    @memoize
    expect(type: string): TokenInfo | null {
        const tok = this._tokenizer.peek();
        if (tok.string === type) {
            return this._tokenizer.getnext();
        }
        if (type in exact_token_types) {
            if (tok.type === exact_token_types[type]) {
                return this._tokenizer.getnext();
            }
        }
        if (type in tokens) {
            if (tok.type === tokens[type]) {
                return this._tokenizer.getnext();
            }
        }
        if (tok.type === OP && tok.string === type) {
            return this._tokenizer.getnext();
        }
        return null;
    }
    positive_lookahead(func: (...args: any[]) => boolean, ...args: any[]) {
        const mark = this.mark();
        const ok = func.call(this, ...args);
        this.reset(mark);
        return ok;
    }
    negative_lookahead(func: (...args: any[]) => boolean, ...args: any[]) {
        const mark = this.mark();
        const ok = func.call(this, ...args);
        this.reset(mark);
        return !ok;
    }
    make_syntax_error(filename = "<unknown>") {
        const tok = this._tokenizer.diagnose();
        return new pySyntaxError("pegen parse failure", [filename, tok.start[0], 1 + tok.start[1], tok.line]);
    }
}
