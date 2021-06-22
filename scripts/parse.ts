import { dump } from "../src/ast/dump.ts";
import { Colors, parse } from "../deps.ts";
import { getDiff } from "../support/diff.ts";
import { getPyAstDump } from "../support/py_ast_dump.ts";
import { runParserFromFile } from "../src/parser/parse.ts";

const args = parse(Deno.args);
const mode = args.mode || "exec";
const options = { indent: 2, include_attributes: true };

console.assert(args._.length == 1, Colors.bold(Colors.bgRed(Colors.white(" Must pass filename as argument "))));

const filearg = args._[0];

let filename: string;
if (typeof filearg === "number") {
    filename = `run-tests/t${filearg.toString().padStart(3, "0")}.py`;
} else {
    filename = filearg;
}

const compare = !args["no_compare"];

let pyDump = "";

if (compare) {
    console.log();
    console.log(Colors.bold(Colors.magenta("##### py #####")));
    pyDump = await getPyAstDump(Deno.readTextFileSync(filename), options);
    console.log(Colors.magenta(pyDump));
    console.log();
}

let jsDump = "";
const ast = runParserFromFile(filename, mode);
if (ast !== null) {
    try {
        jsDump = dump(ast, options);
        if (compare) {
            console.log(Colors.bold(Colors.green("/**** js ****/")));
            console.log(Colors.green(jsDump));
        } else {
            console.log(jsDump);
        }
    } catch {
        console.log("ast dump failed - JSON version");
        console.log(Colors.yellow(JSON.stringify(ast, null, 2)));
    }
} else {
    throw new Error("Parser returned null");
}

if (compare) {
    console.log();
    console.log(getDiff(jsDump, pyDump));
}
