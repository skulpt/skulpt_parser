import { NAME, NUMBER, OP, STRING, tok_name } from "../tokenize/token.ts";
import { exact_token_types } from "../tokenize/Tokenizer.ts";
import type { Tokenizer } from "../tokenize/Tokenizer.ts";
import { tokens } from "../tokenize/token.ts";
import { pySyntaxError } from "../tokenize/tokenize.ts";
import type { TokenInfo } from "../tokenize/tokenize.ts";
import { Name, Load, TypeIgnore, Constant } from "../ast/astnodes.ts";

/** If we have a memoized parser method that has a different call signature we'd need to adapt this */
type NoArgs = (this: Parser) => any | null;
type Expect = (this: Parser, arg: string) => TokenInfo | null;
type ParserMethod = NoArgs | Expect;

/** logging adapted from cpython/Tools/peg_generator/pegen/parser.py */
const trim = (s: any) => String(s).slice(0, 200);
const log = (s: string) => console.log(`${s.replace("\n/", "\\n")}`);
const argstr = (arg?: string) => (arg === undefined ? "" : `'${arg}'`);

/** For non-memoized functions that we want to be logged.*/
export function logger(target: Parser, propertyKey: string, descriptor: PropertyDescriptor) {
    const method: NoArgs = descriptor.value;
    const method_name = propertyKey;
    function logger_wrapper(this: Parser) {
        if (!this._verbose) {
            return method.call(this);
        }
        const fill = this._fill();
        log(`${fill}${method_name}() ... (looking at ${this.showpeek()})`);
        this._level++;
        const tree = method.call(this);
        this._level--;
        log(`${fill}... ${method_name}() --> ${trim(tree)}`);
        return tree;
    }
    descriptor.value = logger_wrapper;
}

/** memoize the return value from the parser method. All parser methods take no args except expect which takes a token string */
export function memoize(target: Parser, propertyKey: string, descriptor: PropertyDescriptor) {
    const method: ParserMethod = descriptor.value;
    const method_name = propertyKey;
    function memoize_wrapper<R = any | null>(this: Parser, arg?: string): R {
        const mark = this.mark();
        const key = `${mark},${method_name},${arg ?? ""}`;
        const inCache = key in this._cache;
        const verbose = this._verbose;
        // fast path: cache hit and not verbose
        if (inCache && !verbose) {
            const [tree, endmark] = this._cache[key];
            this.reset(endmark);
            return tree;
        }
        // slow path verbose or cache not hit
        let tree, endmark;
        if (!inCache) {
            if (verbose) {
                log(`${this._fill()}${method_name}(${argstr(arg)}) ... (looking at ${this.showpeek()})`);
            }
            this._level++;
            // mostly to keep ts-lint happy
            tree = arg === undefined ? (method as NoArgs).call(this) : (method as Expect).call(this, arg);
            this._level--;
            if (verbose) {
                log(`${this._fill()}... ${method_name}(${argstr(arg)}) -> ${trim(tree)} [cached]`);
            }
            endmark = this.mark();
            this._cache[key] = [tree, endmark];
        } else {
            [tree, endmark] = this._cache[key];
            if (verbose) {
                log(`${this._fill()}${method_name}(${argstr(arg)}) -> ${trim(tree)} [fresh]`);
            }
            this.reset(endmark);
        }
        return tree;
    }
    descriptor.value = memoize_wrapper;
}

