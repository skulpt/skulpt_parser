// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import type { AST } from "../ast/astnodes.ts";
import { pySyntaxError } from "../mock_types/errors.ts";
import { assert } from "../util/assert.ts";
import type { SymbolTable } from "./SymbolTable.ts";
import { Symbol_ } from "./Symbol.ts";
import { BlockType, SYMTAB_CONSTS, inplaceMerge, NameToFlag } from "./util.ts";

type Directive = [string, number, number];

export class SymbolTableScope {
    children: SymbolTableScope[] | null = null;
    varnames: string[] = [];
    isNested = false;
    hasFree = false;
    childHasFree = false; // true if child block has free vars including free refs to globals
    generator = false;
    varargs = false;
    varkeywords = false;
    returnsValue = false;
    compIterExpr = 0;
    compIterTarget = false;
    comprehension = false;
    coroutine = false;
    needsClassClosure = false;
    symbols: NameToFlag = {};
    symbolObjectCache = new Map<string, Symbol_>();
    _funcLocals: string[] | null = null;
    _funcParams: string[] | null = null;
    _funcGlobals: string[] | null = null;
    _funcNonlocals: string[] | null = null;
    _funcFrees: string[] | null = null;
    _classMethods: string[] | null = null;
    directives: Directive[] = [];

    constructor(
        readonly table: SymbolTable,
        readonly name: string,
        readonly blockType: BlockType,
        ast: AST,
        readonly filename: string,
        readonly lineno: number,
        readonly colOffset: number,
        readonly endLineno?: number | null,
        readonly endColOffset?: number | null
    ) {
        if (table.cur && (table.cur.isNested || table.cur.blockType === BlockType.FunctionBlock)) {
            this.isNested = true;
        }

        table.blocks.set(ast, this);
    }

    get_type() {
        return this.blockType;
    }

    get_name() {
        return this.name;
    }

    get_lineno() {
        return this.lineno;
    }

    is_nested() {
        return this.isNested;
    }

    has_children() {
        return !!(this.children && this.children.length > 0);
    }

    get_children() {
        return this.children || [];
    }

    get_identifiers() {
        return this.identsMatching(() => true);
    }

    getSymbol(name: string): number {
        return this.symbols[name];
    }

    lookup(name: string): Symbol_ {
        // return new Symbol_(name, this.symbols[name], this.checkChildren(name), this.name === "top");
        if (this.symbolObjectCache.has(name)) {
            return this.symbolObjectCache.get(name)!;
        }

        const flag = this.symbols[name];
        if (flag === undefined) {
            throw new Error(`symbol ('${name}') not found!`);
        }

        const symbol = new Symbol_(name, this.symbols[name], this.checkChildren(name), this.name === "top");

        this.symbolObjectCache.set(name, symbol);

        return symbol;
    }

    get_symbols() {
        /*
        Return a list of *Symbol* instances for
        names in the table.
        */
        return this.get_identifiers().map((ident) => this.lookup(ident));
    }

    private checkChildren(name: string): SymbolTableScope[] | null {
        if (this.children) {
            return this.children.filter((c) => c.name === name);
        }

        return null;
    }

    private identsMatching(f: (flag: number) => boolean): string[] {
        const idents = [];
        for (const name in this.symbols) {
            const flags = this.symbols[name];
            if (f(flags)) {
                idents.push(name);
            }
        }
        return idents;
    }

    get_parameters(): string[] {
        assert(this.get_type() === "function", "get_parameters only valid for function scopes");
        if (this._funcParams === null) {
            this._funcParams = this.identsMatching((x) => !!(x & SYMTAB_CONSTS.DEF_PARAM));
        }
        return this._funcParams;
    }

    get_locals(): string[] {
        if (this._funcLocals === null) {
            const locs = [SYMTAB_CONSTS.LOCAL, SYMTAB_CONSTS.CELL];
            const test = (x: number) => locs.includes((x >> SYMTAB_CONSTS.SCOPE_OFFSET) & SYMTAB_CONSTS.SCOPE_MASK);
            this._funcLocals = this.identsMatching(test);
        }
        return this._funcLocals;
    }

    get_globals(): string[] {
        assert(this.get_type() === "function", "get_globals only valid for function scopes");
        if (this._funcGlobals === null) {
            this._funcGlobals = this.identsMatching(function (x) {
                const masked = (x >> SYMTAB_CONSTS.SCOPE_OFFSET) & SYMTAB_CONSTS.SCOPE_MASK;
                return masked === SYMTAB_CONSTS.GLOBAL_IMPLICIT || masked === SYMTAB_CONSTS.GLOBAL_EXPLICIT;
            });
        }
        return this._funcGlobals;
    }

