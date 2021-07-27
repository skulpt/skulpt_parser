import { astOptimize } from "../src/ast/optimize.ts";
import { ModeStr, runParserFromString } from "../src/parser/mod.ts";
import { dump } from "../support/ast_dump.ts";
import { assertEqualsString } from "../support/diff.ts";

const options = { indent: null };
// const mode = "eval";
function checkOptimize(a: string, b: string, mode: ModeStr = "eval") {
    const dumpA = dump(astOptimize(runParserFromString(a, mode)), options);
    const dumpB = dump(astOptimize(runParserFromString(b, mode)), options);
    assertEqualsString(dumpA, dumpB);
}

function checkDontOptimize(a: string, expected?: string, mode: ModeStr = "eval") {
    const dumpA = dump(astOptimize(runParserFromString(a, mode)), options);
    const dumpB = expected ?? dump(runParserFromString(a, mode), options);
    assertEqualsString(dumpA, dumpB);
}

// tests adapted from
// https://github.com/vstinner/fatoptimizer/blob/master/test_fatoptimizer.py#L1980

/**** ConstantFoldingBinOpTests ****/
Deno.test("test_basic", () => {
    checkOptimize("1 + 1", "2");
});

Deno.test("test_not_constant", () => {
    checkDontOptimize("x + 1");
    checkDontOptimize("1 + x");
});

Deno.test("test_shift_error", () => {
    checkOptimize("2 << 53", "18014398509481984");
    checkDontOptimize(
        "1 << -3",
        `Expression(body=BinOp(left=Constant(value=1), op=LShift(), right=Constant(value=-3)))`
    );
    checkDontOptimize(
        "1 >> -3",
        `Expression(body=BinOp(left=Constant(value=1), op=RShift(), right=Constant(value=-3)))`
    );
});
Deno.test("test_float_binopts", () => {
    checkDontOptimize("1.0 << 2");
    checkDontOptimize("1.0 >> 2");
    checkDontOptimize("1.0 & 2");
    checkDontOptimize("1.0 | 2");
    checkDontOptimize("1.0 ^ 2");
});
Deno.test("test_complex_binopts", () => {
    checkDontOptimize("1.0j ** 2");
    checkDontOptimize("1.0j // 2");
    checkDontOptimize("1.0j % 2");
    checkDontOptimize("1.0j << 2");
    checkDontOptimize("1.0j >> 2");
    checkDontOptimize("1.0j & 2");
    checkDontOptimize("1.0j | 2");
    checkDontOptimize("1.0j ^ 2");
});
Deno.test("test_division_by_zero", () => {
    checkDontOptimize("1 // 0");
    checkDontOptimize("1.0 // 0.0");

    checkDontOptimize("1 / 0");
    checkDontOptimize("1.0 / 0.0");
    checkDontOptimize("1.0j / 0.0j");
});
Deno.test("test_formatting", () => {
    checkDontOptimize("b'hello %s' % b'world'");
    checkDontOptimize("'hello %s' % 'world'");
});
Deno.test("test_add", () => {
    checkOptimize("2 + 3", "5");
    checkOptimize("2.0 + 3.0", "5.0");
    checkOptimize("2.0j + 3.0j", "5.0j");
    checkOptimize("(1, 2) + (3,)", "(1, 2, 3)");

    // self.config.max_str_len = 2
    checkOptimize("'a' + 'b'", "'ab'");
    checkOptimize("'a' + 'bc'", "'abc'");

    // self.config.max_bytes_len = 2
    checkOptimize("b'a' + b'b'", "b'ab'");
    checkOptimize("b'a' + b'bc'", "b'abc'");
});
Deno.test("test_sub", () => {
    checkOptimize("3 - 2", "1");
    checkOptimize("3.0 - 2.0", "1.0");
    checkOptimize("3.0j - 2.0j", "1.0j");
});
Deno.test("test_mul", () => {
    checkOptimize("2 * 3", "6");
    checkOptimize("2.0 * 3.0", "6.0");
    checkOptimize("2.0j * 3.0", "6j");

    checkOptimize("'a' * 3", "'aaa'");
    checkOptimize("b'x' * 3", "b'xxx'");
    checkOptimize("(1, 2) * 2", "(1, 2, 1, 2)");

    checkOptimize("3 * 'a'", "'aaa'");
    checkOptimize("3 * b'x'", "b'xxx'");
    checkOptimize("2 * (1, 2)", "(1, 2, 1, 2)");
    // too big
    checkDontOptimize(`'${"a".repeat(2000)}' * 5`);
    checkDontOptimize(
        "500 * (1, 2)",
        "Expression(body=BinOp(left=Constant(value=500), op=Mult(), right=Constant(value=(1, 2))))"
    );
});
Deno.test("test_floor_div", () => {
    checkOptimize("10 // 3", "3");
    checkOptimize("10.0 // 3.0", "3.0");
});
Deno.test("test_div", () => {
    checkOptimize("5 / 2", "2.5");
    checkOptimize("5.0 / 2.0", "2.5");
    /** @todo */
    // checkOptimize("5.0j / 2.0", "2.5j");
});
Deno.test("test_mod", () => {
    checkOptimize("5 % 2", "1");
    /** @todo */
    // checkOptimize("5.0 % 2.0", "1.0");
});
Deno.test("test_pow", () => {
    checkOptimize("2 ** 3", "8");
    checkOptimize("2.0 ** 3.0", "8.0");

    // # complex
    checkDontOptimize("2.0j ** 3.0");
    checkDontOptimize("2.0 ** 3.0j");

    // # 0 ** -1
    checkDontOptimize("0 ** -1", "Expression(body=BinOp(left=Constant(value=0), op=Pow(), right=Constant(value=-1)))");
    //  ast.BinOp(left=ast.Num(n=0), op=ast.Pow(), right=ast.Num(-1)))
    checkDontOptimize(
        "0.0 ** -1",
        "Expression(body=BinOp(left=Constant(value=0.0), op=Pow(), right=Constant(value=-1)))"
    );
    //  ast.BinOp(left=ast.Num(n=0.0), op=ast.Pow(), right=ast.Num(-1)))
});

