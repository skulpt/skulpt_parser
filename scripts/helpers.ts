// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import { Colors } from "../deps.ts";
import { getDiff } from "../support/diff.ts";

export async function doCompare(jsDump: string, filename: string, getPythonDump: (source: string) => Promise<string>) {
    console.log();
    console.log(Colors.bold(Colors.magenta("##### py (EXPECTED) #####")));
    const pyDump = await getPythonDump(Deno.readTextFileSync(filename));
    console.log(Colors.magenta(pyDump));
    console.log();
    console.log(Colors.bold(Colors.green("/**** js  (ACTUAL)   ****/")));
    console.log(Colors.green(jsDump));
    console.log();
    console.log(getDiff(jsDump, pyDump));
}

export function getFileNameOrRunTest(args: (string | number)[]) {
    console.assert(args.length == 1, Colors.bold(Colors.bgRed(Colors.white(" Must pass filename as argument "))));
    const filename = args[0];
    if (typeof filename === "number") {
        return `run-tests/t${filename.toString().padStart(3, "0")}.py`;
    }
    return filename;
}
