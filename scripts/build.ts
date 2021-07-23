// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import { esbuild } from "../deps.ts";
// import * as esbuild from "esbuild";
// deno run -A scripts/build.ts

let result = await esbuild.build({
    entryPoints: ["scripts/bench.ts"],
    bundle: true,
    format: "esm",
    outfile: "dist/bundle.min.js",
    minify: true,
});

console.log("result:", result);

result = await esbuild.build({
    entryPoints: ["scripts/bench.ts"],
    bundle: true,
    format: "esm",
    outfile: "dist/bundle.js",
});

console.log("result:", result);
esbuild.stop();
