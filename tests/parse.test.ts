import { dump } from "../src/ast/dump.ts";
import { getPyAstDump } from "../support/py_ast_dump.ts";
// replace with assertEquals when string comparison is better.
import { assertEqualsString } from "../support/diff.ts";
import { runParserFromString } from "../src/parser/parse.ts";
import { runTests } from "./run_tests_helper.ts";

const options = { indent: 2, include_attributes: true };

async function doTest(source: string) {
    const pyDump = await getPyAstDump(source, options);
    const jsAST = runParserFromString(source);
    const jsDump = jsAST === null ? "null" : dump(jsAST, options);
    assertEqualsString(jsDump, pyDump);
}

/* for debugging */
// const tmp = "t004.py";
// const files = [tmp];

const files: string[] = [];

await runTests(doTest, { files, skip: new Set(), failFast: false });
