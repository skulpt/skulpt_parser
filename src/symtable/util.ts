// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

export type FlagMap = { [name: string]: number };

export const enum BlockType {
    ModuleBlock = "module",
    FunctionBlock = "function",
    ClassBlock = "class",
    AnnotationBlock = "annotation",
}

export function inplaceMerge<T>(left: Set<T>, right: Set<T>) {
    for (const v of right) {
        left.add(v);
    }
}

const LEADING_UNDERSCORE_REGEX = /^_+/;

export const enum SYMTAB_CONSTS {
    DEF_GLOBAL = 1 /* global stmt */,
    DEF_LOCAL = 2 /* assignment in code block */,
    DEF_PARAM = 2 << 1 /* formal parameter */,
    DEF_NONLOCAL = 2 << 2 /* nonlocal stmt */,
    USE = 2 << 3 /* name is used */,
    DEF_FREE = 2 << 4 /* name used but not defined in nested block */,
    DEF_FREE_CLASS = 2 << 5 /* free variable from class's method */,
    DEF_IMPORT = 2 << 6 /* assignment occurred via import */,
    DEF_ANNOT = 2 << 7 /* this name is annotated */,
    DEF_COMP_ITER = 2 << 8 /* this name is a comprehension iteration variable */,
    DEF_BOUND = DEF_LOCAL | DEF_PARAM | DEF_IMPORT,

    /* GLOBAL_EXPLICIT and GLOBAL_IMPLICIT are used internally by the symbol
       table.  GLOBAL is returned from PyST_GetScope() for either of them.
       It is stored in ste_symbols at bits 12-15.
    */

    SCOPE_OFFSET = 11,
    SCOPE_MASK = DEF_GLOBAL | DEF_LOCAL | DEF_PARAM | DEF_NONLOCAL,
    LOCAL = 1,
    GLOBAL_EXPLICIT = 2,
    GLOBAL_IMPLICIT = 3,
    FREE = 4,
    CELL = 5,
    GENERATOR = 1,
    GENERATOR_EXPRESSION = 2,
}

export function mangle(privateobj: string | null, ident: string) {
    /* Name mangling: __private becomes _classname__private.
       This is independent from how the name is used. */
    if (privateobj === null /* !PyUnicode_Check(privateobj) || */ || !ident.startsWith("__")) {
        return ident;
    }
    /* Don't mangle __id__ or names with dots.
          The only time a name with a dot can occur is when
          we are compiling an import statement that has a
          package name.
          TODO(jhylton): Decide whether we want to support
          mangling of the module name, e.g. __M.X.
       */
    if (ident.endsWith("__") || ident.includes(".")) {
        return ident; /* Don't mangle __whatever__ */
    }

    /* Strip leading underscores from class name */
    const stripped = privateobj.replace(LEADING_UNDERSCORE_REGEX, "");
    if (stripped.length === 0) {
        return ident; /* Don't mangle if class is just underscores */
    }

    /* ident = "_" + priv[ipriv:] + ident # i.e. 1+plen+nlen bytes */
    return `_${stripped}${ident}`;
}
