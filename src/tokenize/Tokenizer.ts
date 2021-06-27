import { isSpace } from "../util/str_helpers.ts";
import { COMMENT, ERRORTOKEN, EXACT_TOKEN_TYPES, NL } from "./token.ts";
import type { TokenInfo } from "./tokenize.ts";

export const exact_token_types = EXACT_TOKEN_TYPES;

export class Tokenizer {
    _tokengen: Iterator<TokenInfo, TokenInfo>;
    _tokens: TokenInfo[];
    _index: number;
    constructor(tokengen: Iterator<TokenInfo, TokenInfo>) {
        this._tokengen = tokengen;
        this._tokens = [];
        this._index = 0;
    }
    _push(): void {
        while (this._index === this._tokens.length) {
            const tok = this._tokengen.next().value;
            if (tok.type === NL || tok.type === COMMENT) {
                continue;
            }
            if (tok.type === ERRORTOKEN && isSpace(tok.string)) {
                continue;
            }
            this._tokens.push(tok);
        }
    }
    getnext(): TokenInfo {
        this._push();
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
