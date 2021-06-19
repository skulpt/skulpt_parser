import * as astnodes from "../src/ast/astnodes.ts";
import { pyFloat, pyInt, pyTrue, pyFalse, pyNone, pyStr } from "../src/ast/constants.ts";
import { dump } from "../src/ast/dump.ts";
import { getPyAstDump } from "../support/py_ast_dump.ts";
// replace with assertEquals when string comparison is better.
import { assertEqualsString } from "../support/diff.ts";

/** helper function to generate an ast tree that can be converted in typescript - you'll need to add in missing null values */
async function convertToTs(content: string): Promise<string> {
    let py_ast_dump = await getPyAstDump(content, 4, true, true);
    py_ast_dump = py_ast_dump
        .replace(/^(\s+)([a-z_]+=)/gm, (m, m1, m2) => m1 + " ".repeat(m2.length))
        .replace(/^(\s*)([A-Za-z_]+)/gm, (m, m1, m2) => {
            if (m2 === "null") {
                return m1 + m2;
            } else if (m2 === "None" || m2 === "True" || m2 === "False") {
                return m1 + "py" + m2;
            }
            if (m2 === "arguments") {
                m2 += "_";
            }
            return m1 + "new astnodes." + m2;
        })
        .replace(
            /new astnodes.Constant\(\n(\s+\-?[0-9](?:e[\-0-9]+))/g,
            (m, m1) => `new astnodes.Constant(\nnew pyFloat(${m1})`
        )
        .replace(
            /new astnodes.Constant\(\n(\s+\-?[0-9]+\.[0-9]+(?:e[\-0-9]+)?)/g,
            (m, m1) => `new astnodes.Constant(\nnew pyFloat(${m1})`
        )
        // use bigint for dumping
        .replace(/new astnodes.Constant\(\n(\s+\-?[0-9]+)/g, (m, m1) => `new astnodes.Constant(\nnew pyInt(${m1}n)`)
        .replace(/new astnodes.Constant\(\n(\s+['"].*['"])/g, (m, m1) => `new astnodes.Constant(\nnew pyStr(${m1})`);
    // we might also need to make id a string constant or maybe just make pyStr a js string
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
    for (let indent of [4, null]) {
        const py_ast_dump = await getPyAstDump(source, indent);
        assertEqualsString(py_ast_dump, dump(mod, indent) + "\n");
    }
}

// const tmp = "t000.py"
// console.log(dump(await convertFileToTs(tmp), 2));
// const files = [tmp];

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
            pyFloat;
            pyInt;
            pyStr;
            pyTrue;
            pyFalse;
            pyNone;
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
