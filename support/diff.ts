import { Colors, diff, DiffResult, DiffType } from "../deps.ts";

/** most of these are copied and pasted from https://deno.land/std@0.99.0/testing/asserts.ts */
function createColor(diffType: DiffType): (s: string) => string {
    switch (diffType) {
        case DiffType.added:
            return (s: string): string => Colors.green(Colors.bold(s));
        case DiffType.removed:
            return (s: string): string => Colors.red(Colors.bold(s));
        default:
            return Colors.white;
    }
}
function createSign(diffType: DiffType): string {
    switch (diffType) {
        case DiffType.added:
            return "+   ";
        case DiffType.removed:
            return "-   ";
        default:
            return "    ";
    }
}
function buildMessage(diffResult: ReadonlyArray<DiffResult<string>>): string[] {
    const messages: string[] = [];
    messages.push("");
    messages.push("");
    messages.push(
        `    ${Colors.gray(Colors.bold("[Diff]"))} ${Colors.red(Colors.bold("Actual"))} / ${Colors.green(
            Colors.bold("Expected")
        )}`
    );
    messages.push("");
    messages.push("");
    diffResult.forEach((result: DiffResult<string>): void => {
        const c = createColor(result.type);
        messages.push(c(`${createSign(result.type)}${result.value}`));
    });
    messages.push("");

    return messages;
}

export function getDiff(A: string, B: string): string {
    let message = "";

    try {
        const diffResult = diff(A.split("\n"), B.split("\n"));
        const diffMsg = buildMessage(diffResult).join("\n");
        message = `Values are not equal:\n${diffMsg}`;
    } catch {
        message = `\n${Colors.red("[Cannot display]")} + \n\n`;
    }
    return message;
}
