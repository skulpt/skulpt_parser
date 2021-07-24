// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

// deno-lint-ignore-file camelcase
import { dump } from "../support/ast_dump.ts";
import { parse } from "../deps.ts";
import { getPyAstDump } from "../support/py_ast_dump.ts";
import { runParserFromFile } from "../src/parser/mod.ts";
import type { expr, mod } from "../src/ast/astnodes.ts";
import { doCompare, getFileNameOrRunTest } from "./helpers.ts";
import { switchVersion } from "../src/util/switch_version.ts";

const argv = parse(Deno.args, {
    default: { mode: "exec" },
    boolean: ["no_compare", "ignore_attrs", "python2"],
    alias: { mode: "m", no_compare: "nc", python2: "py2" },
});

const { _: args, mode, no_compare: noCompare, ignore_attrs: ignoreAttrs, python2: py2 } = argv;

const options = { indent: 2, include_attributes: !ignoreAttrs };
const filename = getFileNameOrRunTest(args);

py2 && switchVersion(!py2);

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
if (noCompare || py2) {
    console.log(jsDump);
    Deno.exit();
}
await doCompare(jsDump, filename, (source) => getPyAstDump(source, options, mode));
