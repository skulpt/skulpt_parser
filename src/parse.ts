import { GeneratedParser } from "./parser/generated_parser.ts";
import { Tokenizer } from "./tokenize/Tokenizer.ts";
import { tokenize } from "./tokenize/tokenize.ts";
import { readFile } from "./tokenize/readline.ts";
import { dump } from "./ast/ast.ts";
import { Colors, parse } from "../deps.ts";

const args = parse(Deno.args);

console.assert(args._.length == 1, Colors.bold(Colors.bgRed(Colors.white(" Must pass filename as argument "))));

const filename = args._[0] as string;

const tokens = tokenize(readFile(filename));

const tokenizer = new Tokenizer(tokens);

const parser = new GeneratedParser(tokenizer, args.verbose || false);

const ast = parser.file();

console.log(Colors.green(JSON.stringify(ast, null, 2)));
console.log(ast);
