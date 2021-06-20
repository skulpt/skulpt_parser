import { tokenizerFromFile, tokenizerFromString } from "../tokenize/mod.ts";
import { GeneratedParser } from "./generated_parser.ts";

/**@todo start_rule -  we can also probaly just make .parse() this into a method on the parser itself since it should know it's own startrule*/
export function parse(p: GeneratedParser, start_rule: number | null = 256) {
    // if (mode === 256) {
    return p.file();
    // }
}

export function runParserFromString(
    text: string,
    start_rule: number | null = 256,
    flags: { [flag: string]: any } = {}
) {
    const parser = new GeneratedParser(tokenizerFromString(text), !!(flags.v || flags.verbose));
    return parse(parser, start_rule);
}

export function runParserFromFile(
    filename: string,
    start_rule: number | null = 256,
    flags: { [flag: string]: any } = {}
) {
    const parser = new GeneratedParser(tokenizerFromFile(filename), !!(flags.v || flags.verbose));
    return parse(parser, start_rule);
}
