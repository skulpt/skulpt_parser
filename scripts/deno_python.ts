// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import { python } from "https://deno.land/x/python/mod.ts";

const sys = python.import("sys");
console.log(sys.path, sys.version);
// python.import("peg_generator");
sys.path.append("/Users/scork/Desktop/Projects/skulpt_parser/tests");
const x = python.import("test_peg_parser");
console.log(x);
// const plt = python.import("matplotlib.pyplot");

// const xpoints = np.array([1, 8]);
// const ypoints = np.array([3, 10]);

// console.log(np.__dir__())
// plt.plot(xpoints, ypoints);
// plt.show();
