import { assert } from "../src/util/assert.ts";
import type { SymbolTableScope, Symbol_, SymbolTable } from "../src/symtable/mod.ts";
import { BlockType } from "../src/symtable/mod.ts";

type Table = { [s: string]: boolean | BlockType | string | number | string[] | Table[] | null };

function symboToDict(symbol: Symbol_): Table {
    return {
        name: symbol.get_name(),
        referenced: symbol.is_referenced(),
        parameter: symbol.is_parameter(),
        global: symbol.is_global(),
        nonlocal: symbol.is_nonlocal(),
        declared_global: symbol.is_declared_global(),
        local: symbol.is_local(),
        annotated: symbol.is_annotated(),
        free: symbol.is_free(),
        imported: symbol.is_imported(),
        assigned: symbol.is_assigned(),
        namespace: symbol.is_namespace(),
        namespaces: (symbol.get_namespaces() || []).map((t) => tableToDict(t)),
    };
}

function tableToDict(table: SymbolTableScope): Table {
    let res: Table = {
        type: table.get_type(),
        name: table.get_name(),
        lineno: table.get_lineno(),
        nested: table.is_nested(),
        // deno-lint-ignore camelcase
        has_children: table.has_children(),
        children: table.get_children().map((c) => tableToDict(c)),
    };

    if (table.get_type() === BlockType.FunctionBlock) {
        res = {
            ...res,
            params: table.get_parameters(),
            locals: table.get_locals(),
            globals: table.get_globals(),
            nonlocals: table.get_nonlocals(),
            frees: table.get_frees(),
        };
    }

    if (table.get_type() === BlockType.ClassBlock) {
        res = {
            ...res,
            methods: table.get_methods(),
        };
    }

    res["identifiers"] = table.get_identifiers().map((s) => symboToDict(table.lookup(s)));

    return res;
}

export function dump(symTable: SymbolTable) {
    assert(symTable.top, "must have outermost scope");
    return tableToDict(symTable.top);
}
