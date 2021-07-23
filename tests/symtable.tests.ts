import { dump } from "../support/symtable_dump.ts";
import { getPySymTableDump } from "../support/py_symtable_dump.ts";
import { buildSymbolTable } from "../src/symtable/mod.ts";

import { runParserFromString } from "../src/parser/parse.ts";
import { runTests } from "./run_tests_helper.ts";
import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";

async function doTest(source: string) {
    const pyDump = await getPySymTableDump(source);
    const jsAST = runParserFromString(source);
    const symtable = dump(buildSymbolTable(jsAST));

    assertEquals(symtable, JSON.parse(pyDump));
}

const files: string[] = JSON.parse(Deno.env.get("_TESTFILES") || "[]");

await runTests(doTest, { files, skip: new Set(), failFast: false });
