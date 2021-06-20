import * as astnodes from "../src/ast/astnodes.ts";
import { pyFloat, pyInt, pyTrue, pyFalse, pyNone, pyStr } from "../src/ast/constants.ts";
import { dump } from "../src/ast/dump.ts";
import { getPyAstDump } from "../support/py_ast_dump.ts";
// replace with assertEquals when string comparison is better.
import { assertEqualsString } from "../support/diff.ts";
import { runTests } from "./run_tests_helper.ts";

/** helper function to generate an ast tree that can be converted in typescript - you'll need to add in missing null values */
async function convertToTs(content: string): Promise<string> {
    let py_ast_dump = await getPyAstDump(content, { indent: 4, include_attributes: true, js: true });
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
            return `${m1} astnodes.${m2}._enum ? astnodes.${m2} : new astnodes.${m2}`;
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

async function doTest(source: string) {
    astnodes;
    pyFloat;
    pyInt;
    pyStr;
    pyTrue;
    pyFalse;
    pyNone;

    const converted = await convertToTs(source);
    const jsAST = eval(converted) as astnodes.mod;
    const indent = [0, 2, 4, null][Math.floor(Math.random() * 4)];
    const pyDump = await getPyAstDump(source, { indent, include_attributes: true });
    const jsDump = dump(jsAST, { indent, include_attributes: true });
    assertEqualsString(jsDump, pyDump);
}

// const tmp = "t023.py"
// console.log(dump(await convertFileToTs(tmp), {indent: 2, include_attributes: true}));
// const files = [tmp];

const files: string[] = [];

await runTests(doTest, { files, skip: new Set(), failFast: false });
