/** Simple name and function, compact form, but not configurable */
export async function getPyAstDump(
    content: string,
    options: { indent?: null | number; include_attributes?: boolean; js?: boolean }
): Promise<string> {
    const { indent = null, include_attributes = false, js = false } = options;
    const cmd = Deno.run({
        cmd: [
            "python3",
            "support/ast_dump_helper.py",
            content,
            `--indent=${indent === null ? -1 : indent}`,
            include_attributes ? "--attrs=1" : "--attrs=0",
            js ? "--js=1" : "--js=0",
        ],
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
