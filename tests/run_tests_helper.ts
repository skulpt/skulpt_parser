import { Colors } from "../deps.ts";

async function populateFiles(files: string[]) {
    for await (const dirEntry of Deno.readDir("run-tests/")) {
        if (!dirEntry.name.endsWith(".py")) {
            continue;
        }
        files.push(dirEntry.name);
    }
    files.sort();
}

interface runTestsOptions {
    files?: string[];
    skip?: Set<string>;
    failFast?: boolean;
}

export async function runTests(doTest: (text: string) => void, options: runTestsOptions = {}) {
    const { files = [], skip = new Set(), failFast = false } = options;
    if (files.length === 0) {
        await populateFiles(files);
    }

    for (const test of files) {
        if (skip.has(test)) {
            console.log(`test ${test} ... ${Colors.yellow("skipped")}`);
            continue;
        }
        Deno.test({
            name: test,
            fn: async () => {
                try {
                    const text = await Deno.readTextFile("run-tests/" + test);
                    await doTest(text);
                } catch (e) {
                    if (failFast) {
                        console.error(e);
                        Deno.exit(0);
                    } else {
                        throw e;
                    }
                }
            },
            sanitizeExit: false,
            // allow us to exit early with Deno.exit
        });
    }
}
