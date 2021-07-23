import { dump } from "../support/symtable_dump.ts";
import { getPySymTableDump } from "../support/py_symtable_dump.ts";
import { buildSymbolTable, SymbolTableScope } from "../src/symtable/mod.ts";

import { runParserFromString } from "../src/parser/parse.ts";
import { runTests } from "./run_tests_helper.ts";
import { assert, assertEquals, assertThrows } from "https://deno.land/std@0.99.0/testing/asserts.ts";

async function doTest(source: string) {
    const pyDump = await getPySymTableDump(source);
    const jsAST = runParserFromString(source);
    const symtable = dump(buildSymbolTable(jsAST));

    assertEquals(symtable, JSON.parse(pyDump));
}

const files: string[] = JSON.parse(Deno.env.get("_TESTFILES") || "[]");

await runTests(doTest, { files, skip: new Set(), failFast: false });

const TEST_CODE = `
import sys

glob = 42
some_var = 12
some_non_assigned_global_var = 11
some_assigned_global_var = 11

class Mine:
    instance_var = 24
    def a_method(p1, p2):
        pass

def spam(a, b, *var, **kw):
    global bar
    global some_assigned_global_var
    some_assigned_global_var = 12
    bar = 47
    some_var = 10
    x = 23
    glob
    def internal():
        return x
    def other_internal():
        nonlocal some_var
        some_var = 3
        return some_var
    return internal

def foo():
    pass

def namespace_test(): pass
def namespace_test(): pass
`;

function findBlock(block: SymbolTableScope | null, name: string): SymbolTableScope {
    assert(block);
    for (const ch of block.get_children()) {
        if (ch.get_name() === name) {
            return ch;
        }
    }

    throw Error("block not found!");
}

const table = buildSymbolTable(runParserFromString(TEST_CODE), "?", "exec");
const top = table.top!;
// These correspond to scopes in TEST_CODE
const Mine = findBlock(top, "Mine");
const a_method = findBlock(Mine, "a_method");
const spam = findBlock(top, "spam");
const internal = findBlock(spam, "internal");
const other_internal = findBlock(spam, "other_internal");
const foo = findBlock(top, "foo");

Deno.test("test_type", () => {
    assertEquals(top.get_type(), "module");
    assertEquals(Mine.get_type(), "class");
    assertEquals(a_method.get_type(), "function");
    assertEquals(spam.get_type(), "function");
    assertEquals(internal.get_type(), "function");
});

Deno.test("test_nested", () => {
    assert(!top.is_nested());
    assert(!Mine.is_nested());
    assert(!spam.is_nested());
    assert(internal.is_nested());
});

Deno.test("test_children", () => {
    assert(top.has_children());
    assert(Mine.has_children());
    assert(!foo.has_children());
});

Deno.test("test_lineno", () => {
    assertEquals(top.get_lineno(), 0);
    assertEquals(spam.get_lineno(), 14);
});

Deno.test("test_function_info", () => {
    const func = spam;
    assertEquals(func.get_parameters().sort(), ["a", "b", "kw", "var"]);
    const expected = ["a", "b", "internal", "kw", "other_internal", "some_var", "var", "x"];
    assertEquals(func.get_locals().sort(), expected);
    assertEquals(func.get_globals().sort(), ["bar", "glob", "some_assigned_global_var"]);
    assertEquals(internal.get_frees(), ["x"]);
});

Deno.test("test_globals", () => {
    assert(spam.lookup("glob").is_global());
    assert(!spam.lookup("glob").is_declared_global());
    assert(spam.lookup("bar").is_global());
    assert(spam.lookup("bar").is_declared_global());
    assert(!internal.lookup("x").is_global());
    assert(!Mine.lookup("instance_var").is_global());
    assert(spam.lookup("bar").is_global());
    // Module-scope globals are both global and local
    assert(top.lookup("some_non_assigned_global_var").is_global());
    assert(top.lookup("some_assigned_global_var").is_global());
});

Deno.test("test_nonlocal", () => {
    assert(!spam.lookup("some_var").is_nonlocal());
    assert(other_internal.lookup("some_var").is_nonlocal());
    const expected = ["some_var"];
    assertEquals(other_internal.get_nonlocals(), expected);
});

Deno.test("test_local", () => {
    assert(spam.lookup("x").is_local());
    assert(!spam.lookup("bar").is_local());
    // Module-scope globals are both global and local
    assert(top.lookup("some_non_assigned_global_var").is_local());
    assert(top.lookup("some_assigned_global_var").is_local());
});

Deno.test("test_free", () => {
    assert(internal.lookup("x").is_free());
});

Deno.test("test_referenced", () => {
    assert(internal.lookup("x").is_referenced());
    assert(spam.lookup("internal").is_referenced());
    assert(!spam.lookup("x").is_referenced());
});

Deno.test("test_parameters", () => {
    for (const sym of ["a", "var", "kw"]) {
        assert(spam.lookup(sym).is_parameter());
    }
    assert(!spam.lookup("x").is_parameter());
});

