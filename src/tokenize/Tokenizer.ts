// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import { isSpace } from "../util/str_helpers.ts";
import { COMMENT, ERRORTOKEN, NL } from "./token.ts";
import type { TokenInfo } from "./tokenize.ts";

export class Tokenizer {
    _gen: Iterator<TokenInfo, TokenInfo>;
    _tokens: TokenInfo[];
    _fmode: boolean;
    _lineno: number;
    _offset: number;
    constructor(tokengen: Iterator<TokenInfo, TokenInfo>) {
        this._gen = tokengen;
        this._tokens = [];
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
    getnext(): TokenInfo {
        while (true) {
            const tok = this._gen.next().value;
            const type = tok.type;
            if (type === NL || type === COMMENT) {
                continue;
            } else if (type === ERRORTOKEN && isSpace(tok.string)) {
                continue;
            }
            if (this._fmode) {
                this._adjust_offset(tok);
            }
            this._tokens.push(tok);
            return tok;
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
}
