import { isSpace } from "../util/str_helpers";
import { COMMENT, ERRORTOKEN, EXACT_TOKEN_TYPES, NL } from "./token";
import { TokenInfo } from "./tokenize";

export const exact_token_types = EXACT_TOKEN_TYPES;

export class Tokenizer {
    _tokengen: Iterator<TokenInfo, TokenInfo>
    _tokens: TokenInfo[]
    _index: number
    _verbose: boolean
    constructor(tokengen, verbose: boolean = false) {
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
        const old_index = this._index;
        this._index = index;
        if (this._verbose) {
            this.report(true, index < old_index);
        }
    }
    report(cached, back): void {
        // pass
    }
}



export function readline(text: string): () => string {
    const textasarray: string[] = text.split("\n").map(x => x + "\n");
    let i: number = 0;
    return () => textasarray[i++];
}