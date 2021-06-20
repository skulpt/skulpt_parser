import { readFile, readString } from "./readline.ts";
import { tokenize } from "./tokenize.ts";
import { Tokenizer } from "./Tokenizer.ts";

export function tokenizerFromString(text: string) {
    return new Tokenizer(tokenize(readString(text)));
}

export function tokenizerFromFile(filename: string) {
    return new Tokenizer(tokenize(readFile(filename)));
}