export function memoize_left_rec(target: Parser, propertyKey: string, descriptor: PropertyDescriptor) {
    const method: NoArgs = descriptor.value;
    const method_name = propertyKey;
    function memoize_left_rec_wrapper(this: Parser) {
        const mark = this.mark();
        const key = `${mark},${method_name},`;
        const inCache = key in this._cache;
        const verbose = this._verbose;
        // fastpath cache hit and not verbose
        if (inCache && !verbose) {
            const [tree, endmark] = this._cache[key];
            this.reset(endmark);
            return tree;
        }
        // # Slow path: no cache hit, or verbose.
        let endmark, tree;
        if (!inCache) {
            if (verbose) {
                log(`${this._fill()}${method_name}() ... (looking at ${this.showpeek()})`);
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
                log(`${this._fill()}Recursive ${method_name} at ${mark} depth ${depth}`);
            }
            while (true) {
                this.reset(mark);
                const result = method.call(this);
                endmark = this.mark();
                depth++;
                if (verbose) {
                    log(
                        `${this._fill()}Recursive ${method_name} at ${mark} depth ${depth}: ${trim(
                            result
                        )} to ${endmark}`
                    );
                }
                if (!result) {
                    if (verbose) {
                        log(`${this._fill()}Fail with ${trim(lastresult)} to ${lastmark}`);
                    }
                    break;
                }
                if (endmark <= lastmark) {
                    if (verbose) {
                        log(`${this._fill()}Bailing with ${trim(lastresult)} to ${lastmark}`);
                    }
                    break;
                }
                this._cache[key] = [lastresult, lastmark] = [result, endmark];
            }
            this.reset(lastmark);
            tree = lastresult;
            this._level--;

            if (verbose) {
                log(`${this._fill()}${method_name}() -> ${trim(tree)} [cached]`);
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
                log(`${this._fill()}${method_name}() -> ${trim(tree)} [fresh]`);
            }
            if (tree) {
                this.reset(endmark);
            }
        }
        return tree;
    }
    descriptor.value = memoize_left_rec_wrapper;
}

// overloads for the expect method
export interface Parser {
    negative_lookahead<T = string, R = any | null>(func: (arg: T) => R, arg: T): boolean;
    positive_lookahead<T = string, R = any | null>(func: (arg: T) => R, arg: T): R;
}

/** The base class for the generated Parser. Largely based on cpython/Tools/peg_generator/pegen/parser.py */
export class Parser {
    _tokenizer: Tokenizer;
    _verbose: boolean;
    _level: number;
    _cache: { [key: string]: [any, number] };
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
    extra(start: number): [number, number, number, number] {
        const START = this._tokens[start].start;
        const END = this._tokens[this.mark() - 1].end;
        return [START[0], START[1], END[0], END[1]];
    }
    start() {
        return null;
    }
    showpeek(): string {
        const tok = this._tokenizer.peek();
        return `${tok.start[0]}.${tok.start[1]}: ${tok_name[tok.type]}:'${tok.string}'`;
    }
    _fill() {
        return "  ".repeat(this._level);
    }

    @memoize
    name(): Name | null {
        let tok = this._tokenizer.peek();
        if (tok.type === NAME) {
            tok = this._tokenizer.getnext();
            return new Name(tok.string, Load, tok.start[0], tok.start[1], tok.end[0], tok.end[1]);
        }
        return null;
    }
    @memoize
    string(): TokenInfo | null {
        let tok = this._tokenizer.peek();
        if (tok.type === STRING) {
            // this gets handled by concatenate strings which always follows this.string();
            return this._tokenizer.getnext();
        }
        return null;
    }
    @memoize
    number(): Constant | null {
        let tok = this._tokenizer.peek();
        if (tok.type === NUMBER) {
            tok = this._tokenizer.getnext();
            /** @todo parsenumber() */
            return new Constant(new Number(tok.string), null, tok.start[0], tok.start[1], tok.end[0], tok.end[1]);
        }
        return null;
    }
    @memoize
    op(): TokenInfo | null {
        // this never gets called in the generated parser - probably only relevant for the grammar parser
        const tok = this._tokenizer.peek();
        if (tok.type === OP) {
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
        const tok = this._tokenizer.diagnose();
        return new pySyntaxError("pegen parse failure", [filename, tok.start[0], 1 + tok.start[1], tok.line]);
    }
}
