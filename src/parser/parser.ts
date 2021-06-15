import { NAME, NUMBER, OP, STRING, tok_name } from "../tokenize/token.ts";
import { exact_token_types } from "../tokenize/Tokenizer.ts";
import * as tokens from "../tokenize/token.ts";
import { pySyntaxError, TokenInfo } from "../tokenize/tokenize.ts";

class Load {}

class Name {
    id;
    ctx;
    lineno: number;
    col_offset: number;
    end_lineno: number;
    end_col_offset: number;
    constructor(id, ctx, lineno, col_offset, end_lineno, end_col_offset) {
        this.id = id;
        this.ctx = ctx;
        this.lineno = lineno;
        this.col_offset = col_offset;
        this.end_lineno = end_lineno;
        this.end_col_offset = end_col_offset;
    }
}

export function logger(
    // """For non-memoized functions that we want to be logged.

    // (In practice this is only non-leader left-recursive functions.)
    // """
    target: Parser,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const method: (...args: any[]) => any = descriptor.value;
    const method_name = propertyKey;
    function logger_wrapper(...args) {
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
    function memoize_wrapper(...args) {
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
    function memoize_left_rec_wrapper() {
        let mark = this.mark();
        let key = [mark, method_name, []].toString();
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
    _tokenizer;
    _verbose: boolean;
    _level: number;
    _cache: { [key: string]: [any, any] };
    mark: () => number;
    reset: (number) => null | void;
    _tokens: TokenInfo[];
    constructor(tokenizer, verbose = false) {
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
    name(): null | Name {
        let tok = this._tokenizer.peek();
        if (tok.type === NAME) {
            tok = this._tokenizer.getnext();
            return new Name(tok.string, new Load(), tok.start[0], tok.start[1], tok.end[0], tok.end[1]);
        }
        return null;
    }
    string() {
        const tok = this._tokenizer.peek();
        if (tok.type === STRING) {
            return this._tokenizer.getnext();
        }
        return null;
    }
    @memoize
    number(): null | any {
        const tok = this._tokenizer.peek();
        if (tok.type === NUMBER) {
            return this._tokenizer.getnext();
        }
        return null;
    }
    @memoize
    op(): null | any {
        const tok = this._tokenizer.peek();
        if (tok.type === OP) {
            return this._tokenizer.getnext();
        }
        return null;
    }
    @memoize
    expect(type) {
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
    positive_lookahead(func, ...args) {
        const mark = this.mark();
        const ok = func.call(this, ...args);
        this.reset(mark);
        return ok;
    }
    negative_lookahead(func, ...args) {
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
