import { dump } from "../support/ast_dump.ts";
import { getPyAstDump } from "../support/py_ast_dump.ts";
// replace with assertEquals when string comparison is better.
import { assertEqualsString } from "../support/diff.ts";
import { runParserFromString } from "../src/parser/mod.ts";
import { runTests } from "./run_tests_helper.ts";

// deno-lint-ignore camelcase
const options = { indent: 2, include_attributes: true };

async function doTest(source: string) {
    const pyDump = getPyAstDump(source, options);
    const jsAST = runParserFromString(source);
    const jsDump = jsAST === null ? "null" : dump(jsAST, options);
    assertEqualsString(jsDump, pyDump);
}

const files: string[] = JSON.parse(Deno.env.get("_TESTFILES") || "[]");

// t542.py uses unicode characters which have different bytes offsets compared with
// skulpt parser which uses javascript string offsets
await runTests(doTest, { files, skip: new Set(["t542.py"]), failFast: false });
