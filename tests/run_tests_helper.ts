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
    exitEarly?: boolean;
}

export async function runTests(doTest: (text: string) => void, options: runTestsOptions = {}) {
    const { files = [], skip = new Set(), exitEarly = false } = options;
    if (files.length === 0) {
        await populateFiles(files);
    }

    for (const test of files) {
        if (skip.has(test)) {
            continue;
        }
        Deno.test({
            name: test,
            fn: async () => {
                try {
                    const text = await Deno.readTextFile("run-tests/" + test);
                    await doTest(text);
                } catch (e) {
                    if (exitEarly) {
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
