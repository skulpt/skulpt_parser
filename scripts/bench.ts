// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

/**
 * deno run -A scripts/bench.ts tmp.txt
 *
 * Note it's also a good idea to bundle this first using vr build
 * changing scripts/build.ts to build this file instead
 *
 * then adjust the above command to
 * deno run -A dist/bundle.min.js tmp.txt
 */
import { Colors, parse } from "../deps.ts";
import type { expr, mod } from "../src/ast/astnodes.ts";
import { runParserFromString } from "../src/parser/mod.ts";
import { buildSymbolTable } from "../src/symtable/mod.ts";
import { readString } from "../src/tokenize/readline.ts";
import { tokenize } from "../src/tokenize/tokenize.ts";
import { astOptimize } from "../src/ast/optimize.ts";

const { _: args } = parse(Deno.args);

console.assert(args.length == 1, Colors.bold(Colors.bgRed(Colors.white(" Must pass filename as argument "))));

const filearg = args[0];

let filename: string;

if (typeof filearg === "number" || Number.parseInt(filearg)) {
    filename = `run-tests/t${filearg.toString().padStart(3, "0")}.py`;
} else {
    filename = filearg;
}

const text = Deno.readTextFileSync(filename);

Deno.bench({
    name: "parse",
    fn() {
        runParserFromString(text);
    },
});

Deno.bench({
    name: "tokenize",
    fn() {
        [...tokenize(readString(text), filename)];
    },
});

const astSym: mod | expr = runParserFromString(text);

Deno.bench({
    name: "symtable",
    fn() {
        buildSymbolTable(astSym, filename);
    },
});

Deno.bench({
    name: "optimize",
    fn() {
        const ast = runParserFromString(text);
        astOptimize(ast);
    },
});
