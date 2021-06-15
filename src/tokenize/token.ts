// we should auto generate this

export const ENDMARKER = 0;
export const NAME = 1;
export const NUMBER = 2;
export const STRING = 3;
export const NEWLINE = 4;
export const INDENT = 5;
export const DEDENT = 6;
export const LPAR = 7;
export const RPAR = 8;
export const LSQB = 9;
export const RSQB = 10;
export const COLON = 11;
export const COMMA = 12;
export const SEMI = 13;
export const PLUS = 14;
export const MINUS = 15;
export const STAR = 16;
export const SLASH = 17;
export const VBAR = 18;
export const AMPER = 19;
export const LESS = 20;
export const GREATER = 21;
export const EQUAL = 22;
export const DOT = 23;
export const PERCENT = 24;
export const LBRACE = 25;
export const RBRACE = 26;
export const EQEQUAL = 27;
export const NOTEQUAL = 28;
export const LESSEQUAL = 29;
export const GREATEREQUAL = 30;
export const TILDE = 31;
export const CIRCUMFLEX = 32;
export const LEFTSHIFT = 33;
export const RIGHTSHIFT = 34;
export const DOUBLESTAR = 35;
export const PLUSEQUAL = 36;
export const MINEQUAL = 37;
export const STAREQUAL = 38;
export const SLASHEQUAL = 39;
export const PERCENTEQUAL = 40;
export const AMPEREQUAL = 41;
export const VBAREQUAL = 42;
export const CIRCUMFLEXEQUAL = 43;
export const LEFTSHIFTEQUAL = 44;
export const RIGHTSHIFTEQUAL = 45;
export const DOUBLESTAREQUAL = 46;
export const DOUBLESLASH = 47;
export const DOUBLESLASHEQUAL = 48;
export const AT = 49;
export const ATEQUAL = 50;
export const RARROW = 51;
export const ELLIPSIS = 52;
export const COLONEQUAL = 53;
export const OP = 54;
export const AWAIT = 55;
export const ASYNC = 56;
export const TYPE_IGNORE = 57;
export const TYPE_COMMENT = 58;
// # These aren't used by the C tokenizer but are needed for tokenize.py
export const ERRORTOKEN = 59;
export const COMMENT = 60;
export const NL = 61;
export const ENCODING = 62;
export const N_TOKENS = 63;
// # Special definitions for cooperation with parser
export const NT_OFFSET = 256;

export const tokens: { [tok_name: string]: number } = {
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
    // # These aren't used by the C tokenizer but are needed for tokenize.py
    ERRORTOKEN,
    COMMENT,
    NL,
    ENCODING,
    N_TOKENS,
    // # Special definitions for cooperation with parser
    NT_OFFSET,
};

Object.freeze(tokens);

export const tok_name = Object.fromEntries(Object.entries(tokens).map(([key, val]) => [val, key]));

export const EXACT_TOKEN_TYPES: { [token: string]: number } = {
    "!=": NOTEQUAL,
    "%": PERCENT,
    "%=": PERCENTEQUAL,
    "&": AMPER,
    "&=": AMPEREQUAL,
    "(": LPAR,
    ")": RPAR,
    "*": STAR,
    "**": DOUBLESTAR,
    "**=": DOUBLESTAREQUAL,
    "*=": STAREQUAL,
    "+": PLUS,
    "+=": PLUSEQUAL,
    ",": COMMA,
    "-": MINUS,
    "-=": MINEQUAL,
    "->": RARROW,
    ".": DOT,
    "...": ELLIPSIS,
    "/": SLASH,
    "//": DOUBLESLASH,
    "//=": DOUBLESLASHEQUAL,
    "/=": SLASHEQUAL,
    ":": COLON,
    ":=": COLONEQUAL,
    ";": SEMI,
    "<": LESS,
    "<<": LEFTSHIFT,
    "<<=": LEFTSHIFTEQUAL,
    "<=": LESSEQUAL,
    "=": EQUAL,
    "==": EQEQUAL,
    ">": GREATER,
    ">=": GREATEREQUAL,
    ">>": RIGHTSHIFT,
    ">>=": RIGHTSHIFTEQUAL,
    "@": AT,
    "@=": ATEQUAL,
    "[": LSQB,
    "]": RSQB,
    "^": CIRCUMFLEX,
    "^=": CIRCUMFLEXEQUAL,
    "{": LBRACE,
    "|": VBAR,
    "|=": VBAREQUAL,
    "}": RBRACE,
    "~": TILDE,
};

export function ISTERMINAL(x: number): boolean {
    return x < NT_OFFSET;
}

export function ISNONTERMINAL(x: number): boolean {
    return x >= NT_OFFSET;
}

export function ISEOF(x: number): boolean {
    return x == ENDMARKER;
}
