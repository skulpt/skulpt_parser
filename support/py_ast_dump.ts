import { python, kw } from "../deps.ts";

const sys = python.import("sys");
sys.path.append(import.meta.resolve("../support").replace("file://", ""));
const py_dump = python.import("ast_dump_helper").dump;

/** Simple name and function, compact form, but not configurable */
export function getPyAstDump(
    content: string,
    options: { indent?: null | number; include_attributes?: boolean; js?: boolean },
    mode = "exec"
): string {
    const { indent = null, include_attributes: includeAttrs = false, js = false } = options;
    return py_dump(
        content,
        kw`js=${js}`,
        kw`include_attributes=${includeAttrs}`,
        kw`indent=${indent}`,
        kw`mode=${mode}`
    ).toString();
}
