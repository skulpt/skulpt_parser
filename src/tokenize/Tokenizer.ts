import type { AST } from "../ast/astnodes.ts";
import { isSpace } from "../util/str_helpers.ts";
import { COMMENT, ERRORTOKEN, NL } from "./token.ts";
import type { TokenInfo } from "./tokenize.ts";

export class Tokenizer {
    _tokengen: Iterator<TokenInfo, TokenInfo>;
    _tokens: TokenInfo[];
    _cache: { [key: string]: [AST | TokenInfo | null, number] }[];
    _index: number;
    _fmode: boolean;
    _lineno: number;
    _offset: number;
    constructor(tokengen: Iterator<TokenInfo, TokenInfo>) {
        this._tokengen = tokengen;
        this._tokens = [];
        this._cache = [{}];
        this._index = 0;
        this._fmode = false;
        this._lineno = 0;
        this._offset = 0;
    }
    _adjust_offset(tok: TokenInfo) {
        const start = tok.start;
        const end = tok.end;
        // only adjust the col_offset if we're on the first line
        if (start[0] === 1) {
            start[1] += this._offset;
            if (end[0] === 1) {
                end[1] += this._offset;
            }
        }
        start[0] += this._lineno;
        end[0] += this._lineno;
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
            // if we're in fmode we may need to adjust the lineno and offset
            if (this._fmode) {
                this._adjust_offset(tok);
            }
            this._tokens.push(tok);
        }
    }
    /** if we set thes starting_lineno or starting_col_offset we're in fmode */
    set starting_lineno(lineno: number) {
        this._lineno = lineno;
        this._fmode = lineno === 0 ? this._fmode : true;
    }
    set starting_col_offset(offset: number) {
        this._offset = offset;
        this._fmode = offset === 0 ? this._fmode : true;
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
