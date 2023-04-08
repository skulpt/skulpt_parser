import { python } from "../deps.ts";

const sys = python.import("sys");
sys.path.append(import.meta.resolve("../support").replace("file://", ""));
const py_symtable_dump = python.import("symtable_dump_helper").dump;

/** Simple name and function, compact form, but not configurable */
export function getPySymTableDump(content: string): string {
    return py_symtable_dump(content).toString();
}
