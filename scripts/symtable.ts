// deno-lint-ignore-file camelcase
import { Colors, parse } from "../deps.ts";
import { runParserFromFile } from "../src/parser/parse.ts";
import type { expr, mod } from "../src/ast/astnodes.ts";
import { buildSymbolTable, SymbolTable } from "../src/parser/symtable.ts";

const argv = parse(Deno.args, {
    default: { mode: "exec" } /** @todo this doesn't get passed to the python script */,
    boolean: ["no_compare", "ignore_attrs"],
    alias: { mode: "m", no_compare: "nc" },
});

const { _: args, mode, no_compare: noCompare, ignore_attrs: ignoreAttrs } = argv;

const options = { indent: 2, include_attributes: !ignoreAttrs };

console.assert(args.length == 1, Colors.bold(Colors.bgRed(Colors.white(" Must pass filename as argument "))));

const filearg = args[0];

let filename: string;
if (typeof filearg === "number") {
    filename = `run-tests/t${filearg.toString().padStart(3, "0")}.py`;
} else {
    filename = filearg;
}

let ast: mod | expr | null = null;
try {
    ast = runParserFromFile(filename, mode);
} catch (e) {
    // include the traceback in our output
    if (e.traceback) {
        e.message = e.message + "\n" + e.traceback;
    }
    throw e;
}

let symbolTable: SymbolTable;

try {
    symbolTable = buildSymbolTable(ast, filename, null);
} catch (e) {
    // include the traceback in our output
    if (e.traceback) {
        e.message = e.message + "\n" + e.traceback;
    }
    throw e;
}

console.log(symbolTable);
