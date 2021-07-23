// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

/** deno run -A --unstable scripts/sk_bench.ts tmp.txt */
import { bench, Colors, parse, runBenchmarks } from "../deps.ts";
// don't make this part of the deps.ts because it's unstable and means an unstable flag everywher
import { createRequire } from "https://deno.land/std@0.100.0/node/module.ts";

const require = createRequire(import.meta.url);
// Loads extensionless module.
require("../../skulpt/dist/skulpt.min.js");

// deno-lint-ignore no-explicit-any
declare var Sk: any;
Sk.__future__ = { python3: true };

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
    runs: 50,
    func(b): void {
        b.start();
        const parse = Sk.parse(filename, text);
        Sk.astFromParse(parse.cst, filename, parse.flags);
        b.stop();
    },
});

runBenchmarks({}, (p) => {
    if (p.running && p.running.measuredRunsMs.length) {
        console.log(p.running.measuredRunsMs[p.running.measuredRunsMs.length - 1], "ms");
    }
});
