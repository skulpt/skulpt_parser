const splitLines = /^.*$/gm;

/** takes in a string and retuns a generator that yields each line with the \n character */
export function* readString(text: string): IterableIterator<string> {
    for (const match of text.matchAll(splitLines)) {
        yield match[0] + "\n";
    }
}