Deno.test("test_pow_max_int_bits", () => {
    // self.config.max_int_bits = 16
    checkOptimize("2 ** 15", "32768");
    checkDontOptimize("2 ** 130");

    // self.config.max_int_bits = 17
    checkOptimize("2 ** 15", "32768");
});
Deno.test("test_shift", () => {
    checkOptimize("1 << 3", "8");
    checkOptimize("16 >> 2", "4");
});

Deno.test("test_bits", () => {
    checkOptimize("3 & 1", "1");
    checkOptimize("1 | 2", "3");
    checkOptimize("3 ^ 3", "0");
    checkOptimize("True ^ True", "False");
    checkOptimize("True | True", "True");
    checkOptimize("True & False", "False");
});

/*** BoolOp ****/
Deno.test("test_boolop", () => {
    checkOptimize("1 and 2 and 3 and 4", "4");
    checkOptimize("1 or 2 or 3 or 0", "1");
    checkOptimize("1 and 0 and 2 and 3 and 4", "0");
    checkOptimize("None or None or None", "None");
    checkOptimize("1 and 2 and 3 or 2 or x or 5", "3");
    checkOptimize("1 and 2 and 3 or 2 or 6 or 5", "3");
    checkOptimize("'a' and True and x", "x");
    checkOptimize("'a' and True and x", "x");
});

/**** UnaryOp ****/

Deno.test("test_not_constant", () => {
    checkDontOptimize("-x");
    checkDontOptimize("+x");
    checkDontOptimize("~x");
    checkDontOptimize("not x");
});
Deno.test("test_uadd", () => {
    checkOptimize("+3", "3");
    checkOptimize("+3.0", "3.0");
    checkOptimize("+3.0j", "3.0j");
    checkDontOptimize("+'abc'");
});
Deno.test("test_usub", () => {
    // checkOptimize("-3", ast.Num(n=-3))
    // checkOptimize("-3.0", ast.Num(n=-3.0))
    // checkOptimize("-3.0j", ast.Num(n=-3.0j))
    checkDontOptimize("-'abc'");
});
Deno.test("test_invert", () => {
    checkOptimize("~3", "-4");
    checkDontOptimize("~3.0");
    checkDontOptimize("~3.0j");
    checkDontOptimize("~'abc'");
});
Deno.test("test_not", () => {
    checkOptimize("not 0", "True");
    checkOptimize("not ''", "True");
    checkOptimize("not 3", "False");
    checkOptimize("not 3.0", "False");
    checkOptimize("not 3.0j", "False");
    // checkDontOptimize("not 'abc'");
    checkOptimize("not 'abc'", "False");
});
Deno.test("test_not_compare", () => {
    checkOptimize("not(x is y)", "x is not y");
    checkOptimize("not(x is not y)", "x is y");

    checkOptimize("not(x in y)", "x not in y");
    checkOptimize("not(x not in y)", "x in y");

    checkDontOptimize("not(x < y)");
    checkDontOptimize("not(x <= y)");
    checkDontOptimize("not(x > y)");
    checkDontOptimize("not(x >= y)");

    checkDontOptimize("not(x == y)");
    checkDontOptimize("not(x != y)");

    checkDontOptimize("not(x < y < y)");
});

