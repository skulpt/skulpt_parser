import { parse } from "../deps.ts";

const args = parse(Deno.args, { boolean: ["f"], alias: { f: "fail-fast" } });
const test = args._[0];

const extra = [];

switch (test) {
    case "parse":
        extra.push("tests/parse.test.ts");
        break;
    case "pypeg":
        await Deno.run({
            cmd: [
                "python",
                "-m",
                "unittest",
                "tests/test_peg_parser.py",
                ...Deno.args.filter((arg) => arg !== "pypeg"),
            ],
        }).status();
        Deno.exit();
        break; // just to keep ts happy
    /** @todo the default should be to do nothing here and run all the tests */
    case "dump":
    default:
        extra.push("tests/ast_dump.test.ts");
        break;
}

if (args["f"]) {
    extra.push("--fail-fast");
}

/** set this in Deno env which other test files can retrieve
 * example use: `vr test parse 1`
 */
const files = args._.filter((x) => typeof x === "number").map((x) => `t${x.toString().padStart(3, "0")}.py`);
Deno.env.set("_TESTFILES", JSON.stringify(files));

const cmd = Deno.run({
    cmd: ["deno", "test", "--allow-read", "--allow-run", "--allow-env", ...extra],
});

await cmd.status();