    get_nonlocals(): string[] {
        if (this._funcNonlocals === null) {
            this._funcNonlocals = this.identsMatching((x) => !!(x & SYMTAB_CONSTS.DEF_NONLOCAL));
        }
        return this._funcNonlocals;
    }

    get_frees(): string[] {
        assert(this.get_type() === "function", "get_frees only valid for function scopes");
        if (this._funcFrees === null) {
            this._funcFrees = this.identsMatching(function (x) {
                const masked = (x >> SYMTAB_CONSTS.SCOPE_OFFSET) & SYMTAB_CONSTS.SCOPE_MASK;
                return masked === SYMTAB_CONSTS.FREE;
            });
        }
        return this._funcFrees;
    }

    get_methods() {
        assert(this.get_type() === "class", "get_methods only valid for class scopes");
        if (this._classMethods === null) {
            this._classMethods = this.children?.map((c) => c.name) ?? [];
        }
        return this._classMethods;
    }

    get_scope(name: string): number {
        const v = this.symbols[name];
        if (v === undefined) {
            return 0;
        }
        return (v >> SYMTAB_CONSTS.SCOPE_OFFSET) & SYMTAB_CONSTS.SCOPE_MASK;
    }

    dropClassFree(free: Set<string>) {
        free.delete("__class__");

        this.needsClassClosure = true;
    }

    errorAtDirective(name: string, errorMessage: string): never {
        assert(this.directives);
        for (const [directiveName, lineno, colOffset] of this.directives) {
            if (directiveName === name) {
                throw new pySyntaxError(errorMessage, [this.filename, lineno, colOffset + 1, ""]);
            }
        }

        throw new Error("BUG: internal directive bookkeeping broken");
    }

    /* Decide on scope of name, given flags.
    The namespace dictionaries may be modified to record information
    about the new name.  For example, a new global will add an entry to
    global.  A name that was global can be changed to local.
    */
    analyzeName(
        scopes: NameToFlag,
        name: string,
        flags: number,
        bound: Set<string> | null,
        local: Set<string>,
        free: Set<string>,
        global: Set<string>
    ) {
        if (flags & SYMTAB_CONSTS.DEF_GLOBAL) {
            if (flags & SYMTAB_CONSTS.DEF_NONLOCAL) {
                this.errorAtDirective(name, `name '${name}' is nonlocal and global`);
            }
            scopes[name] = SYMTAB_CONSTS.GLOBAL_EXPLICIT;
            global.add(name);
            if (bound) {
                bound.delete(name);
            }
            return;
        }

        if (flags & SYMTAB_CONSTS.DEF_NONLOCAL) {
            if (bound === null) {
                this.errorAtDirective(name, "nonlocal declaration not allowed at module level");
            }
            if (!bound.has(name)) {
                this.errorAtDirective(name, `no binding for nonlocal '${name}' found`);
            }
            scopes[name] = SYMTAB_CONSTS.FREE;
            this.hasFree = true;
            free.add(name);
            return;
        }

        if (flags & SYMTAB_CONSTS.DEF_BOUND) {
            scopes[name] = SYMTAB_CONSTS.LOCAL;
            local.add(name);
            global.delete(name);
            return;
        }

        /* If an enclosing block has a binding for this name, it
        is a free variable rather than a global variable.
        Note that having a non-NULL bound implies that the block
        is nested.
        */
        if (bound && bound.has(name)) {
            scopes[name] = SYMTAB_CONSTS.FREE;
            this.hasFree = true;
            free.add(name);
            return;
        }

        /* If a parent has a global statement, then call it global
        explicit?  It could also be global implicit.
        */

        if (global.has(name)) {
            scopes[name] = SYMTAB_CONSTS.GLOBAL_IMPLICIT;
            return;
        }

        if (this.isNested) {
            this.hasFree = true;
        }

        scopes[name] = SYMTAB_CONSTS.GLOBAL_IMPLICIT;
    }

    analyzeChildBlock(bound: Set<string>, free: Set<string>, global: Set<string>, childFree: Set<string>) {
        /* Copy the bound and global dictionaries.
        These dictionaries are used by all blocks enclosed by the
        current block.  The analyze_block() call modifies these
        dictionaries.
        */
        const tempBound = new Set([...bound]);
        const tempFree = new Set([...free]);
        const tempGlobal = new Set([...global]);

        this.analyzeBlock(tempBound, tempFree, tempGlobal);

        inplaceMerge(childFree, tempFree);
    }

