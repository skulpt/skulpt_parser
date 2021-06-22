import { dump } from "../src/ast/dump.ts";
import { Colors, parse } from "../deps.ts";
import { getDiff } from "../support/diff.ts";
import { getPyAstDump } from "../support/py_ast_dump.ts";
import { runParserFromFile } from "../src/parser/parse.ts";

const argv = parse(Deno.args, {
    default: { mode: "exec" } /** @todo this doesn't get passed to the python script */,
    boolean: ["no_compare"],
    alias: { mode: "m", no_compare: "nc" },
});

const { _: args, mode, no_compare: noCompare } = argv;

const options = { indent: 2, include_attributes: true };

console.assert(args.length == 1, Colors.bold(Colors.bgRed(Colors.white(" Must pass filename as argument "))));

const filearg = args[0];

let filename: string;
if (typeof filearg === "number") {
    filename = `run-tests/t${filearg.toString().padStart(3, "0")}.py`;
} else {
    filename = filearg;
}

const ast = runParserFromFile(filename, mode);
if (ast === null) {
    throw new Error(Colors.red("Parser returned null"));
}

const jsDump = dump(ast, options);

if (noCompare) {
    console.log(jsDump);
    Deno.exit();
}

console.log();
console.log(Colors.bold(Colors.magenta("##### py (EXPECTED) #####")));
const pyDump = await getPyAstDump(Deno.readTextFileSync(filename), options);
console.log(Colors.magenta(pyDump));
console.log();
console.log(Colors.bold(Colors.green("/**** js  (ACTUAL)   ****/")));
console.log(Colors.green(jsDump));
console.log();
console.log(getDiff(jsDump, pyDump));
