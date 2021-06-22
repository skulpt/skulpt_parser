import { Colors, parse } from "../deps.ts";

const argv = parse(Deno.args);

console.assert(
    argv._.length == 1,
    Colors.bold(Colors.bgRed(Colors.white(" Must pass the code to be parsed as argument ")))
);

const code = argv._[0];
const args = Deno.args.filter((arg) => arg !== code);

await Deno.writeTextFile("tmp.txt", "" + code || "");

await Deno.run({ cmd: ["vr", "parse", "tmp.txt", ...args] }).status();
