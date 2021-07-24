// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import { tokenizerFromFile, tokenizerFromString } from "../tokenize/mod.ts";
import { GeneratedParser } from "./generated_parser.ts";
import { StartRule } from "./pegen_types.ts";

export type ModeStr = "exec" | "eval" | "single";

function modeStrToStartRule(mode: ModeStr): StartRule {
    switch (mode) {
        case "exec":
            return StartRule.FILE_INPUT;
        case "eval":
            return StartRule.EVAL_INPUT;
        case "single":
            return StartRule.SINGLE_INPUT;
        default:
            throw new Error(`bad mode - got ${mode} - use 'exec', 'eval' or 'single'`);
    }
}

export function parserFromString(text: string, mode: ModeStr = "exec", filename = "<string>") {
    const parser = new GeneratedParser(tokenizerFromString(text, filename), modeStrToStartRule(mode));
    parser.filename = filename;
    return parser;
}

export function runParserFromString(text: string, mode: ModeStr = "exec", filename = "<string>") {
    return parserFromString(text, mode, filename).parse();
}

export function parserFromFile(filename: string, mode: ModeStr = "exec") {
    const parser = new GeneratedParser(tokenizerFromFile(filename), modeStrToStartRule(mode));
    parser.filename = filename;
    return parser;
}

export function runParserFromFile(filename: string, mode: ModeStr = "exec") {
    return parserFromFile(filename, mode).parse();
}

export var astFromString = runParserFromString;
export var astFromFile = runParserFromFile;
