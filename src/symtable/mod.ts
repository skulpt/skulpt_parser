import type { Module, Expression, Interactive, mod } from "../ast/astnodes.ts";
import { ASTKind } from "../ast/astnodes.ts";
import { SymbolTable } from "./SymbolTable.ts";
import { BlockType } from "./util.ts";

export { SymbolTable };

// deno-lint-ignore no-explicit-any
export function buildSymbolTable(mod: mod, filename: string, future: any): SymbolTable {
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
