import * as astnodes from "../src/ast/astnodes.ts";
import { pyFloat, pyInt, pyTrue, pyFalse, pyNone, pyStr } from "../src/mock_types/constants.ts";
import { dump } from "../support/ast_dump.ts";
import { getPyAstDump } from "../support/py_ast_dump.ts";
// replace with assertEquals when string comparison is better.
import { assertEqualsString } from "../support/diff.ts";
import { runTests } from "./run_tests_helper.ts";

const unEscape = { n: "\n", r: "\r", t: "\t", "\\": "\\", "'": "'", '"': '"' };

/** helper function to generate an ast tree that can be converted in typescript - you'll need to add in missing null values */
async function convertToTs(content: string): Promise<string> {
    let pyAstDump = await getPyAstDump(content, { indent: 4, include_attributes: true, js: true });
    pyAstDump = pyAstDump
        .replace(/^(\s+)([a-z_]+=)/gm, (_m, m1, m2) => m1 + " ".repeat(m2.length))
        .replace(/^(\s*)([A-Za-z_]+)/gm, (_m, m1, m2) => {
            if (m2 === "null") {
                return m1 + m2;
            } else if (m2 === "None" || m2 === "True" || m2 === "False") {
                return m1 + "py" + m2;
            }
            if (m2 === "arguments") {
                m2 += "_";
            }
            return `${m1} typeof astnodes.${m2} === "number" ? astnodes.${m2} : new astnodes.${m2}`;
        })
        .replace(
            /new astnodes.Constant\(\n(\s+\-?[0-9](?:e[\-0-9]+))/g,
            (_m, m1) => `new astnodes.Constant(\nnew pyFloat(${m1})`
        )
        .replace(
            /new astnodes.Constant\(\n(\s+\-?[0-9]+\.[0-9]+(?:e[\-0-9]+)?)/g,
            (_m, m1) => `new astnodes.Constant(\nnew pyFloat(${m1})`
        )
        // use bigint for dumping
        .replace(/new astnodes.Constant\(\n(\s+\-?[0-9]+)/g, (_m, m1) => `new astnodes.Constant(\nnew pyInt(${m1}n)`)
        .replace(/new astnodes.Constant\(\n(\s+['"].*(['"]))/g, (_m, m1: string, quote: string) => {
            // the inverse of the pyStr.toString() method
            const toUnescape = new RegExp(`\\\\([\\n\\r\\\\\t${quote}])`, "g");
            m1 = m1.replace(toUnescape, (_m, m1) => unEscape[m1 as keyof typeof unEscape]);
            return `new astnodes.Constant(\nnew pyStr(${m1})`;
        });
    // we might also need to make id a string constant or maybe just make pyStr a js string
    return pyAstDump;
}

/** a helper function for debugging a failing file */
async function _convertFileToTs(fileName: string) {
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

const files: string[] = JSON.parse(Deno.env.get("_TESTFILES") || "[]");

await runTests(doTest, { files, skip: new Set(), failFast: false });
