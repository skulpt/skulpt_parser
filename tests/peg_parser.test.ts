// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT
// deno-lint-ignore-file no-explicit-any

import { assertEquals, fail, assertInstanceOf } from "../deps.ts";
import { python } from "../deps.ts";
import { astFromString, ModeStr } from "../src/parser/mod.ts";
import { dump } from "../support/ast_dump.ts";
import { pySyntaxError } from "../src/mock_types/errors.ts";

const sys = python.import("sys");
const [_major, minor, _micro] = sys.version_info;
// console.log(_major, minor, micro)

const ast = python.import("ast");
let peg_parse: any;
if (minor >= 10) {
    peg_parse = ast.parse;
} else {
    const peg_parser = python.import("_peg_parser");
    peg_parse = peg_parser.parse_string;
}

function* zipToString<T>(...iterables: Array<Iterable<T>>): Generator<Array<string>> {
    const iterators = iterables.map((iterable) => iterable[Symbol.iterator]());

    while (true) {
        const values: string[] = [];
        for (const iterator of iterators) {
            const { done, value } = iterator.next();
            if (done) return;
            values.push(String(value));
        }
        yield values;
    }
}

sys.path.append(import.meta.resolve("../tests").replace("file://", ""));
const test_peg_parser = python.import("test_peg_parser");
const TEST_IDS = test_peg_parser.TEST_IDS as string[];
const TEST_SOURCES = test_peg_parser.TEST_SOURCES as string[];
// TEST_IDS, TEST_SOURCES = prepare_test_cases(TEST_CASES)
const GOOD_BUT_FAIL_TEST_IDS = test_peg_parser.GOOD_BUT_FAIL_TEST_IDS as string[];
const GOOD_BUT_FAIL_SOURCES = test_peg_parser.GOOD_BUT_FAIL_SOURCES as string[];
const FAIL_TEST_IDS = test_peg_parser.FAIL_TEST_IDS as string[];
const FAIL_SOURCES = test_peg_parser.FAIL_SOURCES as string[];
const EXPRESSIONS_TEST_IDS = test_peg_parser.EXPRESSIONS_TEST_IDS as string[];
const EXPRESSIONS_TEST_SOURCES = test_peg_parser.EXPRESSIONS_TEST_SOURCES as string[];
const FSTRING_TEST_IDS = test_peg_parser.FSTRING_TEST_IDS as string[];
const FSTRING_TEST_SOURCES = test_peg_parser.FSTRING_TEST_SOURCES as string[];

function testCorrect(ids: string[], sources: string[], mode: ModeStr = "exec") {
    for (const [name, source] of zipToString(ids, sources)) {
        const expected_ast = peg_parse(source, python.kw`mode=${mode}`);
        const expected_ast_dump = ast.dump(
            expected_ast,
            python.kw`indent=${2}`,
            python.kw`include_attributes=${false}`
        );
        const skAst = astFromString(source, mode);
        const skDumped = dump(skAst, { indent: 2, include_attributes: false });
        Deno.test({
            name,
            fn() {
                assertEquals(skDumped, String(expected_ast_dump));
            },
        });
    }
}

const syntaxError =
    /(?:"|')(?<msg>.*?)(?:"|'),\s*\('(?<filename>.*?)',\s*(?<lineno>\d+),\s*(?<offset>\d+),\s*(?:"|')(?<text>.*?)(?:"|')\)/;

function parseSyntaxError(syntaxRepr: string) {
    const result = syntaxRepr.match(syntaxError)?.groups;
    if (!result) {
        return undefined;
    }
    const { msg, filename, lineno, offset, text } = result;
    return new pySyntaxError(msg, [filename, Number(lineno), Number(offset), text.replace("\\n", "\n")]);
}

function testIncorrect(ids: string[], sources: string[]) {
    for (const [name, source] of zipToString(ids, sources)) {
        let expectedError: pySyntaxError | undefined;
        try {
            peg_parse(source);
        } catch (e) {
            expectedError = parseSyntaxError(e.message);
        }
        if (!expectedError) {
            // e.g. import_non_ascii_syntax_error
            continue;
        }
        Deno.test({
            name,
            fn() {
                try {
                    astFromString(source);
                    fail("didn't throw");
                } catch (e) {
                    assertInstanceOf(e, pySyntaxError);
                    if (e.message != "invalid syntax") {
                        // tokenizer isn't great here
                        assertEquals(e.message, expectedError?.message);
                    }

                    assertEquals(e.traceback[0], expectedError?.traceback[0]);
                    assertEquals(e.traceback[1], expectedError?.traceback[1]);
                    /** @todo match offset */
                    // assertEquals(e.traceback[2], expectedError?.traceback[2]);
                    assertEquals(e.traceback[3], expectedError?.traceback[3]);
                }
            },
        });
    }
}

testCorrect(TEST_IDS, TEST_SOURCES);
testCorrect(GOOD_BUT_FAIL_TEST_IDS, GOOD_BUT_FAIL_SOURCES);
testCorrect(EXPRESSIONS_TEST_IDS, EXPRESSIONS_TEST_SOURCES, "eval");
testIncorrect(FAIL_TEST_IDS, FAIL_SOURCES);
testIncorrect(FSTRING_TEST_IDS, FSTRING_TEST_SOURCES);
