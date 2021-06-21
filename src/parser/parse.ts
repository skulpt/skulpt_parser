import { tokenizerFromFile, tokenizerFromString } from "../tokenize/mod.ts";
import { GeneratedParser } from "./generated_parser.ts";
import { EVAL_INPUT, FILE_INPUT, SINGLE_INPUT, StartRule } from "./pegen_types.ts";

type ModeStr = "exec" | "eval" | "single";

function modeStrToStartRule(mode: ModeStr): StartRule {
    switch (mode) {
        case "exec":
            return FILE_INPUT;
        case "eval":
            return EVAL_INPUT;
        case "single":
            return SINGLE_INPUT;
        default:
            throw new Error(`bad mode - got ${mode} - use 'exec', 'eval' or 'single'`);
    }
}

export function runParserFromString(text: string, mode: ModeStr = "exec") {
    const parser = new GeneratedParser(tokenizerFromString(text), modeStrToStartRule(mode));
    return parser.parse();
}

export function runParserFromFile(filename: string, mode: ModeStr = "exec") {
    const parser = new GeneratedParser(tokenizerFromFile(filename), modeStrToStartRule(mode));
    return parser.parse();
}