Deno.test("test_symbol_lookup", () => {
    assertEquals(top.get_identifiers().length, top.get_symbols().length);
    assertThrows(() => top.lookup("not_here"));
});

Deno.test("test_namespaces", () => {
    assert(top.lookup("Mine").is_namespace());
    assert(Mine.lookup("a_method").is_namespace());
    assert(top.lookup("spam").is_namespace());
    assert(spam.lookup("internal").is_namespace());
    assert(top.lookup("namespace_test").is_namespace());
    assert(!spam.lookup("x").is_namespace());

    assert(top.lookup("spam").get_namespace() === spam);
    const ns_test = top.lookup("namespace_test");
    assertEquals(ns_test.get_namespaces()?.length, 2);
    assertThrows(() => ns_test.get_namespace());

    const ns_test_2 = top.lookup("glob");
    assertEquals(ns_test_2.get_namespaces()?.length, 0);
    assertThrows(() => ns_test_2.get_namespace());
});

Deno.test("test_assigned", () => {
    assert(spam.lookup("x").is_assigned());
    assert(spam.lookup("bar").is_assigned());
    assert(top.lookup("spam").is_assigned());
    assert(Mine.lookup("a_method").is_assigned());
    assert(!internal.lookup("x").is_assigned());
});

Deno.test("test_annotated", () => {
    const st1 = buildSymbolTable(runParserFromString("def f():\n    x: int\n"), "test", "exec").top!;
    const st2 = st1.get_children()[0];
    assert(st2.lookup("x").is_local());
    assert(st2.lookup("x").is_annotated());
    assert(!st2.lookup("x").is_global());
    const st3 = buildSymbolTable(runParserFromString("def f():\n    x = 1\n"), "test", "exec").top!;
    const st4 = st3.get_children()[0];
    assert(st4.lookup("x").is_local());
    assert(!st4.lookup("x").is_annotated());

    // Test that annotations in the global scope are valid after the
    // variable is declared as nonlocal.
    const st5 = buildSymbolTable(runParserFromString("global x\nx: int"), "test", "exec").top!;
    assert(st5.lookup("x").is_global());

    // Test that annotations for nonlocals are valid after the
    // variable is declared as nonlocal.
    const st6 = buildSymbolTable(
        runParserFromString("def g():\n" + "    x = 2\n" + "    def f():\n" + "        nonlocal x\n" + "    x: int"),
        "test",
        "exec"
    );
});

Deno.test("test_imported", () => {
    assert(top.lookup("sys").is_imported());
});

Deno.test("test_name", () => {
    assertEquals(top.get_name(), "top");
    assertEquals(spam.get_name(), "spam");
    assertEquals(spam.lookup("x").get_name(), "x");
    assertEquals(Mine.get_name(), "Mine");
});

Deno.test("test_class_info", () => {
    assertEquals(Mine.get_methods(), ["a_method"]);
});

Deno.test("test_filename_correct", () => {
    // Bug tickler: SyntaxError file name correct whether error raised
    // while parsing or building symbol table.
    function checkfilename(brokencode: string, offset: number) {
        try {
            buildSymbolTable(runParserFromString(brokencode, "exec", "spam"), "spam", "exec");
        } catch (e) {
            assertEquals(e.traceback[0], "spam");
            assertEquals(e.traceback[1], 1);
            assertEquals(e.traceback[2], offset);
            return;
        }

        assert(false, "no SyntaxError for '" + brokencode + "'");
    }
    checkfilename("def f(x): foo)(", 14); // parse-time
    checkfilename("def f(x): global x", 11); // symtable-build-time
    // symtable.symtable("pass", b"spam", "exec")
    // with assertWarns(DeprecationWarning), \
    //         assertRaises(TypeError):
    //     symtable.symtable("pass", bytearray(b"spam"), "exec")
    // with assertWarns(DeprecationWarning):
    //     symtable.symtable("pass", memoryview(b"spam"), "exec")
    // with assertRaises(TypeError):
    //     symtable.symtable("pass", list(b"spam"), "exec")
});

// Deno.test("test_eval", () => {
//     const symbols = symtable.symtable("42", "?", "eval")
// });

// Deno.test("test_single", () => {
//     symbols = symtable.symtable("42", "?", "single")
// });

// Deno.test("test_exec", () => {
//     symbols = symtable.symtable("def f(x): return x", "?", "exec")
// });

// Deno.test("test_bytes", () => {
//     top = symtable.symtable(TEST_CODE.encode('utf8'), "?", "exec")
//     assertIsNotNone(find_block(top, "Mine"))

//     code = b'# -*- coding: iso8859-15 -*-\nclass \xb4: pass\n'

//     top = symtable.symtable(code, "?", "exec")
//     assertIsNotNone(find_block(top, "\u017d"))
// });

// Deno.test("test_symtable_repr", () => {
//     assertEquals(str(top), "<SymbolTable for module ?>")
//     assertEquals(str(spam), "<Function SymbolTable for spam in ?>")
// });
