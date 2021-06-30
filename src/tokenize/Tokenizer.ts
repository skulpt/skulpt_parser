import type { AST } from "../ast/astnodes.ts";
import { isSpace } from "../util/str_helpers.ts";
import { COMMENT, ERRORTOKEN, NL } from "./token.ts";
import type { TokenInfo } from "./tokenize.ts";

export class Tokenizer {
    _tokengen: Iterator<TokenInfo, TokenInfo>;
    _tokens: TokenInfo[];
    _cache: { [key: string]: [AST | TokenInfo | null, number] }[];
    _index: number;
    constructor(tokengen: Iterator<TokenInfo, TokenInfo>) {
        this._tokengen = tokengen;
        this._tokens = [];
        this._cache = [{}];
        this._index = 0;
    }
    _push(): void {
        while (this._index === this._tokens.length) {
            const tok = this._tokengen.next().value;
            const type = tok.type;
            if (type === NL || type === COMMENT) {
                continue;
            }
            if (type === ERRORTOKEN && isSpace(tok.string)) {
                continue;
            }
            this._tokens.push(tok);
        }
    }
    getnext(): TokenInfo {
        this._push();
        this._cache.push({});
        return this._tokens[this._index++];
    }
    peek(): TokenInfo {
        this._push();
        return this._tokens[this._index];
    }
    diagnose(): TokenInfo {
        if (this._tokens.length === 0) {
            this.getnext();
        }
        return this._tokens[this._tokens.length - 1];
    }
    mark(): number {
        return this._index;
    }
    reset(index: number): null | void {
        if (index === this._index) {
            return null;
        }
        // assert(0 <= index && index <= this._tokens.length);
        this._index = index;
    }
}
