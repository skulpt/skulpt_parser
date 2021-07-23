// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import { tokens } from "../tokenize/token.ts";
import type { Tokenizer } from "../tokenize/Tokenizer.ts";
import type { TokenInfo } from "../tokenize/tokenize.ts";
import { Parser as BaseParser } from "./parser.ts";
import { Colors } from "../../deps.ts";
import type { AST } from "../ast/astnodes.ts";

/** If we have a memoized parser method that has a different call signature we'd need to adapt this */
type NoArgs = (this: BaseParser) => AST | TokenInfo | null;
type Expect = (this: BaseParser, arg: string) => TokenInfo | null;
type ParserMethod = NoArgs | Expect;

type colors = "yellow" | "red" | "blue" | "brightGreen" | "dim";
/** logging adapted from cpython/Tools/peg_generator/pegen/parser.py */
const trim = (s: AST | TokenInfo | null) => String(s).slice(0, 200);
const log = (s: string, col: colors) => {
    if (col === "yellow") {
        console.log(Colors.dim(Colors[col](`${s.replace(/\n/g, "\\n")}`)));
    } else {
        console.log(Colors[col](`${s.replace(/\n/g, "\\n")}`));
    }
};
const argstr = (arg?: string) => (arg === undefined ? "" : `'${arg}'`);

/** For non-memoized functions that we want to be logged.*/
export function logger(_target: VerboseParser, propertyKey: string, descriptor: PropertyDescriptor) {
    const method: NoArgs = descriptor.value;
    const methodName = propertyKey;
    function loggerWrapper(this: VerboseParser): AST | TokenInfo | null {
        const fill = this._fill();
        log(`${fill}${methodName}() ... (looking at ${this.showpeek()})`, "dim");
        this._level++;
        const tree = method.call(this);
        this._level--;
        log(`${fill}... ${methodName}() --> ${trim(tree)}`, "dim");
        return tree;
    }
    descriptor.value = loggerWrapper;
}

/** memoize the return value from the parser method. All parser methods take no args except expect which takes a token string */
export function memoize(_target: VerboseParser, propertyKey: string, descriptor: PropertyDescriptor) {
    const method: ParserMethod = descriptor.value;
    const methodName = propertyKey;
    function memoizeWrapper(this: VerboseParser, arg?: string): AST | TokenInfo | null {
        const mark = this._mark;
        const actionCache = this._cache[mark];
        const key = arg ?? methodName;
        const cached = actionCache.get(key);
        // fastpath cache hit
        if (cached !== undefined) {
            log(
                `${this._fill()}${methodName}(${argstr(arg)}) -> ${trim(cached[0])} [hit cache]`,
                cached[0] === null ? "yellow" : "brightGreen"
            );
            this._mark = cached[1];
            return cached[0];
        }
        // Slow path: no cache hit
        log(`${this._fill()}${methodName}(${argstr(arg)}) ... (looking at ${this.showpeek()})`, "dim");
        this._level++;
        const tree = arg === undefined ? (method as NoArgs).call(this) : (method as Expect).call(this, arg);
        this._level--;
        if (tree !== null) {
            log(
                `${this._fill()}... ${methodName}(${argstr(arg)}) -> ${trim(tree)} [caching ${tree.toString()}]`,
                "brightGreen"
            );
        } else {
            log(`${this._fill()}... ${methodName}(${argstr(arg)}) -> ${trim(tree)} [caching null]`, "blue");
        }
        actionCache.set(key, [tree, this._mark]);
        return tree;
    }
    descriptor.value = memoizeWrapper;
}

export function memoizeLeftRec(_target: VerboseParser, propertyKey: string, descriptor: PropertyDescriptor) {
    const method: NoArgs = descriptor.value;
    const methodName = propertyKey;
    function memoizeLeftRecWrapper(this: VerboseParser): AST | TokenInfo | null {
        const mark = this._mark;
        const actionCache = this._cache[mark];
        const key = methodName;
        let cached = actionCache.get(key);
        // fastpath cache hit
        if (cached !== undefined) {
            log(
                `${this._fill()}${methodName}() -> ${trim(cached[0])} [hit cache]`,
                cached[0] === null ? "yellow" : "brightGreen"
            );
            this._mark = cached[1];
            return cached[0];
        }
        // Slow path: no cache hit
        log(`${this._fill()}${methodName}() ... (looking at ${this.showpeek()})`, "dim");
        let lastresult: AST | TokenInfo | null = null;
        let lastmark = mark;
        let currmark = mark;
        cached = [lastresult, lastmark];
        actionCache.set(key, cached);
        let depth = 0;
        log(`${this._fill()}Recursive ${methodName} at ${mark} depth ${depth}`, "dim");
        while (true) {
            this._mark = mark;
            const result = method.call(this);
            currmark = this._mark;
            depth++;
            log(
                `${this._fill()}Recursive ${methodName} at ${mark} depth ${depth}: ${trim(result)} to ${currmark}`,
                "dim"
            );
            if (result === null) {
                // failed
                log(`${this._fill()}Fail with ${trim(lastresult)} to ${lastmark}`, "red");
                break;
            }
            if (currmark <= lastmark) {
                // bailing
                log(`${this._fill()}Bailing with ${trim(lastresult)} to ${lastmark}`, "red");
                break;
            }
            cached[0] = lastresult = result;
            cached[1] = lastmark = currmark;
        }
        this._mark = lastmark;
        const tree = lastresult;
        let endmark: number;
        if (tree !== null) {
            log(`${this._fill()}${methodName}() -> ${trim(tree)} [caching ${tree.toString()}]`, "brightGreen");
            endmark = this._mark;
        } else {
            log(`${this._fill()}${methodName}() -> ${trim(tree)} [caching null]`, "blue");
            endmark = mark;
            this._mark = endmark;
        }
        cached[0] = tree;
        cached[1] = endmark;
        return tree;
    }
    descriptor.value = memoizeLeftRecWrapper;
}

export class VerboseParser extends BaseParser {
    _level: number;
    constructor(tokenizer: Tokenizer) {
        super(tokenizer);
        this._level = 0;
        this.rewrap(["name", "string", "number", "op", "expect"]);
    }
    showpeek(): string {
        const tok = this.peek();
        return `${tok.start[0]}.${tok.start[1]}: ${tokens[tok.type]}:'${tok.string}'`;
    }
    _fill() {
        return "  ".repeat(this._level);
    }
    rewrap(fnNames: string[]) {
        const descriptors = Object.getOwnPropertyDescriptors(BaseParser.prototype);
        fnNames.forEach((fnName) => {
            const descriptor = descriptors[fnName];
            memoize(this, fnName, descriptor);
            Object.defineProperty(this, fnName, descriptor);
        });
    }
}

export { VerboseParser as Parser };
