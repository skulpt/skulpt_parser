// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import { assertEquals } from "../deps.ts";
import { python } from "https://deno.land/x/python/mod.ts";
import { astFromString, parserFromString } from "../src/parser/mod.ts";
import { dump } from "../support/ast_dump.ts";

const sys = python.import("sys");
console.log(sys.path, sys.version);
const peg_parser = python.import("_peg_parser");
const ast = python.import("ast");
sys.path.append("/Users/scork/Desktop/Projects/skulpt_parser/tests");
const test_peg_parser = python.import("test_peg_parser");

const IGNORE_ATTRS = Array.from(test_peg_parser.IGNORE_ATTRS.valueOf());

const TEST_CASES = test_peg_parser.TEST_CASES.valueOf();

for (const [name, source] of TEST_CASES) {
    const expected_ast = peg_parser.parse_string(source, python.kw`mode=${"exec"}`);
    const ignoreAttrs = IGNORE_ATTRS.includes(name);
    const expected_ast_dump = ast.dump(
        expected_ast,
        python.kw`include_attributes=${!ignoreAttrs}`,
        python.kw`indent=${2}`
    );
    const skAst = astFromString(source, "exec");
    const skDumped = dump(skAst, { indent: 2, include_attributes: !ignoreAttrs });
    Deno.test({
        name,
        fn() {
            assertEquals(skDumped, String(expected_ast_dump));
        },
    });
}