Deno.test("test_not_constant", () => {
    checkDontOptimize("x[k]");
    checkDontOptimize("'abc'[k]");
    checkDontOptimize("x[0]");
    checkDontOptimize("x[0:stop]");
    checkDontOptimize("x[start:10]");
    checkDontOptimize("x[:10]");
});
Deno.test("test_subscript_index", () => {
    checkOptimize("'abc'[0]", "'a'");
    checkOptimize("'abc'[-2]", "'b'");
    // checkOptimize("'abcde'[::2]", "'ace'");

    checkOptimize("b'ABC'[0]", "65");
    checkOptimize("(10, 20, 30, 40)[-1]", "40");

    // # list
    // checkOptimize("[10, 20, 30][0]", "10")

    // # dict with int and str keys
    // checkOptimize("{9: 'x', 3: 'y'}[9]", "'x'")
    // checkOptimize("{'x': 9, 'y': 3}['x']", "9")

    // # don't optimize
    checkDontOptimize("2[1]");
    checkDontOptimize("'abc'[1.0]");
    // checkDontOptimize("{10, 20, 30}[1]")
    // checkDontOptimize("{1: 2, 3: 4}[['x']]")  //# list key
    // checkDontOptimize("{1: 2}[8]")  //# KeyError
});

Deno.test("test_subscript_slice", () => {
    // checkOptimize("'abc'[:2]", "'ab'");
    // checkOptimize("'abc'[-2:]", "'bc'");
    // checkOptimize("b'ABC'[:2]", "b'AB'");
    // checkOptimize("(10, 20, 30, 40)[:2]", "(10, 20)");

    // # list
    // checkOptimize("[10, 20, 30][:2]", "[10, 20]")

    // # wrong types
    checkDontOptimize("'abc'[1.0:]");
    checkDontOptimize("'abc'[:2.0]");
    checkDontOptimize("'abc'[::3.0]");
    checkDontOptimize("{10, 20, 30}[:2]");
    checkDontOptimize("{1:2, 3:4}[:2]");
});

// ConstantFoldingCompareTests
// Deno.test("test_not_constant", () => {
//     checkDontOptimize("a in b")
//     checkDontOptimize("'x' in b")
//     checkDontOptimize("a in 'xyz'")

//     checkDontOptimize("a < b")
//     checkDontOptimize("'x' < b")
//     checkDontOptimize("a < 'xyz'")

// });

// Deno.test("test_contains_type_error", () => {
//     checkDontOptimize("1 in 'abc'")
//     checkDontOptimize("'x' in 2")
//     checkDontOptimize("b'bytes' in 'unicode'")
//     checkDontOptimize("'unicode' in b'bytes'")

// });

// Deno.test("test_contains", () => {
//     // # str
//     checkOptimize("'a' in 'abc'", "True")
//     checkOptimize("'a' not in 'abc'", "False")

//     // # bytes
//     checkOptimize("65 in b'ABC'", "True")

//     // # tuple
//     checkOptimize("2 in (1, 2, 3)", "True")
//     checkOptimize("2 not in (1, 2, 3)", "False")

//     // # list
//     checkOptimize("2 in [1, 2, 3]", "True")

//     // # set
//     checkOptimize("2 in {1, 2, 3}", "True")

// });

