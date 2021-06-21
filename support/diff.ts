import { assertEquals, AssertionError, Colors } from "../deps.ts";

export function getDiff(A: string, B: string): string {
    try {
        assertEqualsString(A, B);
    } catch (e) {
        return e.message as string;
    }
    return Colors.bold(
        Colors.green(`
*********************************
    Success - we have a match
*********************************
`)
    );
}

// [32m[1m
const colorPrefix = "(?:\\[\\d{1,2}m){1,}";
const prePostBracket = new RegExp("^(" + colorPrefix + "\\s+)[\\[\\]]", "gm");
const line = new RegExp("^(" + colorPrefix + '[+-]?\\s+)["`](.*)["`],', "gm");

export function assertEqualsString(A: string, B: string): void {
    if (A === B) {
        return;
    }
    try {
        assertEquals(A.split("\n"), B.split("\n"));
    } catch (e) {
        // this is temporary until https://github.com/denoland/deno_std/issues/929
        // is resolved by https://github.com/denoland/deno_std/pull/948
        throw new AssertionError((e.message as string).replaceAll(prePostBracket, "$1").replaceAll(line, "$1$2"));
    }
}
