import { parse } from "../deps.ts";

const args = parse(Deno.args);
const test = args._?.[0];

const extra = [];

switch (test) {
    case "parse":
        extra.push("tests/parse.test.ts");
        break;
    /** @todo the default should be to do nothing here and run all the tests */
    case "dump":
    default:
        extra.push("tests/ast_dump.test.ts");
        break;
}

const cmd = Deno.run({
    cmd: ["deno", "test", "--allow-read", "--allow-run", ...extra],
});

await cmd.status();
