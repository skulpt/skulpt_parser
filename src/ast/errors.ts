// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT
type filename = string;
type lineno = number;
type offset = number;
type text = string;

export class pySyntaxError extends SyntaxError {
    static _name = "SyntaxError";
    traceback: [filename, lineno, offset, text];
    constructor(msg: string, traceback: [filename, lineno, offset, text]) {
        super(msg);
        this.traceback = traceback;
    }
    get [Symbol.toStringTag]() {
        return (this.constructor as typeof pySyntaxError)._name;
    }
    get name() {
        // so that we display nicer error messages internally by default
        return (this.constructor as typeof pySyntaxError)._name;
    }
}

export class pyIndentationError extends pySyntaxError {
    static _name = "IndentationError";
}