// Deno.test("test_compare", () => {
//     checkOptimize("1 < 2", "True")
//     checkOptimize("1 <= 2", "True")
//     checkOptimize("1 == 2", "False")
//     checkOptimize("1 != 2", "True")
//     checkOptimize("1 > 2", "False")
//     checkOptimize("1 >= 2", "False")

//     // # comparison between bytes and str can raise BytesWarning depending
//     // # on runtime option
//     checkDontOptimize('"x" == b"x"')
//     checkDontOptimize('b"x" == "x"')
//     checkDontOptimize('"x" != b"x"')
//     checkDontOptimize('b"x" != "x"')

//     // # bytes < str raises TypeError
//     checkDontOptimize('b"bytes" < "str"')

// });
// Deno.test("test_is", () => {
//     checkOptimize("None is None", "True")

// });
// Deno.test("test_contains_to_const", () => {
//     // # list => tuple
//     checkOptimize("x in [1, 2]", "x in (1, 2)")

//     // # set => frozenset
//     // const = ast.Constant(value=frozenset({1, 2}))
//     // node = ast.Compare(left=ast.Name(id='x', ctx=ast.Load()),
//     //                    ops=[ast.In()],
//     //                    comparators=[const])
//     checkOptimize("x in {1, 2}", node)

//     // # [] is not a constant: don't optimize
//     checkDontOptimize("x in [1, [], 2]")
//     checkDontOptimize("x in {1, [], 2}")

// });

Deno.test("test_if", () => {
    checkOptimize(
        `
if test:
    x = 1 + 1
else:
    x = 2 + 2
`,
        `
if test:
    x = 2
else:
    x = 4
`,
        "exec"
    );
});
Deno.test("test_for", () => {
    checkOptimize(
        `
for i in range(5):
    i += 1 + 1
`,
        `
for i in range(5):
    i += 2
    `,
        "exec"
    );
});
Deno.test("test_while", () => {
    checkOptimize(
        `
x = 0
while x < 2:
    x += 1 +1
    `,
        `
x = 0
while x < 2:
    x += 2
    `,
        "exec"
    );
});
Deno.test("test_try", () => {
    checkOptimize(
        `
try:
    x = 1 + 1
except:
    x = 2 + 2
else:
    x = 3 + 3
finally:
    x = 4 + 4
    `,
        `
try:
    x = 2
except:
    x = 4
else:
    x = 6
finally:
    x = 8
    `,
        "exec"
    );
});
Deno.test("test_FunctionDef", () => {
    checkOptimize(
        `
x = 1
def func():
    return 2 + 3 + x
`,
        `
x = 1
def func():
    return 5 + x
`,
        "exec"
    );

    // @need_python35
});
Deno.test("test_AsyncFunctionDef", () => {
    checkOptimize(
        `
x = 1
async def func():
    return 2 + 3 + x
`,
        `
x = 1
async def func():
    return 5 + x
`,
        "exec"
    );
});
Deno.test("test_ClassDef", () => {
    checkOptimize(
        `
x = 1
class MyClass:
    y = 2 + 3 + x
`,
        `
x = 1
class MyClass:
    y = 5 + x
`,
        "exec"
    );
});
Deno.test("test_DictComp", () => {
    checkOptimize(
        `
x = 1
y = {k: 2 + 3 + x for k in "abc"}
`,
        `
x = 1
y = {k: 5 + x for k in "abc"}
`,
        "exec"
    );
});
Deno.test("test_ListComp", () => {
    checkOptimize(
        `
x = 1
y = [2 + 3 + x for k in "abc"]
`,
        `
x = 1
y = [5 + x for k in "abc"]
`,
        "exec"
    );
});
Deno.test("test_SetComp", () => {
    checkOptimize(
        `
x = 1
y = {2 + 3 + x for k in "abc"}
`,
        `
x = 1
y = {5 + x for k in "abc"}
`,
        "exec"
    );
});
Deno.test("test_GeneratorExp", () => {
    checkOptimize(
        `
x = 1
y = (2 + 3 + x for k in "abc")
`,
        `
x = 1
y = (5 + x for k in "abc")
`,
        "exec"
    );
});
Deno.test("test_Lambda", () => {
    checkOptimize(
        `
x = 1
y = lambda: 2 + 3 + x
`,
        `
x = 1
y = lambda: 5 + x
`,
        "exec"
    );
});
