import { dump } from "../src/ast/dump.ts";
import { Colors, parse } from "../deps.ts";
import { getDiff } from "../support/diff.ts";
import { getPyAstDump } from "../support/py_ast_dump.ts";
import { runParserFromFile } from "../src/parser/parse.ts";

const args = parse(Deno.args);
const options = { indent: 2, include_attributes: true };

console.assert(args._.length == 1, Colors.bold(Colors.bgRed(Colors.white(" Must pass filename as argument "))));

const filearg = args._[0];

let filename: string;
if (typeof filearg === "number") {
    filename = `run-tests/t${filearg.toString().padStart(3, "0")}.py`;
} else {
    filename = filearg;
}

console.log();
console.log(Colors.bold(Colors.magenta("##### py #####")));
const pyDump = await getPyAstDump(Deno.readTextFileSync(filename), options);
console.log(Colors.magenta(pyDump));
console.log();

let jsDump = "";
const ast = runParserFromFile(filename, null, args);
if (ast !== null) {
    try {
        jsDump = dump(ast, options);
        console.log(Colors.bold(Colors.green("/**** js ****/")));
        console.log(Colors.green(jsDump));
    } catch {
        console.log("ast dump failed - JSON version");
        console.log(Colors.green(JSON.stringify(ast, null, 2)));
    }
} else {
    console.error("parser returned null");
}

console.log();
console.log(getDiff(jsDump, pyDump));
