// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT
// deno-lint-ignore-file camelcase
import { Ll, Lm, Lo, Lt, Lu, Nl } from "./unicode.ts";

const the_underscore = "_";
const Other_ID_Start = "\\u1885-\\u1886\\u2118\\u212E\\u309B-\\u309C";
const id_start = Lu + Ll + Lt + Lm + Lo + Nl + the_underscore + Other_ID_Start;

const IS_SIMPLE_START = /^[A-Za-z_]$/;
const INVALID_START = /^[\\\/(){}\[\].!%&*=+,-><:;@^~]$/;
const IS_VALID_START = new RegExp("^[" + id_start + "]$");

export function initialIsIdentifier(s: string) {
    return IS_SIMPLE_START.test(s) || (!INVALID_START.test(s) && IS_VALID_START.test(s.normalize("NFKC")));
}

const IS_SPACE = /^\s+$/;
export function isSpace(s: string): boolean {
    return IS_SPACE.test(s);
}
