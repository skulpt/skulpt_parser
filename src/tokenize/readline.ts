// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

const splitLines = /^.*$/gm;

/** takes in a string and retuns a generator that yields each line with the \n character */
export function* readString(text: string): IterableIterator<string> {
    for (const match of text.matchAll(splitLines)) {
        yield match[0] + "\n";
    }
}

/** yields lines from a file given a filename */
export function readFile(filename: string): IterableIterator<string> {
    const text = Deno.readTextFileSync(filename);
    return readString(text);
}
