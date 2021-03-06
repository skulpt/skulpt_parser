// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

export enum tokens {
    ENDMARKER,
    NAME,
    NUMBER,
    STRING,
    NEWLINE,
    INDENT,
    DEDENT,
    LPAR,
    RPAR,
    LSQB,
    RSQB,
    COLON,
    COMMA,
    SEMI,
    PLUS,
    MINUS,
    STAR,
    SLASH,
    VBAR,
    AMPER,
    LESS,
    GREATER,
    EQUAL,
    DOT,
    PERCENT,
    LBRACE,
    RBRACE,
    EQEQUAL,
    NOTEQUAL,
    LESSEQUAL,
    GREATEREQUAL,
    TILDE,
    CIRCUMFLEX,
    LEFTSHIFT,
    RIGHTSHIFT,
    DOUBLESTAR,
    PLUSEQUAL,
    MINEQUAL,
    STAREQUAL,
    SLASHEQUAL,
    PERCENTEQUAL,
    AMPEREQUAL,
    VBAREQUAL,
    CIRCUMFLEXEQUAL,
    LEFTSHIFTEQUAL,
    RIGHTSHIFTEQUAL,
    DOUBLESTAREQUAL,
    DOUBLESLASH,
    DOUBLESLASHEQUAL,
    AT,
    ATEQUAL,
    RARROW,
    ELLIPSIS,
    COLONEQUAL,
    OP,
    AWAIT,
    ASYNC,
    TYPE_IGNORE,
    TYPE_COMMENT,
    ERRORTOKEN,
    COMMENT,
    NL,
    ENCODING,
    N_TOKENS,
}

export const ENDMARKER = tokens.ENDMARKER;
export const NAME = tokens.NAME;
export const NUMBER = tokens.NUMBER;
export const STRING = tokens.STRING;
export const NEWLINE = tokens.NEWLINE;
export const INDENT = tokens.INDENT;
export const DEDENT = tokens.DEDENT;
export const DOT = tokens.DOT;
export const ELLIPSIS = tokens.ELLIPSIS;
export const OP = tokens.OP;
export const ERRORTOKEN = tokens.ERRORTOKEN;
export const COMMENT = tokens.COMMENT;
export const NL = tokens.NL;

export const EXACT_TOKEN_TYPES = new Map([
    ["!=", tokens.NOTEQUAL],
    ["%", tokens.PERCENT],
    ["%=", tokens.PERCENTEQUAL],
    ["&", tokens.AMPER],
    ["&=", tokens.AMPEREQUAL],
    ["(", tokens.LPAR],
    [")", tokens.RPAR],
    ["*", tokens.STAR],
    ["**", tokens.DOUBLESTAR],
    ["**=", tokens.DOUBLESTAREQUAL],
    ["*=", tokens.STAREQUAL],
    ["+", tokens.PLUS],
    ["+=", tokens.PLUSEQUAL],
    [",", tokens.COMMA],
    ["-", tokens.MINUS],
    ["-=", tokens.MINEQUAL],
    ["->", tokens.RARROW],
    [".", tokens.DOT],
    ["...", tokens.ELLIPSIS],
    ["/", tokens.SLASH],
    ["//", tokens.DOUBLESLASH],
    ["//=", tokens.DOUBLESLASHEQUAL],
    ["/=", tokens.SLASHEQUAL],
    [":", tokens.COLON],
    [":=", tokens.COLONEQUAL],
    [";", tokens.SEMI],
    ["<", tokens.LESS],
    ["<<", tokens.LEFTSHIFT],
    ["<<=", tokens.LEFTSHIFTEQUAL],
    ["<=", tokens.LESSEQUAL],
    ["=", tokens.EQUAL],
    ["==", tokens.EQEQUAL],
    [">", tokens.GREATER],
    [">=", tokens.GREATEREQUAL],
    [">>", tokens.RIGHTSHIFT],
    [">>=", tokens.RIGHTSHIFTEQUAL],
    ["@", tokens.AT],
    ["@=", tokens.ATEQUAL],
    ["[", tokens.LSQB],
    ["]", tokens.RSQB],
    ["^", tokens.CIRCUMFLEX],
    ["^=", tokens.CIRCUMFLEXEQUAL],
    ["{", tokens.LBRACE],
    ["|", tokens.VBAR],
    ["|=", tokens.VBAREQUAL],
    ["}", tokens.RBRACE],
    ["~", tokens.TILDE],
]);