    analyzeCells(scopes: NameToFlag, free: Set<string>) {
        for (const name in scopes) {
            const scope = scopes[name];
            if (scope !== SYMTAB_CONSTS.LOCAL) {
                continue;
            }

            if (!free.has(name)) {
                continue;
            }
            /* Replace LOCAL with CELL for this name, and remove
            from free. It is safe to replace the value of name
            in the dict, because it will not cause a resize.
            */
            scopes[name] = SYMTAB_CONSTS.CELL;
            free.delete(name);
        }
    }

    updateSymbols(scopes: NameToFlag, bound: Set<string> | null, free: Set<string>, classFlag: boolean) {
        /* Update scope information for all symbols in this scope */
        for (const name in this.symbols) {
            let flags = this.symbols[name];
            flags |= scopes[name] << SYMTAB_CONSTS.SCOPE_OFFSET;
            this.symbols[name] = flags;
        }

        /* Record not yet resolved free variables from children (if any) */
        const vFree = SYMTAB_CONSTS.FREE << SYMTAB_CONSTS.SCOPE_OFFSET;

        for (const name of free) {
            const v = this.symbols[name];

            /* Handle symbol that already exists in this scope */
            if (v) {
                /* Handle a free variable in a method of
                   the class that has the same name as a local
                   or global in the class scope.
                */
                if (classFlag && v & (SYMTAB_CONSTS.DEF_BOUND | SYMTAB_CONSTS.DEF_GLOBAL)) {
                    const flags = v | SYMTAB_CONSTS.DEF_FREE_CLASS;
                    this.symbols[name] = flags;
                }
                /* It's a cell, or already free in this scope */
                continue;
            }
            /* Handle global symbol */
            if (bound && !bound.has(name)) {
                continue; /* it's a global */
            }
            /* Propagate new free symbol up the lexical stack */
            this.symbols[name] = vFree;
        }
    }

    analyzeBlock(bound: Set<string> | null, free: Set<string>, global: Set<string>) {
        const local = new Set<string>(); /* collect new names bound in block */

        const scopes = {}; /* collect scopes defined for each name */

        /* Allocate new global and bound variable dictionaries.  These
        dictionaries hold the names visible in nested blocks.  For
        BlockType.ClassBlocks, the bound and global names are initialized
        before analyzing names, because class bindings aren't
        visible in methods.  For other blocks, they are initialized
        after names are analyzed.
        */

        /* TODO(jhylton): Package these dicts in a struct so that we
        can write reasonable helper functions?
        */
        const newglobal = new Set<string>();
        const newfree = new Set<string>();
        const newbound = new Set<string>();

        /* Class namespace has no effect on names visible in
        nested functions, so populate the global and bound
        sets to be passed to child blocks before analyzing
        this one.
        */
        if (this.blockType === BlockType.ClassBlock) {
            /* Pass down known globals */
            inplaceMerge(newglobal, global);

            /* Pass down previously bound symbols */
            if (bound) {
                inplaceMerge(newbound, bound);
            }
        }

        for (const name in this.symbols) {
            const flags = this.symbols[name];
            this.analyzeName(scopes, name, flags, bound, local, free, global);
        }

        /* Populate global and bound sets to be passed to children. */
        if (this.blockType !== BlockType.ClassBlock) {
            /* Add function locals to bound set */
            if (this.blockType === BlockType.FunctionBlock) {
                inplaceMerge(newbound, local);
            }
            /* Pass down previously bound symbols */
            if (bound) {
                inplaceMerge(newbound, bound);
            }
            /* Pass down known globals */
            inplaceMerge(newglobal, global);
        } else {
            /* Special-case __class__ */
            newbound.add("__class__");
        }

        /* Recursively call analyze_child_block() on each child block.
        newbound, newglobal now contain the names visible in
        nested blocks.  The free variables in the children will
        be collected in allfree.
        */
        const allfree = new Set<string>();
        for (const entry of this.children || []) {
            entry.analyzeChildBlock(newbound, newfree, newglobal, allfree);
            if (entry.hasFree || entry.childHasFree) {
                this.childHasFree = true;
            }
        }

        inplaceMerge(newfree, allfree);

        /* Check if any local variables must be converted to cell variables */
        if (this.blockType === BlockType.FunctionBlock) {
            this.analyzeCells(scopes, newfree);
        } else if (this.blockType === BlockType.ClassBlock) {
            this.dropClassFree(newfree);
        }

        /* Records the results of the analysis in the symbol table entry */
        this.updateSymbols(scopes, bound, newfree, this.blockType === BlockType.ClassBlock);

        inplaceMerge(free, newfree);
    }
}
