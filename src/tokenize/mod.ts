// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT
import { readFile, readString } from "./readline.ts";
import { tokenize } from "./tokenize.ts";
import { Tokenizer } from "./Tokenizer.ts";

export function tokenizerFromString(text: string, filename = "<string>") {
    return new Tokenizer(tokenize(readString(text), filename));
}

export function tokenizerFromFile(filename: string) {
    return new Tokenizer(tokenize(readFile(filename), filename));
}
