// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

type filename = string;
type lineno = number;
type offset = number;
type text = string;

export class pySyntaxError extends SyntaxError {
    name = "SyntaxError";
    traceback: [filename, lineno, offset, text];
    constructor(msg: string, traceback: [filename, lineno, offset, text]) {
        super(msg);
        this.traceback = traceback;
    }
}

export class pyIndentationError extends pySyntaxError {
    name = "IndentationError";
}
