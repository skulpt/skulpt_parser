import * as astnodes from "../src/ast/astnodes.ts";
import { dump } from "../src/ast/ast.ts";
import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";

/** Simple name and function, compact form, but not configurable */
async function getPyAstDump(content: string, indent: number | null = 4, attrs = false): Promise<string> {
    const cmd = Deno.run({
        cmd: [
            "python3",
            "tests/ast_dumper_helper.py",
            content,
            `--indent=${indent === null ? -1 : indent}`,
            attrs ? "--attrs=1" : "--attrs=0",
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
        throw new Error(errorStr);
    }

    return outStr;
}

/** helper function to generate an ast tree that can be converted in typescript - you'll need to add in missing null values */
async function convertToTs(content: string): Promise<void> {
    let py_ast_dump = await getPyAstDump(content, 4, true);
    py_ast_dump = py_ast_dump
        .replace(/^(\s+)([a-z_]+=)/gm, (m, m1, m2) => m1 + " ".repeat(m2.length))
        .replace(/^(\s*)([A-Za-z_]+)/gm, (m, m1, m2) => m1 + "new astnodes." + m2);
    console.log(py_ast_dump);
}

async function doTest(source: string, mod: astnodes.Module) {
    for (let indent of [null, 0, 2, 4]) {
        const py_ast_dump = await getPyAstDump(source, indent);
        assertEquals(py_ast_dump, dump(mod, indent) + "\n");
    }
}

Deno.test("#1: t001.py print('hello world')", async () => {
    const mod = new astnodes.Module(
        [
            new astnodes.Expr(
                new astnodes.Call(
                    new astnodes.Name("print", new astnodes.Load(), 1, 0, 1, 5),
                    [new astnodes.Constant("hello world", null, 1, 6, 1, 19)],
                    [],
                    1,
                    0,
                    1,
                    20
                ),
                1,
                0,
                1,
                20
            ),
        ],
        []
    );
    await doTest("print('hello world')", mod);
});

Deno.test("#2: t002py a = 3", async () => {
    const mod = new astnodes.Module(
        [
            new astnodes.Assign(
                [new astnodes.Name("a", new astnodes.Store(), 1, 0, 1, 1)],
                new astnodes.Constant(3, null, 1, 4, 1, 5),
                null,
                1,
                0,
                1,
                5
            ),
        ],
        []
    );
    await doTest("a = 3", mod);
});

Deno.test("#3: t003.py 2 + 3", async () => {
    const mod = new astnodes.Module(
        [
            new astnodes.Expr(
                new astnodes.BinOp(
                    new astnodes.Constant(2, null, 1, 0, 1, 1),
                    new astnodes.Add(),
                    new astnodes.Constant(3, null, 1, 4, 1, 5),
                    1,
                    0,
                    1,
                    5
                ),
                1,
                0,
                1,
                5
            ),
        ],
        []
    );
    await doTest("2 + 3", mod);
});

Deno.test("#4: t014.py def test(x, y): return x + y ", async () => {
    const mod = new astnodes.Module(
        [
            new astnodes.FunctionDef(
                "test",
                new astnodes.arguments_(
                    [],
                    [new astnodes.arg("x", null, null, 2, 9, 2, 10), new astnodes.arg("y", null, null, 2, 12, 2, 13)],
                    null,
                    [],
                    [],
                    null,
                    []
                ),
                [
                    new astnodes.Return(
                        new astnodes.BinOp(
                            new astnodes.Name("x", new astnodes.Load(), 3, 11, 3, 12),
                            new astnodes.Add(),
                            new astnodes.Name("y", new astnodes.Load(), 3, 15, 3, 16),
                            3,
                            11,
                            3,
                            16
                        ),
                        3,
                        4,
                        3,
                        16
                    ),
                ],
                [],
                null,
                null,
                2,
                0,
                3,
                16
            ),
            new astnodes.Assign(
                [new astnodes.Name("r", new astnodes.Store(), 6, 0, 6, 1)],
                new astnodes.Call(
                    new astnodes.Name("test", new astnodes.Load(), 6, 4, 6, 8),
                    [new astnodes.Constant(3, null, 6, 9, 6, 10), new astnodes.Constant(5, null, 6, 12, 6, 13)],
                    [],
                    6,
                    4,
                    6,
                    14
                ),
                null,
                6,
                0,
                6,
                14
            ),
        ],
        []
    );

    const content = `
def test(x, y):
    return x + y


r = test(3, 5)
`;

    await doTest(content, mod);
});

/**@todo this should really be pyNone */
Deno.test("#5: t019.py if None is None", async () => {
    const mod = new astnodes.Module(
        [
            new astnodes.If(
                new astnodes.Compare(
                    new astnodes.Constant("None", null, 2, 3, 2, 7),
                    [new astnodes.Is()],
                    [new astnodes.Constant("None", null, 2, 11, 2, 15)],
                    2,
                    3,
                    2,
                    15
                ),
                [
                    new astnodes.Expr(
                        new astnodes.Call(
                            new astnodes.Name("print", new astnodes.Load(), 3, 4, 3, 9),
                            [new astnodes.Constant("OK", null, 3, 10, 3, 14)],
                            [],
                            3,
                            4,
                            3,
                            15
                        ),
                        3,
                        4,
                        3,
                        15
                    ),
                ],
                [],
                2,
                0,
                3,
                15
            ),
        ],
        []
    );
    const content = `
if None is None:
    print("OK")
`;
    await doTest(content, mod);
});
