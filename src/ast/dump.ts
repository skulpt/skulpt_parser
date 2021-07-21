// deno-lint-ignore-file camelcase
import { AST } from "./astnodes.ts";
import type { pyConstant } from "./constants.ts";

type nodeType = AST | boolean | string | null | pyConstant | number;
interface dumpOptions {
    indent?: string | null | number;
    annotate_fields?: boolean;
    include_attributes?: boolean;
}

export function dump(node: AST, options: dumpOptions): string {
    if (!(node instanceof AST)) {
        throw new TypeError(`expected ast, got ${typeof node}`);
    }
    const { indent: _indent = null, annotate_fields = true, include_attributes = false } = options;

    let indent: string | null;
    if (typeof _indent === "number") {
        indent = " ".repeat(_indent) as string;
    } else {
        indent = _indent;
    }

    function _format(node: nodeType | nodeType[], level = 0): [string, boolean] {
        let prefix: string, sep: string;
        if (indent !== null) {
            level += 1;
            prefix = "\n" + indent.repeat(level);
            sep = ",\n" + indent.repeat(level);
        } else {
            prefix = "";
            sep = ", ";
        }

        if (node instanceof AST) {
            const args = [];
            let allsimple = true;
            // let keywords = annotate_fields;
            for (const field of node._fields) {
                let value = node[field as keyof typeof node] as nodeType;
                let simple: boolean;
                if (value === null) {
                    continue;
                }
                [value, simple] = _format(value, level);
                allsimple = allsimple && simple;
                if (annotate_fields) {
                    args.push(`${field}=${value}`);
                } else {
                    args.push(`${value}`);
                }
            }
            if (include_attributes && node._attributes.length) {
                for (const attr of node._attributes) {
                    let value = node[attr as keyof typeof node];
                    let simple: boolean;
                    [value, simple] = _format(value, level);
                    allsimple = allsimple && simple;
                    args.push(`${attr}=${value}`);
                }
            }
            if (allsimple && args.length <= 3) {
                return [`${node[Symbol.toStringTag]}(${args.join(", ")})`, !args.length];
            }
            return [`${node[Symbol.toStringTag]}(${prefix}${args.join(sep)})`, false];
        } else if (Array.isArray(node)) {
            if (node.length === 0) {
                return ["[]", true];
            }
            return [`[${prefix}${node.map((x) => _format(x, level)[0]).join(sep)}]`, false];
        } else {
            if (typeof node === "boolean") {
                return [node ? "True" : "False", true];
            } else if (typeof node === "string") {
                let quote = "'";
                if (node.includes("'") && !node.includes('"')) {
                    quote = '"';
                }
                return [quote + node + quote, true];
            } else if (node === null) {
                return ["None", true];
            } else {
                // builtin ast constant type
                return [String(node), true];
            }
        }
    }

    return _format(node, 0)[0];
}
