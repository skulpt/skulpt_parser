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

export function assertEqualsString(A: string, B: string): void {
    if (A === B) {
        return;
    }
    try {
        assertEquals(A.split("\n"), B.split("\n"));
    } catch (e) {
        // this is temporary until https://github.com/denoland/deno_std/issues/929
        // is resolved by https://github.com/denoland/deno_std/pull/948
        throw new AssertionError(
            (e.message as string).replaceAll(/\s+(\[|\])/gm, "").replaceAll(/(\s+)\"(.*)\"\,/g, (m, m1, m2) => m1 + m2)
        );
    }
}
