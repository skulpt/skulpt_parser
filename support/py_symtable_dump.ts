/** @todo - mode */
/** Simple name and function, compact form, but not configurable */
export async function getPySymTableDump(content: string): Promise<string> {
    const cmd = Deno.run({
        cmd: ["python3", "support/symtable_dump_helper.py", content],
        stdout: "piped",
        stderr: "piped",
    });

    const output = await cmd.output(); // "piped" must be set
    const outStr = new TextDecoder().decode(output);

    const error = await cmd.stderrOutput();
    const errorStr = new TextDecoder().decode(error);
    cmd.close(); // Don't forget to close it

    if (errorStr) {
        console.log(outStr);
        console.error(errorStr);
        throw new Error(errorStr);
    }

    return outStr;
}
