// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import { AssertionError, Colors, parse } from "../deps.ts";

const args = parse(Deno.args, { boolean: ["f"], alias: { f: "fail-fast" } });
const test = args._[0];

const extra = [];
const validShortnames = ["parse", "pypeg", "symtable", "dump", "optimize"];
if (!validShortnames.includes(test as string)) {
    throw new AssertionError(
        Colors.bgRed(
            Colors.white(
                "Unrecognised shortname for 'vr test', expected one of " +
                    [...validShortnames].map((name) => `'${name}'`).join(", ")
            )
        )
    );
}

switch (test) {
    case "parse":
        extra.push("tests/parse.test.ts");
        break;
    case "pypeg": {
        const res = await Deno.run({
            cmd: [
                "python",
                "-m",
                "unittest",
                "tests/test_peg_parser.py",
                ...Deno.args.filter((arg) => arg !== "pypeg"),
            ],
        }).status();
        Deno.exit(res.code);
        break; // just to keep ts happy
    }
    case "symtable":
        extra.push("tests/symtable.test.ts");
        break;
    case "dump":
        extra.push("tests/ast_dump.test.ts");
        break;
    case "optimize":
        extra.push("tests/optimize.test.ts");
        break;
}

if (args["f"]) {
    extra.push("--fail-fast");
}

/** set this in Deno env which other test files can retrieve
 * example use: `vr test parse 1`
 */
const files = args._.filter((x) => typeof x === "number").map((x) => `t${x.toString().padStart(3, "0")}.py`);
Deno.env.set("_TESTFILES", JSON.stringify(files));

const cmd = Deno.run({
    cmd: ["deno", "test", "--allow-read", "--allow-run", "--allow-env", ...extra],
});

const result = await cmd.status();

Deno.exit(result.code);
