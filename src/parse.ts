import { GeneratedParser } from "./parser/generated_parser.ts";
import { Tokenizer } from "./tokenize/Tokenizer.ts";
import { tokenize } from "./tokenize/tokenize.ts";
import { dump } from "./ast/ast.ts";
import { Colors, parse } from "../deps.ts";

const args = parse(Deno.args);

console.assert(args._.length == 1, Colors.bold(Colors.bgRed(Colors.white(" Must pass filename as argument "))));

const filename = path.join(Deno.cwd(), args._[0] as string);

const fileReader = await Deno.open(filename);

const lines = [];

for await (const line of readLines(fileReader)) {
    lines.push(line);
}

fileReader.close();

function* lineProducer(lines: string[]): IterableIterator<string> {
    for (const line of lines) {
        yield line;
    }
}

const tokens = tokenize(lineProducer(lines));

const tokenizer = new Tokenizer(tokens);

const parser = new GeneratedParser(tokenizer, args.verbose || false);

const ast = parser.file();

console.log(Colors.green(JSON.stringify(ast, null, 2)));
console.log(ast);
