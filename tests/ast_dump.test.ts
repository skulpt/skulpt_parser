import * as astnodes from "../src/ast/astnodes.ts";
import { dump } from "../src/ast/ast.ts";
import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";

/** Simple name and function, compact form, but not configurable */
async function getPyAstDump(content: string, indent: number | null = 4, attrs = false, js = false): Promise<string> {
    const cmd = Deno.run({
        cmd: [
            "python3",
            "tests/ast_dumper_helper.py",
            content,
            `--indent=${indent === null ? -1 : indent}`,
            attrs ? "--attrs=1" : "--attrs=0",
            js ? "--js=1" : "--js=0",
        ],
        stdout: "piped",
        stderr: "piped",
    });

    const output = await cmd.output(); // "piped" must be set
    const outStr = new TextDecoder().decode(output);

    const error = await cmd.stderrOutput();
    const errorStr = new TextDecoder().decode(error);
    cmd.close(); // Don't forget to close it

    if (errorStr) {
        console.log(outStr);
        console.error(errorStr);
        throw new Error(errorStr);
    }

    return outStr;
}

/** helper function to generate an ast tree that can be converted in typescript - you'll need to add in missing null values */
async function convertToTs(content: string): Promise<string> {
    let py_ast_dump = await getPyAstDump(content, 4, true, true);
    py_ast_dump = py_ast_dump
        .replace(/^(\s+)([a-z_]+=)/gm, (m, m1, m2) => m1 + " ".repeat(m2.length))
        .replace(/^(\s*)([A-Za-z_]+)/gm, (m, m1, m2) => {
            if (m2 === "null" || m2 === "True" || m2 === "False") {
                return m1 + m2.toLowerCase();
            }
            if (m2 === "arguments") {
                m2 += "_";
            }
            return m1 + "new astnodes." + m2;
        })
        .replace(/^(\s+\-?[0-9]+\.[0-9]+(?:e[\-0-9]+)?)/gm, (m, m1) => "new Number(" + m1 + ")")
        .replace(/^(\s+\-?[0-9]{16,})/gm, (m, m1) => m1 + "n");
    // use bigint
    return py_ast_dump;
}

/** a helper function for debugging a failing file */
async function convertFileToTs(fileName: string) {
    const text = await Deno.readTextFile("run-tests/" + fileName);
    const converted = await convertToTs(text);
    console.log(converted);
    const jsAST = eval(converted);
    return jsAST;
}

async function doTest(source: string, mod: astnodes.Module) {
    for (let indent of [null, /* 0, 2,*/ 4]) {
        const py_ast_dump = await getPyAstDump(source, indent);
        assertEquals(py_ast_dump, dump(mod, indent) + "\n");
    }
}

const files = [];
for await (const dirEntry of Deno.readDir("run-tests/")) {
    if (!dirEntry.name.endsWith(".py")) {
        continue;
    }
    files.push(dirEntry.name);
}
files.sort();
const skip = new Set();

for (const test of files) {
    if (skip.has(test)) {
        continue;
    }
    Deno.test({
        name: test,
        fn: async () => {
            new astnodes.Module([], []); // fails without this
            try {
                const text = await Deno.readTextFile("run-tests/" + test);
                const converted = await convertToTs(text);
                const jsAST = eval(converted);
                await doTest(text, jsAST);
            } catch (e) {
                // // uncomment these to exit at the first fail
                // console.error(e);
                // Deno.exit(0);
                throw e;
            }
        },
        sanitizeExit: false,
        // allow us to exit early with Deno.exit
    });
}
