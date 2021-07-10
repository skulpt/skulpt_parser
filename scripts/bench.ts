/**
 * deno run -A scripts/bench.ts tmp.txt
 *
 * Note it's also a good idea to bundle this first using vr build
 * changing scripts/build.ts to build this file instead
 *
 * then adjust the above command to
 * deno run -A dist/bundle.min.js tmp.txt
 */
import { bench, Colors, parse, runBenchmarks } from "../deps.ts";
import { runParserFromString } from "../src/parser/parse.ts";
import { readString } from "../src/tokenize/readline.ts";
import { tokenize } from "../src/tokenize/tokenize.ts";

const { _: args } = parse(Deno.args);

console.assert(args.length == 1, Colors.bold(Colors.bgRed(Colors.white(" Must pass filename as argument "))));

const filearg = args[0];

let filename: string;
if (typeof filearg === "number") {
    filename = `run-tests/t${filearg.toString().padStart(3, "0")}.py`;
} else {
    filename = filearg;
}

const text = Deno.readTextFileSync(filename);

bench({
    name: "parse",
    runs: 50,
    func(b): void {
        b.start();
        runParserFromString(text);
        b.stop();
    },
});

bench({
    name: "tokenize",
    runs: 50,
    func(b): void {
        b.start();
        [...tokenize(readString(text), filename)];
        b.stop();
    },
});

runBenchmarks({ only: /parse/ }, (p) => {
    if (p.running && p.running.measuredRunsMs.length) {
        console.log(p.running.measuredRunsMs[p.running.measuredRunsMs.length - 1], "ms");
    }
});
