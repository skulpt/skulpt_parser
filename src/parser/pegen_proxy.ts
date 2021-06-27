// deno-lint-ignore-file no-explicit-any
import { Colors } from "../../deps.ts";
import * as pegenReal from "./pegen.ts";
import type { Parser } from "./parser.ts";
import type { VerboseParser } from "./verbose_parser.ts";

export const pegen = new Proxy(pegenReal, {
    get(target: { [index: string]: any }, prop: string, _receiver) {
        if (prop in target) {
            return (p: Parser, ...args: any[]) => {
                return target[prop](p, ...args);
            };
        }
        return (_p: Parser, ...args: any[]) => args;
    },
});

export const pegenV1 = new Proxy(pegenReal, {
    get(target: { [index: string]: any }, prop: string, _receiver) {
        if (prop in target) {
            return (p: Parser, ...args: any[]) => {
                console.log(Colors.green("Calling '" + prop + "'"));
                console.log(Colors.green("With"), args);
                return target[prop](p, ...args);
            };
        }

        console.log(Colors.yellow("Missing pegen func!: " + prop));

        return (_p: Parser, ...args: any[]) => args;
    },
});

export const pegenV2 = new Proxy(pegenReal, {
    get(target: { [index: string]: any }, prop: string, _receiver) {
        if (prop in target) {
            return (p: VerboseParser, ...args: any[]) => {
                console.log(p._fill() + Colors.green("Calling '" + prop + "'"));
                console.log(p._fill() + Colors.green("With"), args);
                return target[prop](p, ...args);
            };
        }

        console.log(Colors.yellow("Missing pegen func!: " + prop));

        return (_p: VerboseParser, ...args: any[]) => args;
    },
});
