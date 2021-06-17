import { GeneratedParser } from "./parser/generated_parser.ts";
import { Tokenizer } from "./tokenize/Tokenizer.ts";
import { tokenize } from "./tokenize/tokenize.ts";
import { dump } from "./ast/ast.ts";

import { readLines } from "https://deno.land/std@0.99.0/io/mod.ts";
import { parse } from "https://deno.land/std@0.99.0/flags/mod.ts";

const args = parse(Deno.args);

console.assert(args._.length == 1, "Must pass filename as argument");

const filename = args._[0] as string;

const fileReader = await Deno.open(filename);

const lines = [];

for await (const line of readLines(fileReader)) {
    lines.push(line);
}

fileReader.close();

const tokens = tokenize(lines[Symbol.iterator]());

const tokenizer = new Tokenizer(tokens);

const parser = new GeneratedParser(tokenizer);

const ast = parser.file();

console.log(JSON.stringify(ast, null, 2));
console.log(ast);
