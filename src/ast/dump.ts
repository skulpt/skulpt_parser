import { AST } from "./astnodes.ts";
import type { pyConstant } from "./constants.ts";

type nodeType = AST | boolean | string | pyConstant<any>;

function _format(node: nodeType | nodeType[], level = 0, indent: string | null = null): [string, boolean] {
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
        for (const _name of node._fields) {
            let value = node[_name as keyof typeof node];
            let simple: boolean;
            if (value === null) {
                continue;
            }
            [value, simple] = _format(value, level, indent);
            allsimple = allsimple && simple;
            args.push(`${_name}=${value}`);
        }
        if (allsimple && args.length <= 3) {
            return [`${node.tp$name}(${args.join(", ")})`, !args.length];
        }
        return [`${node.tp$name}(${prefix}${args.join(sep)})`, false];
    } else if (Array.isArray(node)) {
        if (node.length === 0) {
            return ["[]", true];
        }
        return [`[${prefix}${node.map((x) => _format(x, level, indent)[0]).join(sep)}]`, false];
    } else {
        if (typeof node === "boolean") {
            return [node ? "True" : "False", true];
        } else if (typeof node === "string") {
            let quote = "'";
            if (node.includes("'") && !node.includes('"')) {
                quote = '"';
            }
            return [quote + node + quote, true];
        } else {
            // builtin ast constant type
            return [String(node), true];
        }
    }
}

export function dump(node: AST, indent: string | number | null = null): string {
    if (!(node instanceof AST)) {
        throw new TypeError(`expected ast, got ${typeof node}`);
    }
    if (typeof indent === "number") {
        indent = " ".repeat(indent);
    }
    return _format(node, 0, indent)[0];
}
