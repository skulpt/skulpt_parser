// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

class InternalAssertionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AssertionError";
    }
}

/** @todo remove these in minified code */
/** Make an assertion, if not `true`, then throw. */
export function assert(expr: unknown, msg = ""): asserts expr {
    if (!expr) {
        throw new InternalAssertionError(msg);
    }
}
