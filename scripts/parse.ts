// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

// deno-lint-ignore-file camelcase
import { dump } from "../support/ast_dump.ts";
import { parse } from "../deps.ts";
import { getPyAstDump } from "../support/py_ast_dump.ts";
import { runParserFromFile } from "../src/parser/parse.ts";
import type { expr, mod } from "../src/ast/astnodes.ts";
import { doCompare, getFileNameOrRunTest } from "./helpers.ts";

const argv = parse(Deno.args, {
    default: { mode: "exec" },
    boolean: ["no_compare", "ignore_attrs"],
    alias: { mode: "m", no_compare: "nc" },
});

const { _: args, mode, no_compare: noCompare, ignore_attrs: ignoreAttrs } = argv;

const options = { indent: 2, include_attributes: !ignoreAttrs };
const filename = getFileNameOrRunTest(args);

let ast: mod | expr;
try {
    ast = runParserFromFile(filename, mode);
} catch (e) {
    // include the pySytnaxError traceback in our output for use with pypeg tests
    if (e.traceback) {
        e.message = e.message + "\n" + e.traceback;
    }
    throw e;
}

const jsDump = dump(ast, options);
if (noCompare) {
    console.log(jsDump);
    Deno.exit();
}
await doCompare(jsDump, filename, (source) => getPyAstDump(source, options, mode));
