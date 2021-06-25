import { Colors, parse } from "../deps.ts";

const argv = parse(Deno.args, { string: "_" });

console.assert(
    argv._.length == 1,
    Colors.bold(Colors.bgRed(Colors.white(" Must pass the code to be parsed as argument ")))
);

const code = argv._[0];
const args = Deno.args.filter((arg) => arg !== code);
const tmpPath = "./tmp";

try {
    await Deno.mkdir(tmpPath);
} catch (e) {
    if (!(e instanceof Deno.errors.AlreadyExists)) {
        throw e;
    }
}

const filename = await Deno.makeTempFile({ dir: tmpPath, suffix: ".txt" });
try {
    await Deno.writeTextFile(filename, "\n" + code + "\n");
    await Deno.run({ cmd: ["vr", "parse", filename, ...args] }).status();
} finally {
    await Deno.remove(filename);
    await Deno.remove(tmpPath);
}
