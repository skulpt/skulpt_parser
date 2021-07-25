// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import { dump } from "../support/ast_dump.ts";
import { parse } from "../deps.ts";
import { runParserFromFile } from "../src/parser/mod.ts";
import { getFileNameOrRunTest } from "./helpers.ts";
import { astOptimize } from "../src/ast/optimize.ts";
import { getDiff } from "../support/diff.ts";

const argv = parse(Deno.args);

const { _: args } = argv;

const options = { indent: 2 };
const filename = getFileNameOrRunTest(args);

const ast = runParserFromFile(filename);
const optimized = astOptimize(runParserFromFile(filename));

const jsDump = dump(ast, options);
const optDump = dump(optimized, options);
console.log(jsDump == optDump);

const res = getDiff(jsDump, optDump);
console.log(res);
