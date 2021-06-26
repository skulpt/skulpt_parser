type filename = string;
type lineno = number;
type offset = number;
type text = string;

export class pyExc extends Error {
    static _name = "Exception";
    args: [string, ...any[]];
    constructor(...args: [string, ...any[]]) {
        super(args[0]);
        this.args = args;
    }
    get [Symbol.toStringTag]() {
        return (this.constructor as typeof pyExc)._name;
    }
    get name() {
        // so that we display nicer error messages internally by default
        return (this.constructor as typeof pyExc)._name;
    }
}

export class pySyntaxError extends pyExc {
    static _name = "SyntaxError";
    traceback: [filename, lineno, offset, text];
    constructor(msg: string, traceback: [filename, lineno, offset, text]) {
        super(msg, traceback);
        this.traceback = traceback;
    }
}

export class pyIndentationError extends pySyntaxError {
    static _name = "IndentationError";
}

export class pyTabError extends pySyntaxError {
    static _name = "TabError";
}
