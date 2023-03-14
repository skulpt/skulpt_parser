// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

/** deno run -A --unstable scripts/sk_bench.ts tmp.txt */
import { Colors, parse, createRequire } from "../deps.ts";
// don't make this part of the deps.ts because it's unstable and means an unstable flag everywher

const require = createRequire(import.meta.url);
require("../../skulpt/dist/skulpt.min.js");

// deno-lint-ignore no-explicit-any
declare var Sk: any;
Sk.__future__ = { python3: true };

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
    fn(): void {
        const parse = Sk.parse(filename, text);
        Sk.astFromParse(parse.cst, filename, parse.flags);
    },
});
