// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import type { Module, Expression, Interactive, mod } from "../ast/astnodes.ts";
import { ASTKind } from "../ast/astnodes.ts";
import { astFromFile, astFromString } from "../parser/mod.ts";
import type { ModeStr } from "../parser/mod.ts";
import { SymbolTable } from "./SymbolTable.ts";
import { BlockType } from "./util.ts";

export { SymbolTable, BlockType };
export type { Symbol_ } from "./Symbol.ts";
export type { SymbolTableScope } from "./SymbolTableScope.ts";

// deno-lint-ignore no-explicit-any
export function buildSymbolTable(mod: mod, filename = "<string>", future: any = null): SymbolTable {
    const st = new SymbolTable(filename, future);
    /* Make the initial symbol information gathering pass */
    st.enterBlock("top", BlockType.ModuleBlock, mod, 0, 0);
    st.top = st.cur;
    switch (mod._kind) {
        case ASTKind.Module: {
            st.SEQ(st.visitStmt, (mod as Module).body);
            break;
        }
        case ASTKind.Expression: {
            st.visitExpr((mod as Expression).body);
            break;
        }
        case ASTKind.Interactive: {
            st.SEQ(st.visitStmt, (mod as Interactive).body);
            break;
        }
        case ASTKind.FunctionType:
            throw new Error("this compiler does not handle FunctionTypes");
    }
    st.exitBlock();
    /* Make the second symbol analysis pass */
    st.analyze();

    return st;
}

export function symtableFromString(source: string, mode: ModeStr = "exec", filename = "<string>"): SymbolTable {
    const ast = astFromString(source, mode, filename);
    return buildSymbolTable(ast, filename);
}

export function symtableFromFile(filename: string, mode: ModeStr = "exec"): SymbolTable {
    const ast = astFromFile(filename, mode);
    return buildSymbolTable(ast, filename);
}
