// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import { parse } from "../deps.ts";
import { runParserFromFile } from "../src/parser/parse.ts";
import { buildSymbolTable } from "../src/symtable/mod.ts";
import { getPySymTableDump } from "../support/py_symtable_dump.ts";
import { dump } from "../support/symtable_dump.ts";
import { doCompare, getFileNameOrRunTest } from "./helpers.ts";

const argv = parse(Deno.args, {
    boolean: ["no_compare"],
    alias: { no_compare: "nc" },
});

const { _: args, no_compare: noCompare } = argv;

const filename = getFileNameOrRunTest(args);
const ast = runParserFromFile(filename);
const symbolTable = buildSymbolTable(ast, filename, null);

if (noCompare) {
    console.log(symbolTable);
    Deno.exit();
}

const jsDump = JSON.stringify(dump(symbolTable), null, 2);
doCompare(jsDump, filename, getPySymTableDump);
