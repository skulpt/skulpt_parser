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
import { bench, Colors, parse, runBenchmarks } from "../deps.ts";
import type { AST, expr, mod } from "../src/ast/astnodes.ts";
import { runParserFromString } from "../src/parser/mod.ts";
import { ASTVisitor } from "../src/ast/astnodes.ts";
import { buildSymbolTable } from "../src/symtable/mod.ts";
import { readString } from "../src/tokenize/readline.ts";
import { tokenize } from "../src/tokenize/tokenize.ts";
import { astOptimize } from "../src/ast/optimize.ts";

const { _: args } = parse(Deno.args);

console.assert(args.length == 1, Colors.bold(Colors.bgRed(Colors.white(" Must pass filename as argument "))));

const filearg = args[0];

let filename: string;
if (typeof filearg === "number") {
    filename = `run-tests/t${filearg.toString().padStart(3, "0")}.py`;
} else {
    filename = filearg;
}

const text = Deno.readTextFileSync(filename);

bench({
    name: "parse",
    runs: 200,
    func(b): void {
        b.start();
        runParserFromString(text);
        b.stop();
    },
});

bench({
    name: "tokenize",
    runs: 200,
    func(b): void {
        b.start();
        [...tokenize(readString(text), filename)];
        b.stop();
    },
});

let astSym: mod | expr;

bench({
    name: "symtable",
    runs: 200,
    func(b): void {
        astSym ??= runParserFromString(text);
        b.start();
        buildSymbolTable(astSym, filename);
        b.stop();
    },
});

bench({
    name: "optimize",
    runs: 2000,
    func(b): void {
        const ast = runParserFromString(text);
        b.start();
        astOptimize(ast);
        b.stop();
    },
});

runBenchmarks({ only: /optimize/ }, (p) => {
    if (p.running && p.running.measuredRunsMs.length) {
        console.log(p.running.measuredRunsMs[p.running.measuredRunsMs.length - 1], "ms");
    } else if (p.results.length) {
        const res = p.results[0].measuredRunsMs;
        res.sort((a, b) => a - b);
        console.log(res[0], res[res.length - 1]);
    }
});
