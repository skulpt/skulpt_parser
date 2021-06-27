import { isSpace } from "../util/str_helpers.ts";
import { COMMENT, ERRORTOKEN, NL } from "./token.ts";
import type { TokenInfo } from "./tokenize.ts";

export class Tokenizer {
    _tokengen: Iterator<TokenInfo, TokenInfo>;
    _tokens: TokenInfo[];
    _index: number;
    _verbose: boolean;
    constructor(tokengen: Iterator<TokenInfo, TokenInfo>, verbose: boolean = false) {
        this._tokengen = tokengen;
        this._tokens = [];
        this._index = 0;
        this._verbose = verbose;
        if (verbose) {
            this.report(false, false);
        }
    }
    getnext(): TokenInfo {
        let cached = true;
        let tok: TokenInfo;
        while (this._index === this._tokens.length) {
            tok = this._tokengen.next().value;
            if (tok.type === NL || tok.type === COMMENT) {
                continue;
            }
            if (tok.type === ERRORTOKEN && isSpace(tok.string)) {
                continue;
            }
            this._tokens.push(tok);
            cached = false;
        }
        tok = this._tokens[this._index];
        this._index++;
        if (this._verbose) {
            this.report(cached, false);
        }
        return tok;
    }
    peek(): TokenInfo {
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
        return this._tokens[this._index];
    }
    diagnose(): TokenInfo {
        if (!this._tokens.length) {
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
        const oldIndex = this._index;
        this._index = index;
        if (this._verbose) {
            this.report(true, index < oldIndex);
        }
    }
    report(_cached: boolean, _back: boolean): void {
        /** @todo - either support a verbose tokenizer or remove the verbosity argument */
    }
}
