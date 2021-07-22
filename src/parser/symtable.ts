import type {
    AST,
    BinOp,
    BoolOp,
    ClassDef,
    expr,
    FunctionDef,
    Lambda,
    Name,
    NamedExpr,
    stmt,
    UnaryOp,
    IfExp,
    Set as Set_,
    Dict,
    arguments_,
    Yield,
    YieldFrom,
    Await,
    Compare,
    Call,
    JoinedStr,
    FormattedValue,
    Attribute,
    Subscript,
    Starred,
    Slice,
    List,
    Tuple,
    arg,
    keyword,
    GeneratorExp,
    comprehension,
    ListComp,
    SetComp,
    DictComp,
    Return,
    Delete,
    Assign,
    AnnAssign,
    AsyncFor,
    AsyncWith,
    AsyncFunctionDef,
    With,
    Expr,
    Nonlocal,
    Global,
    Assert,
    Try,
    Raise,
    If,
    While,
    For,
    AugAssign,
    Import,
    alias,
    ImportFrom,
    withitem,
    ExceptHandler,
    mod,
    Module,
    Expression,
    Interactive,
} from "../ast/astnodes.ts";
import { ASTKind, Load } from "../ast/astnodes.ts";
import { pySyntaxError } from "../ast/errors.ts";
import { assert } from "./pegen.ts";

export enum BlockType {
    ModuleBlock = "module",
    FunctionBlock = "function",
    ClassBlock = "class",
    AnnotationBlock = "annotation",
}

function append<T>(left: Set<T>, right: Set<T>) {
    for (const v of right.values()) {
        left.add(v);
    }
}

const LEADING_UNDERSCORE_REGEX = /^_+/;

export enum SYMTAB_CONSTS {
    DEF_GLOBAL = 1 /* global stmt */,
    DEF_LOCAL = 2 /* assignment in code block */,
    DEF_PARAM = 2 << 1 /* formal parameter */,
    DEF_NONLOCAL = 2 << 2 /* nonlocal stmt */,
    USE = 2 << 3 /* name is used */,
    DEF_FREE = 2 << 4 /* name used but not defined in nested block */,
    DEF_FREE_CLASS = 2 << 5 /* free variable from class's method */,
    DEF_IMPORT = 2 << 6 /* assignment occurred via import */,
    DEF_ANNOT = 2 << 7 /* this name is annotated */,
    DEF_COMP_ITER = 2 << 8 /* this name is a comprehension iteration variable */,
    DEF_BOUND = DEF_LOCAL | DEF_PARAM | DEF_IMPORT,

    /* GLOBAL_EXPLICIT and GLOBAL_IMPLICIT are used internally by the symbol
       table.  GLOBAL is returned from PyST_GetScope() for either of them.
       It is stored in ste_symbols at bits 12-15.
    */

    SCOPE_OFFSET = 11,
    SCOPE_MASK = DEF_GLOBAL | DEF_LOCAL | DEF_PARAM | DEF_NONLOCAL,
    LOCAL = 1,
    GLOBAL_EXPLICIT = 2,
    GLOBAL_IMPLICIT = 3,
    FREE = 4,
    CELL = 5,
    GENERATOR = 1,
    GENERATOR_EXPRESSION = 2,
}

export class Symbol_ {
    __name: string;
    __flags: number;
    __scope: number;
    __namespaces: SymbolTableScope[] | null = null;
    __module_scope = false;

    constructor(name: string, flags: number, namespaces: SymbolTableScope[] | null = null, moduleScope = false) {
        this.__name = name;
        this.__flags = flags;
        this.__scope = (flags >> SYMTAB_CONSTS.SCOPE_OFFSET) & SYMTAB_CONSTS.SCOPE_MASK; // like PyST_GetScope()
        this.__namespaces = namespaces;
        this.__module_scope = moduleScope;
    }

    get [Symbol.toStringTag]() {
        return '<symbol "' + this.__name + '">';
    }

    get_name() {
        return this.__name;
    }

    is_referenced() {
        return !!(this.__flags & SYMTAB_CONSTS.USE);
    }

    is_parameter() {
        return !!(this.__flags & SYMTAB_CONSTS.DEF_PARAM);
    }

    is_global() {
        /* Return *True* if the symbol is global. */
        return !!(
            [SYMTAB_CONSTS.GLOBAL_IMPLICIT, SYMTAB_CONSTS.GLOBAL_EXPLICIT].includes(this.__scope) ||
            (this.__module_scope && !!(this.__flags & SYMTAB_CONSTS.DEF_BOUND))
        );
    }

    is_nonlocal() {
        return !!(this.__flags & SYMTAB_CONSTS.DEF_NONLOCAL);
    }

    is_declared_global() {
        return !!(this.__scope === SYMTAB_CONSTS.GLOBAL_EXPLICIT);
    }

    is_local() {
        /* Return *True* if the symbol is local. */
        return !!(
            [SYMTAB_CONSTS.LOCAL, SYMTAB_CONSTS.CELL].includes(this.__scope) ||
            (this.__module_scope && this.__flags & SYMTAB_CONSTS.DEF_BOUND)
        );
    }

    is_annotated() {
        return !!(this.__flags & SYMTAB_CONSTS.DEF_ANNOT);
    }

    is_free() {
        return !!(this.__scope === SYMTAB_CONSTS.FREE);
    }

    is_imported() {
        return !!(this.__flags & SYMTAB_CONSTS.DEF_IMPORT);
    }

    is_assigned() {
        return !!(this.__flags & SYMTAB_CONSTS.DEF_LOCAL);
    }

    is_comprehension() {
        return !!(this.__flags & SYMTAB_CONSTS.DEF_COMP_ITER);
    }

    is_namespace() {
        /*
        Returns true if name binding introduces new namespace.

        If the name is used as the target of a function or class
        statement, this will be true.

        Note that a single name can be bound to multiple objects.  If
        is_namespace() is true, the name may also be bound to other
        objects, like an int or list, that does not introduce a new
        namespace.
        */

        return !!this.__namespaces;
    }

    get_namespaces() {
        /* Return a list of namespaces bound to this name */
        return this.__namespaces;
    }

    get_namespace() {
        /*
        Returns the single namespace bound to this name.

        Raises ValueError if the name is bound to multiple namespaces.
        */

        if (this.__namespaces?.length !== 1) {
            throw Error("name is bound to multiple namespaces");
            // todo: This should be a value error maybe
        }

        return this.__namespaces[0];
    }
}

var astScopeCounter = 0;

export class SymbolTableScope {
    name: string;
    varnames: string[];
    children: SymbolTableScope[] | null;
    blockType: BlockType;
    isNested = false;
    hasFree: boolean;
    childHasFree: boolean;
    generator: boolean;
    varargs: boolean;
    varkeywords: boolean;
    returnsValue: boolean;
    filename: string;
    lineno: number;
    colOffset: number;
    endLineno: number | null | undefined;
    endColOffset: number | null | undefined;
    table: SymbolTable;
    symbols: { [name: string]: number };
    _funcLocals: string[] | null = null;
    _funcParams: string[] | null = null;
    _funcGlobals: string[] | null = null;
    _funcNonlocals: string[] | null = null;
    _funcFrees: string[] | null = null;
    _classMethods: string[] | null = null;
    comp_iter_expr = 0;
    comp_iter_target = false;
    comprehension = false;
    directives: [string, number, number][] | null = null;
    coroutine = false;
    needs_class_closure = false;

    constructor(
        table: SymbolTable,
        name: string,
        type: BlockType,
        ast: AST,
        filename: string,
        lineno: number,
        colOffset: number,
        endLineno?: number | null,
        endColOffset?: number | null
    ) {
        this.name = name;
        this.varnames = [];
        this.children = null;
        this.blockType = type;

        this.isNested = false;
        this.hasFree = false;
        this.childHasFree = false; // true if child block has free vars including free refs to globals
        this.generator = false;
        this.varargs = false;
        this.varkeywords = false;
        this.returnsValue = false;

        this.filename = filename;
        this.lineno = lineno;
        this.colOffset = colOffset;
        this.endLineno = endLineno;
        this.endColOffset = endColOffset;

        this.table = table;

        if (table.cur && (table.cur.isNested || table.cur.blockType === BlockType.FunctionBlock)) {
            this.isNested = true;
        }

        ast.scopeId = astScopeCounter++;
        table.stss[ast.scopeId] = this;

        // cache of Symbols for returning to other parts of code
        this.symbols = {};
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

    get_identifiers() {
        return this._identsMatching(function () {
            return true;
        });
    }

    getSymbol(name: string): number {
        return this.symbols[name];
    }

    lookup(name: string): Symbol_ {
        return new Symbol_(name, this.symbols[name], this.__check_children(name));
        // let sym;
        // if (!(name in this.symbols)) {
        //     const flags = this.symFlags[name];
        //     const namespaces = this.__check_children(name);
        //     sym = this.symbols[name] = new Symbol_(name, flags, namespaces);
        // } else {
        //     sym = this.symbols[name];
        // }
        // return sym;
    }

    __check_children(name: string): SymbolTableScope[] | null {
        if (this.children) {
            return this.children.filter((c) => c.name === name);
        }

        return null;
    }

    _identsMatching(f: (flag: number) => boolean): string[] {
        return Object.entries(this.symbols)
            .filter(([_, v]) => f(v))
            .map(([k, _]) => k);
    }

    get_parameters(): string[] {
        assert(this.get_type() === "function", "get_parameters only valid for function scopes");
        if (!this._funcParams) {
            this._funcParams = this._identsMatching((x) => !!(x & SYMTAB_CONSTS.DEF_PARAM));
        }
        return this._funcParams;
    }

    get_locals(): string[] {
        assert(this.get_type() === "function", "get_locals only valid for function scopes");
        if (!this._funcLocals) {
            this._funcLocals = this._identsMatching((x) => !!(x & SYMTAB_CONSTS.DEF_BOUND));
        }
        return this._funcLocals;
    }

    get_globals(): string[] {
        assert(this.get_type() === "function", "get_globals only valid for function scopes");
        if (!this._funcGlobals) {
            this._funcGlobals = this._identsMatching(function (x) {
                var masked = (x >> SYMTAB_CONSTS.SCOPE_OFFSET) & SYMTAB_CONSTS.SCOPE_MASK;
                return masked === SYMTAB_CONSTS.GLOBAL_IMPLICIT || masked === SYMTAB_CONSTS.GLOBAL_EXPLICIT;
            });
        }
        return this._funcGlobals;
    }

    get_nonlocals() {
        if (!this._funcNonlocals) {
            this._funcNonlocals = this._identsMatching((x) => !!(x & SYMTAB_CONSTS.DEF_NONLOCAL));
        }
        return this._funcNonlocals;
    }

    get_frees() {
        assert(this.get_type() === "function", "get_frees only valid for function scopes");
        if (!this._funcFrees) {
            this._funcFrees = this._identsMatching(function (x) {
                var masked = (x >> SYMTAB_CONSTS.SCOPE_OFFSET) & SYMTAB_CONSTS.SCOPE_MASK;
                return masked === SYMTAB_CONSTS.FREE;
            });
        }
        return this._funcFrees;
    }

    get_methods() {
        assert(this.get_type() === "class", "get_methods only valid for class scopes");
        if (!this._classMethods) {
            if (this.children) {
                this._classMethods = this.children.map((c) => c.name).sort();
            }
        }
        return this._classMethods;
    }

    get_scope(name: string): number {
        //print("getScope");
        //for (var k in this.symFlags) print(k);
        var v = this.symbols[name];
        if (v === undefined) {
            return 0;
        }
        return (v >> SYMTAB_CONSTS.SCOPE_OFFSET) & SYMTAB_CONSTS.SCOPE_MASK;
    }

    dropClassFree(free: Set<string>) {
        free.delete("__class__");

        this.needs_class_closure = true;
    }

    errorAtDirective(name: string, errorMessage: string): never {
        assert(this.directives);
        for (const [directiveName, lineno, colOffset] of this.directives) {
            if (directiveName === name) {
                throw new pySyntaxError(errorMessage, [this.filename, lineno, colOffset, ""]);
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
        scopes: { [name: string]: number },
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
            if (bound.has(name)) {
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
        const tempBound = new Set(bound);
        const tempFree = new Set(free);
        const tempGlobal = new Set(global);

        this.analyzeBlock(tempBound, tempFree, tempGlobal);

        append(childFree, tempFree);
    }

    analyzeCells(scopes: { [name: string]: number }, free: Set<string>) {
        for (const [name, scope] of Object.entries(scopes)) {
            if (scope != SYMTAB_CONSTS.LOCAL) {
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

    updateSymbols(
        scopes: { [name: string]: number },
        bound: Set<string> | null,
        free: Set<string>,
        classFlag: boolean
    ) {
        /* Update scope information for all symbols in this scope */
        for (let [name, flags] of Object.entries(this.symbols)) {
            flags |= scopes[name] << SYMTAB_CONSTS.SCOPE_OFFSET;
            this.symbols[name] = flags;
        }

        /* Record not yet resolved free variables from children (if any) */
        const vFree = SYMTAB_CONSTS.FREE << SYMTAB_CONSTS.SCOPE_OFFSET;

        for (const name in free) {
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
            append(newglobal, global);

            /* Pass down previously bound symbols */
            if (bound) {
                append(newbound, bound);
            }
        }

        for (const [name, flags] of Object.entries(this.symbols)) {
            this.analyzeName(scopes, name, flags, bound, local, free, global);
        }

        /* Populate global and bound sets to be passed to children. */
        if (this.blockType !== BlockType.ClassBlock) {
            /* Add function locals to bound set */
            if (this.blockType === BlockType.FunctionBlock) {
                append(newbound, local);
            }
            /* Pass down previously bound symbols */
            if (bound) {
                append(newbound, bound);
            }
            /* Pass down known globals */
            append(newglobal, global);
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

        append(newfree, allfree);

        /* Check if any local variables must be converted to cell variables */
        if (this.blockType === BlockType.FunctionBlock) {
            this.analyzeCells(scopes, newfree);
        } else if (this.blockType === BlockType.ClassBlock) {
            this.dropClassFree(newfree);
        }

        /* Records the results of the analysis in the symbol table entry */
        this.updateSymbols(scopes, bound, newfree, this.blockType === BlockType.ClassBlock);

        append(free, newfree);
    }
}

function mangle(privateobj: string | null, ident: string) {
    /* Name mangling: __private becomes _classname__private.
       This is independent from how the name is used. */
    if (privateobj === null /* !PyUnicode_Check(privateobj) || */ || !ident.startsWith("__")) {
        return ident;
    }
    /* Don't mangle __id__ or names with dots.
          The only time a name with a dot can occur is when
          we are compiling an import statement that has a
          package name.
          TODO(jhylton): Decide whether we want to support
          mangling of the module name, e.g. __M.X.
       */
    if (ident.endsWith("__") || ident.indexOf(".") !== -1) {
        return ident; /* Don't mangle __whatever__ */
    }

    /* Strip leading underscores from class name */
    const stripped = privateobj.replace(LEADING_UNDERSCORE_REGEX, "");
    if (stripped.length === 0) {
        return ident; /* Don't mangle if class is just underscores */
    }

    /* ident = "_" + priv[ipriv:] + ident # i.e. 1+plen+nlen bytes */
    return `_${stripped}${ident}`;
}

export class SymbolTable {
    filename: string;
    cur: SymbolTableScope | null = null;
    top: SymbolTableScope | null = null;
    stack: SymbolTableScope[] = [];
    global: { [name: string]: number } = {};
    curClass: string | null = null;
    tmpname = 0;

    stss: { [scopeId: number]: SymbolTableScope } = {};

    constructor(filename: string, _future: any) {
        this.filename = filename;
    }

    get private() {
        return this.curClass;
    }

    getStsForAst(ast: AST) {
        var v;
        assert(ast.scopeId !== undefined, "ast wasn't added to st?");
        v = this.stss[ast.scopeId];
        assert(v !== undefined, "unknown sym tab entry");
        return v;
    }

    addDef(name: string, flag: SYMTAB_CONSTS, ste: SymbolTableScope | null = null) {
        const curSte = ste || this.cur;
        assert(curSte !== null, "need to know what we're operating on");

        const mangled = mangle(this.private, name);
        let val = curSte.symbols[mangled];
        if (val !== undefined) {
            if (flag & SYMTAB_CONSTS.DEF_PARAM && val & SYMTAB_CONSTS.DEF_PARAM) {
                throw new pySyntaxError("duplicate argument '" + name + "' in function definition", [
                    this.filename,
                    curSte.lineno,
                    curSte.colOffset,
                    "",
                ]);
            }
            val |= flag;
        } else {
            val = flag;
        }

        if (curSte.comp_iter_target) {
            /* This name is an iteration variable in a comprehension,
             * so check for a binding conflict with any named expressions.
             * Otherwise, mark it as an iteration variable so subsequent
             * named expressions can check for conflicts.
             */
            if (val & (SYMTAB_CONSTS.DEF_GLOBAL | SYMTAB_CONSTS.DEF_NONLOCAL)) {
                // @stu no end line and end coloffset in syntax err??
                throw new pySyntaxError(
                    `comprehension inner loop cannot rebind assignment expression target '${name}'`,
                    [this.filename, curSte.lineno, curSte.colOffset, ""]
                );
            }
            val |= SYMTAB_CONSTS.DEF_COMP_ITER;
        }

        curSte.symbols[mangled] = val;

        if (flag & SYMTAB_CONSTS.DEF_PARAM) {
            curSte.varnames.push(mangled);
        } else if (flag & SYMTAB_CONSTS.DEF_GLOBAL) {
            val = flag;
            const fromGlobal = this.global[mangled];
            if (fromGlobal !== undefined) {
                val |= fromGlobal;
            }
            this.global[mangled] = val;
        }
    }

    SEQTail<T>(visitor: (elem: T) => void, nodes: T[], start: number) {
        for (const node of nodes.slice(start)) {
            if (node) {
                visitor.call(this, node);
            }
        }
    }

    SEQ<T>(visitor: (node: T) => void, nodes: (T | null)[]) {
        assert(Array.isArray(nodes), "SEQ: nodes isn't array? got " + nodes.toString());
        for (const node of nodes) {
            if (node) {
                visitor.call(this, node);
            }
        }
    }

    recordDirective(name: string, lineno: number, colOffset: number) {
        assert(this.cur !== null);

        if (!this.cur.directives) {
            this.cur.directives = [];
        }

        const mangled = mangle(this.private, name);

        this.cur.directives.push([mangled, lineno, colOffset]);
    }

    extendNamedexprScope(e: Name) {
        assert(this.stack);
        assert(e._kind === ASTKind.Name);

        const targetName = e.id;

        /* Iterate over the stack in reverse and add to the nearest adequate scope */
        for (const ste of this.stack) {
            /* If we find a comprehension scope, check for a target
             * binding conflict with iteration variables, otherwise skip it
             */
            if (ste.comprehension) {
                const targetInScope = ste.getSymbol(targetName);
                if (targetInScope & SYMTAB_CONSTS.DEF_COMP_ITER) {
                    throw new pySyntaxError(
                        `assignment expression cannot rebind comprehension iteration variable '${targetName}'`,
                        [this.filename, e.lineno, e.col_offset, ""]
                    );
                }
                continue;
            }

            /* If we find a BlockType.FunctionBlock entry, add as GLOBAL/LOCAL or NONLOCAL/LOCAL */
            if (ste.blockType === BlockType.FunctionBlock) {
                const targetInScope = ste.getSymbol(targetName);
                if (targetInScope & SYMTAB_CONSTS.DEF_GLOBAL) {
                    this.addDef(targetName, SYMTAB_CONSTS.DEF_GLOBAL);
                } else {
                    this.addDef(targetName, SYMTAB_CONSTS.DEF_NONLOCAL);
                }
                this.recordDirective(targetName, e.lineno, e.col_offset);
                return this.addDef(targetName, SYMTAB_CONSTS.DEF_LOCAL, ste);
            }
            /* If we find a BlockType.ModuleBlock entry, add as GLOBAL */
            if (ste.blockType === BlockType.ModuleBlock) {
                this.addDef(targetName, SYMTAB_CONSTS.DEF_GLOBAL);
                this.recordDirective(targetName, e.lineno, e.col_offset);
                return this.addDef(targetName, SYMTAB_CONSTS.DEF_GLOBAL, ste);
            }
            /* Disallow usage in BlockType.ClassBlock */
            if (ste.blockType === BlockType.ClassBlock) {
                throw new pySyntaxError(
                    "assignment expression within a comprehension cannot be used in a class body",
                    [this.filename, e.lineno, e.col_offset, ""]
                );
            }
        }

        assert(
            0,
            "We should always find either a BlockType.FunctionBlock, BlockType.ModuleBlock or BlockType.ClassBlock and should never fall to this case"
        );
    }

    handleNamedExpr(e: NamedExpr) {
        assert(this.cur !== null, "need current scope for namedExpr");
        if (this.cur.comp_iter_expr > 0) {
            // @todo -- needs line number etc
            throw new pySyntaxError("Assignment isn't allowed in a comprehension iterable expression", [
                this.filename,
                e.lineno,
                e.col_offset,
                "",
            ]);
        }
        if (this.cur.comprehension) {
            /* Inside a comprehension body, so find the right target scope */
            this.extendNamedexprScope(e.target as Name);
        }
        this.visitExpr(e.value);
        this.visitExpr(e.target);
    }

    enterBlock(
        name: string,
        block: BlockType,
        ast: AST,
        lineno: number,
        colOffset: number,
        endLineno?: number | null,
        endColOffset?: number | null
    ) {
        const ste = new SymbolTableScope(
            this,
            name,
            block,
            ast,
            this.filename,
            lineno,
            colOffset,
            endLineno,
            endColOffset
        );
        this.stack.push(ste);
        const prev = this.cur;

        /* bpo-37757: For now, disallow *all* assignment expressions in the
         * outermost iterator expression of a comprehension, even those inside
         * a nested comprehension or a lambda expression.
         */
        if (prev) {
            ste.comp_iter_expr = prev.comp_iter_expr;
        }

        this.cur = ste;

        /* Annotation blocks shouldn't have any affect on the symbol table since in
         * the compilation stage, they will all be transformed to strings. They are
         * only created if future 'annotations' feature is activated. */
        if (block === BlockType.AnnotationBlock) {
            return;
        }

        if (block === BlockType.ModuleBlock) {
            this.global = this.cur.symbols;
        }

        if (prev) {
            if (prev.children) {
                prev.children.push(ste);
            } else {
                prev.children = [ste];
            }
        }
    }

    exitBlock() {
        this.cur = null;
        if (this.stack.length > 0) {
            this.cur = this.stack.pop() || null;
        }
    }

    implicitArg(pos: number) {
        this.addDef(`.${pos}`, SYMTAB_CONSTS.DEF_PARAM);
    }

    handleComprehension(
        e: GeneratorExp | ListComp | SetComp | DictComp,
        scopeName: string,
        generators: comprehension[],
        elt: expr,
        value: expr | null
    ) {
        assert(this.cur);
        const isGenerator = e._kind === ASTKind.GeneratorExp;
        const outermost = generators[0];
        /* Outermost iterator is evaluated in current scope */
        this.cur.comp_iter_expr++;
        this.visitExpr(outermost.iter);

        /* Create comprehension scope for the rest */
        this.enterBlock(scopeName, BlockType.FunctionBlock, e, e.lineno, e.col_offset, e.end_lineno, e.end_col_offset);

        if (outermost.is_async) {
            this.cur.coroutine = true;
        }

        this.cur.comprehension = true;

        /* Outermost iter is received as an argument */
        this.implicitArg(0);

        /* Visit iteration variable target, and mark them as such */
        this.cur.comp_iter_target = true;
        this.visitExpr(outermost.target);
        this.cur.comp_iter_target = false;

        /* Visit the rest of the comprehension body */
        this.SEQ(this.visitExpr, outermost.ifs);
        this.SEQTail(this.visitComprehension, generators, 1);
        if (value) {
            this.visitExpr(value);
        }

        this.visitExpr(elt);

        if (this.cur.generator) {
            throw new pySyntaxError(
                e._kind === ASTKind.ListComp
                    ? "'yield' inside list comprehension"
                    : e._kind === ASTKind.SetComp
                    ? "'yield' inside set comprehension"
                    : e._kind === ASTKind.DictComp
                    ? "'yield' inside dict comprehension"
                    : "'yield' inside generator expression",
                [this.filename, e.lineno, e.col_offset, ""]
            );
        }

        this.cur.generator = isGenerator;
        const isAsync = this.cur.coroutine && !isGenerator;
        this.exitBlock();
        if (isAsync) {
            this.cur.coroutine = true;
        }
    }

    visitKeyword(k: keyword) {
        this.visitExpr(k.value);
    }

    visitGenexp(e: GeneratorExp) {
        return this.handleComprehension(e, "genexpr", e.generators, e.elt, null);
    }

    visitListcomp(e: ListComp) {
        return this.handleComprehension(e, "listcomp", e.generators, e.elt, null);
    }

    visitSetcomp(e: SetComp) {
        return this.handleComprehension(e, "setcomp", e.generators, e.elt, null);
    }

    visitDictcomp(e: DictComp) {
        return this.handleComprehension(e, "dictcomp", e.generators, e.key, e.value);
    }

    visitComprehension(lc: comprehension) {
        assert(this.cur);
        this.cur.comp_iter_target = true;
        this.visitExpr(lc.target);
        this.cur.comp_iter_target = false;
        this.cur.comp_iter_expr++;
        this.visitExpr(lc.iter);
        this.cur.comp_iter_expr--;
        this.SEQ(this.visitExpr, lc.ifs);
        if (lc.is_async) {
            this.cur.coroutine = true;
        }
    }

    visitExpr(e: expr) {
        switch (e._kind) {
            case ASTKind.NamedExpr:
                this.handleNamedExpr(e as NamedExpr);
                break;
            case ASTKind.BoolOp:
                this.SEQ(this.visitExpr, (e as BoolOp).values);
                break;
            case ASTKind.BinOp: {
                const binOp = e as BinOp;
                this.visitExpr(binOp.left);
                this.visitExpr(binOp.right);
                break;
            }
            case ASTKind.UnaryOp:
                this.visitExpr((e as UnaryOp).operand);
                break;
            case ASTKind.Lambda: {
                const lambda = e as Lambda;
                if (lambda.args.defaults) {
                    this.SEQ(this.visitExpr, lambda.args.defaults);
                }
                if (lambda.args.kw_defaults) {
                    this.SEQ(this.visitExpr, lambda.args.kw_defaults);
                }
                this.enterBlock(
                    "lambda",
                    BlockType.FunctionBlock,
                    lambda,
                    e.lineno,
                    e.col_offset,
                    e.end_lineno,
                    e.end_col_offset
                );
                this.visitArguments(lambda.args);
                this.visitExpr(lambda.body);
                this.exitBlock();
                break;
            }
            case ASTKind.IfExp: {
                const ifExp = e as IfExp;
                this.visitExpr(ifExp.test);
                this.visitExpr(ifExp.body);
                this.visitExpr(ifExp.body);
                break;
            }
            case ASTKind.Dict: {
                const dict = e as Dict;
                this.SEQ(this.visitExpr, dict.keys);
                this.SEQ(this.visitExpr, dict.values);
                break;
            }
            case ASTKind.Set:
                this.SEQ(this.visitExpr, (e as Set_).elts);
                break;
            case ASTKind.GeneratorExp:
                this.visitGenexp(e as GeneratorExp);
                break;
            case ASTKind.ListComp:
                this.visitListcomp(e as ListComp);
                break;
            case ASTKind.SetComp:
                this.visitSetcomp(e as SetComp);
                break;
            case ASTKind.DictComp:
                this.visitDictcomp(e as DictComp);
                break;
            case ASTKind.Yield: {
                assert(this.cur !== null);
                const yield_ = e as Yield;
                if (yield_.value) {
                    this.visitExpr(yield_.value);
                }
                this.cur.generator = true;
                break;
            }
            case ASTKind.YieldFrom:
                assert(this.cur !== null);
                this.visitExpr((e as YieldFrom).value);
                this.cur.generator = true;
                break;
            case ASTKind.Await:
                assert(this.cur !== null);
                this.visitExpr((e as Await).value);
                this.cur.coroutine = true;
                break;
            case ASTKind.Compare: {
                const compare = e as Compare;
                this.visitExpr(compare.left);
                this.SEQ(this.visitExpr, compare.comparators);
                break;
            }
            case ASTKind.Call: {
                const call = e as Call;
                this.visitExpr(call.func);
                this.SEQ(this.visitExpr, call.args);
                this.SEQ(this.visitExpr, call.keywords);
                break;
            }
            case ASTKind.FormattedValue: {
                const formattedValue = e as FormattedValue;
                this.visitExpr(formattedValue.value);
                if (formattedValue.format_spec) {
                    this.visitExpr(formattedValue.format_spec);
                }
                break;
            }
            case ASTKind.JoinedStr: {
                this.SEQ(this.visitExpr, (e as JoinedStr).values);
                break;
            }
            case ASTKind.Constant:
                /* Nothing to do here. */
                break;
            /* The following exprs can be assignment targets. */
            case ASTKind.Attribute:
                this.visitExpr((e as Attribute).value);
                break;
            case ASTKind.Subscript: {
                const subscript = e as Subscript;
                this.visitExpr(subscript.value);
                this.visitExpr(subscript.slice);
                break;
            }
            case ASTKind.Starred:
                this.visitExpr((e as Starred).value);
                break;
            case ASTKind.Slice: {
                const slice = e as Slice;
                if (slice.lower) {
                    this.visitExpr(slice.lower);
                }
                if (slice.upper) {
                    this.visitExpr(slice.upper);
                }
                if (slice.step) {
                    this.visitExpr(slice.step);
                }
                break;
            }
            case ASTKind.Name: {
                assert(this.cur);
                const name = e as Name;
                this.addDef(name.id, name.ctx === Load ? SYMTAB_CONSTS.USE : SYMTAB_CONSTS.DEF_LOCAL);
                /* Special-case super: it counts as a use of __class__ */
                if (name.ctx === Load && this.cur.blockType === BlockType.FunctionBlock && name.id === "super") {
                    this.addDef("__class__", SYMTAB_CONSTS.USE);
                }
                break;
            }
            /* child nodes of List and Tuple will have expr_context set */
            case ASTKind.List:
                this.SEQ(this.visitExpr, (e as List).elts);
                break;
            case ASTKind.Tuple:
                this.SEQ(this.visitExpr, (e as Tuple).elts);
                break;
        }
    }

    visitParams(args: arg[]) {
        for (const a of args) {
            this.addDef(a.arg, SYMTAB_CONSTS.DEF_PARAM);
        }
    }

    visitArguments(a: arguments_) {
        /* skip default arguments inside function block
        XXX should ast be different?
        */
        if (a.posonlyargs) {
            this.visitParams(a.posonlyargs);
        }

        if (a.args) {
            this.visitParams(a.args);
        }
        if (a.kwonlyargs) {
            this.visitParams(a.kwonlyargs);
        }

        if (a.vararg) {
            assert(this.cur !== null);
            this.addDef(a.vararg.arg, SYMTAB_CONSTS.DEF_PARAM);
            this.cur.varargs = true;
        }

        if (a.kwarg) {
            assert(this.cur !== null);
            this.addDef(a.kwarg.arg, SYMTAB_CONSTS.DEF_PARAM);
            this.cur.varkeywords = true;
        }
    }

    visitArgannotations(args: arg[]) {
        for (const a of args) {
            if (a.annotation) {
                this.visitExpr(a.annotation);
            }
        }
    }

    visitAnnotation(annotation: expr) {
        // int future_annotations = st->st_future->ff_features & CO_FUTURE_ANNOTATIONS;
        // if (future_annotations &&
        //     !symtable_enter_block(st, GET_IDENTIFIER(_annotation), AnnotationBlock,
        //                           (void *)annotation, annotation->lineno,
        //                           annotation->col_offset, annotation->end_lineno,
        //                           annotation->end_col_offset)) {
        //     VISIT_QUIT(st, 0);
        // }
        this.visitExpr(annotation);
        // if (future_annotations && !symtable_exit_block(st)) {
        //     VISIT_QUIT(st, 0);
        // }
    }

    visitAnnotations(a: arguments_, returns: expr | null) {
        // int future_annotations = st->st_future->ff_features & CO_FUTURE_ANNOTATIONS;
        // if (future_annotations &&
        //     !symtable_enter_block(st, GET_IDENTIFIER(_annotation), AnnotationBlock,
        //                           (void *)o, o->lineno, o->col_offset, o->end_lineno,
        //                           o->end_col_offset)) {
        //     VISIT_QUIT(st, 0);
        // }
        if (a.posonlyargs) {
            this.visitArgannotations(a.posonlyargs);
        }
        if (a.args) {
            this.visitArgannotations(a.args);
        }
        if (a.vararg && a.vararg.annotation) {
            this.visitExpr(a.vararg.annotation);
        }
        if (a.kwarg && a.kwarg.annotation) {
            this.visitExpr(a.kwarg.annotation);
        }
        if (a.kwonlyargs) {
            this.visitArgannotations(a.kwonlyargs);
        }
        // if (future_annotations && !symtable_exit_block(st)) {
        //     VISIT_QUIT(st, 0);
        // }
        if (returns) {
            this.visitAnnotation(returns);
        }
    }

    lookup(id: string) {
        assert(this.cur);
        const mangled = mangle(this.private, id);
        return this.cur.getSymbol(mangled);
    }

    visitAlias(a: alias) {
        /* Compute storeName, the name actually bound by the import
           operation.  It is different than a->name when a->name is a
           dotted package name (e.g. spam.eggs)
        */
        const name = a.asname === null ? a.name : a.asname;
        const dot = name.indexOf(".");
        let storeName = null;

        if (dot !== -1) {
            storeName = name.substring(0, dot);
        } else {
            storeName = name;
        }
        if (name !== "*") {
            this.addDef(storeName, SYMTAB_CONSTS.DEF_IMPORT);
        } else {
            assert(this.cur);
            if (this.cur.blockType !== BlockType.ModuleBlock) {
                throw new pySyntaxError("import * only allowed at module level", [
                    this.filename,
                    this.cur.lineno,
                    this.cur.colOffset,
                    "",
                ]);
            }
        }
    }

    visitWithItem(item: withitem) {
        this.visitExpr(item.context_expr);
        if (item.optional_vars) {
            this.visitExpr(item.optional_vars);
        }
    }

    visitExcepthandler(eh: ExceptHandler) {
        if (eh.type) {
            this.visitExpr(eh.type);
        }
        if (eh.name) {
            this.addDef(eh.name, SYMTAB_CONSTS.DEF_LOCAL);
        }
        this.SEQ(this.visitStmt, eh.body);
    }

    visitStmt(s: stmt) {
        assert(s !== undefined, "visitStmt called with undefined");
        switch (s._kind) {
            case ASTKind.FunctionDef: {
                const funcDef = s as FunctionDef;
                this.addDef(funcDef.name, SYMTAB_CONSTS.DEF_LOCAL);
                if (funcDef.args.defaults) {
                    this.SEQ(this.visitExpr, funcDef.args.defaults);
                }
                if (funcDef.decorator_list) {
                    this.SEQ(this.visitExpr, funcDef.decorator_list);
                }
                this.visitAnnotations(funcDef.args, funcDef.returns);
                this.enterBlock(funcDef.name, BlockType.FunctionBlock, s, s.lineno, s.col_offset);
                this.visitArguments(funcDef.args);
                this.SEQ(this.visitStmt, funcDef.body);
                this.exitBlock();
                break;
            }
            case ASTKind.ClassDef: {
                const classDef = s as ClassDef;
                this.addDef(classDef.name, SYMTAB_CONSTS.DEF_LOCAL);
                this.SEQ(this.visitExpr, classDef.bases);
                this.SEQ(this.visitKeyword, classDef.keywords);
                if (classDef.decorator_list) {
                    this.SEQ(this.visitExpr, classDef.decorator_list);
                }
                this.enterBlock(
                    classDef.name,
                    BlockType.ClassBlock,
                    classDef,
                    classDef.lineno,
                    classDef.col_offset,
                    classDef.end_lineno,
                    classDef.end_col_offset
                );
                const tmp = this.curClass;
                this.curClass = classDef.name;
                this.SEQ(this.visitStmt, classDef.body);
                this.curClass = tmp;
                this.exitBlock();
                break;
            }
            case ASTKind.Return: {
                assert(this.cur);
                const return_ = s as Return;
                if (return_.value) {
                    this.visitExpr(return_.value);
                    this.cur.returnsValue = true;
                }
                break;
            }
            case ASTKind.Delete:
                this.SEQ(this.visitExpr, (s as Delete).targets);
                break;
            case ASTKind.Assign: {
                const assign = s as Assign;
                this.SEQ(this.visitExpr, assign.targets);
                this.visitExpr(assign.value);
                break;
            }
            case ASTKind.AnnAssign: {
                const annAssign = s as AnnAssign;
                if (annAssign.target._kind === ASTKind.Name) {
                    assert(this.cur);
                    const eName = annAssign.target as Name;
                    const cur = this.lookup(eName.id);
                    if (
                        cur & (SYMTAB_CONSTS.DEF_GLOBAL | SYMTAB_CONSTS.DEF_NONLOCAL) &&
                        this.cur.symbols !== this.global &&
                        annAssign.simple
                    ) {
                        throw new pySyntaxError(
                            cur & SYMTAB_CONSTS.DEF_GLOBAL
                                ? `annotated name '${eName.id}' can't be global`
                                : `annotated name '${eName.id}' can't be nonlocal`,
                            [this.filename, s.lineno, s.col_offset, ""]
                        );
                    }

                    if (annAssign.simple) {
                        this.addDef(eName.id, SYMTAB_CONSTS.DEF_ANNOT | SYMTAB_CONSTS.DEF_LOCAL);
                    } else if (annAssign.value) {
                        this.addDef(eName.id, SYMTAB_CONSTS.DEF_LOCAL);
                    }
                } else {
                    this.visitExpr(annAssign.target);
                }

                this.visitExpr(annAssign.annotation);
                if (annAssign.value) {
                    this.visitExpr(annAssign.value);
                }
                break;
            }
            case ASTKind.AugAssign: {
                const augAssign = s as AugAssign;

                this.visitExpr(augAssign.target);
                this.visitExpr(augAssign.value);
                break;
            }
            case ASTKind.For: {
                const for_ = s as For;

                this.visitExpr(for_.target);
                this.visitExpr(for_.iter);
                this.SEQ(this.visitStmt, for_.body);
                if (for_.orelse) this.SEQ(this.visitStmt, for_.orelse);
                break;
            }
            case ASTKind.While: {
                const while_ = s as While;

                this.visitExpr(while_.test);
                this.SEQ(this.visitStmt, while_.body);
                if (while_.orelse) this.SEQ(this.visitStmt, while_.orelse);
                break;
            }
            case ASTKind.If: {
                const if_ = s as If;

                /* XXX if 0: and lookup_yield() hacks */
                this.visitExpr(if_.test);
                this.SEQ(this.visitStmt, if_.body);
                if (if_.orelse) this.SEQ(this.visitStmt, if_.orelse);
                break;
            }
            case ASTKind.Raise: {
                const raise = s as Raise;

                if (raise.exc) {
                    this.visitExpr(raise.exc);
                    if (raise.cause) {
                        this.visitExpr(raise.cause);
                    }
                }
                break;
            }
            case ASTKind.Try: {
                const try_ = s as Try;

                this.SEQ(this.visitStmt, try_.body);
                this.SEQ(this.visitStmt, try_.orelse);
                this.SEQ(
                    this.visitExcepthandler,
                    try_.handlers as ExceptHandler[]
                ); /** @todo Update adsl to make `handlers` of type ExceptHandler[] */
                this.SEQ(this.visitStmt, try_.finalbody);
                break;
            }
            case ASTKind.Assert: {
                const assert = s as Assert;
                this.visitExpr(assert.test);
                if (assert.msg) {
                    this.visitExpr(assert.msg);
                }
                break;
            }
            case ASTKind.Import: {
                const import_ = s as Import;
                this.SEQ(this.visitAlias, import_.names);
                break;
            }
            case ASTKind.ImportFrom: {
                const importFrom = s as ImportFrom;
                this.SEQ(this.visitAlias, importFrom.names);
                break;
            }
            case ASTKind.Global: {
                const global = s as Global;

                for (const name of global.names) {
                    const cur = this.lookup(name);
                    if (
                        cur &
                        (SYMTAB_CONSTS.DEF_PARAM |
                            SYMTAB_CONSTS.DEF_LOCAL |
                            SYMTAB_CONSTS.USE |
                            SYMTAB_CONSTS.DEF_ANNOT)
                    ) {
                        let msg = "";
                        if (cur & SYMTAB_CONSTS.DEF_PARAM) {
                            msg = `name '${name}' is parameter and global`;
                        } else if (cur & SYMTAB_CONSTS.USE) {
                            msg = `name '${name}' is used prior to global declaration`;
                        } else if (cur & SYMTAB_CONSTS.DEF_ANNOT) {
                            msg = `annotated name '${name}' can't be global`;
                        } else {
                            msg = `name '${name}' is assigned to before global declaration`;
                        }

                        throw new pySyntaxError(msg, [this.filename, s.lineno, s.col_offset, ""]);
                    }
                    this.addDef(name, SYMTAB_CONSTS.DEF_GLOBAL);
                    this.recordDirective(name, s.lineno, s.col_offset);
                }
                break;
            }
            case ASTKind.Nonlocal: {
                const nonlolal = s as Nonlocal;

                for (const name of nonlolal.names) {
                    const cur = this.lookup(name);
                    if (
                        cur &
                        (SYMTAB_CONSTS.DEF_PARAM |
                            SYMTAB_CONSTS.DEF_LOCAL |
                            SYMTAB_CONSTS.USE |
                            SYMTAB_CONSTS.DEF_ANNOT)
                    ) {
                        let msg = "";
                        if (cur & SYMTAB_CONSTS.DEF_PARAM) {
                            msg = `name '${name}' is parameter and nonlocal`;
                        } else if (cur & SYMTAB_CONSTS.USE) {
                            msg = `name '${name}' is used prior to nonlocal declaration`;
                        } else if (cur & SYMTAB_CONSTS.DEF_ANNOT) {
                            msg = `annotated name '${name}' can't be nonlocal`;
                        } else {
                            msg = `name '${name}' is assigned to before nonlocal declaration`;
                        }

                        throw new pySyntaxError(msg, [this.filename, s.lineno, s.col_offset, ""]);
                    }
                    this.addDef(name, SYMTAB_CONSTS.DEF_NONLOCAL);
                    this.recordDirective(name, s.lineno, s.col_offset);
                }
                break;
            }
            case ASTKind.Expr: {
                this.visitExpr((s as Expr).value);
                break;
            }
            case ASTKind.Pass:
            case ASTKind.Break:
            case ASTKind.Continue:
                /* nothing to do here */
                break;
            case ASTKind.With: {
                const with_ = s as With;
                this.SEQ(this.visitWithItem, with_.items);
                this.SEQ(this.visitStmt, with_.body);
                break;
            }
            case ASTKind.AsyncFunctionDef: {
                assert(this.cur);
                const asyncFunctionDef = s as AsyncFunctionDef;

                this.addDef(asyncFunctionDef.name, SYMTAB_CONSTS.DEF_LOCAL);
                if (asyncFunctionDef.args.defaults) {
                    this.SEQ(this.visitExpr, asyncFunctionDef.args.defaults);
                }
                if (asyncFunctionDef.args.kw_defaults) {
                    this.SEQ(this.visitExpr, asyncFunctionDef.args.kw_defaults);
                }
                this.visitAnnotations(asyncFunctionDef.args, asyncFunctionDef.returns);

                if (asyncFunctionDef.decorator_list) this.SEQ(this.visitExpr, asyncFunctionDef.decorator_list);

                this.enterBlock(
                    asyncFunctionDef.name,
                    BlockType.FunctionBlock,
                    asyncFunctionDef,
                    s.lineno,
                    s.col_offset
                );

                this.cur.coroutine = true;

                this.visitArguments(asyncFunctionDef.args);
                this.SEQ(this.visitStmt, asyncFunctionDef.body);
                this.exitBlock();
                break;
            }
            case ASTKind.AsyncWith: {
                const asyncWith = s as AsyncWith;
                this.SEQ(this.visitWithItem, asyncWith.items);
                this.SEQ(this.visitStmt, asyncWith.body);
                break;
            }
            case ASTKind.AsyncFor: {
                const asyncFor = s as AsyncFor;
                this.visitExpr(asyncFor.target);
                this.visitExpr(asyncFor.iter);
                this.SEQ(this.visitStmt, asyncFor.body);
                if (asyncFor.orelse) this.SEQ(this.visitStmt, asyncFor.orelse);
                break;
            }
            default:
                assert(false, "Unhandled type " + s.constructor.name + " in visitStmt");
        }
    }

    analyze() {
        assert(this.top);
        const free = new Set<string>();
        const global = new Set<string>();
        this.top.analyzeBlock(null, free, global);
    }
}

export function buildSymbolTable(mod: mod, filename: string, future: any): SymbolTable {
    const st = new SymbolTable(filename, future);
    /* Make the initial symbol information gathering pass */
    st.enterBlock("top", BlockType.ModuleBlock, mod, 0, 0);
    st.top = st.cur;
    switch (mod._kind) {
        case ASTKind.Module: {
            st.SEQ(st.visitStmt, (mod as Module).body);
            break;
        }
        case ASTKind.Expression: {
            st.visitExpr((mod as Expression).body);
            break;
        }
        case ASTKind.Interactive: {
            st.SEQ(st.visitStmt, (mod as Interactive).body);
            break;
        }
        case ASTKind.FunctionType:
            throw new Error("this compiler does not handle FunctionTypes");
    }
    st.exitBlock();
    /* Make the second symbol analysis pass */
    st.analyze();

    return st;
}

// Sk.dumpSymtab = function (st) {
//     var pyBoolStr = function (b) {
//         return b ? "True" : "False";
//     }
//     var pyList = function (l) {
//         var i;
//         var ret = [];
//         for (i = 0; i < l.length; ++i) {
//             ret.push(new Sk.builtin.str(l[i])["$r"]().v);
//         }
//         return "[" + ret.join(", ") + "]";
//     };
//     var getIdents = function (obj, indent) {
//         var ns;
//         var j;
//         var sub;
//         var nsslen;
//         var nss;
//         var info;
//         var i;
//         var objidentslen;
//         var objidents;
//         var ret;
//         if (indent === undefined) {
//             indent = "";
//         }
//         ret = "";
//         ret += indent + "Sym_type: " + obj.get_type() + "\n";
//         ret += indent + "Sym_name: " + obj.get_name() + "\n";
//         ret += indent + "Sym_lineno: " + obj.get_lineno() + "\n";
//         ret += indent + "Sym_nested: " + pyBoolStr(obj.is_nested()) + "\n";
//         ret += indent + "Sym_haschildren: " + pyBoolStr(obj.has_children()) + "\n";
//         if (obj.get_type() === "class") {
//             ret += indent + "Class_methods: " + pyList(obj.get_methods()) + "\n";
//         }
//         else if (obj.get_type() === "function") {
//             ret += indent + "Func_params: " + pyList(obj.get_parameters()) + "\n";
//             ret += indent + "Func_locals: " + pyList(obj.get_locals()) + "\n";
//             ret += indent + "Func_globals: " + pyList(obj.get_globals()) + "\n";
//             ret += indent + "Func_frees: " + pyList(obj.get_frees()) + "\n";
//         }
//         ret += indent + "-- Identifiers --\n";
//         objidents = obj.get_identifiers();
//         objidentslen = objidents.length;
//         for (i = 0; i < objidentslen; ++i) {
//             info = obj.lookup(objidents[i]);
//             ret += indent + "name: " + info.get_name() + "\n";
//             ret += indent + "  is_referenced: " + pyBoolStr(info.is_referenced()) + "\n";
//             ret += indent + "  is_imported: " + pyBoolStr(info.is_imported()) + "\n";
//             ret += indent + "  is_parameter: " + pyBoolStr(info.is_parameter()) + "\n";
//             ret += indent + "  is_global: " + pyBoolStr(info.is_global()) + "\n";
//             ret += indent + "  is_declared_global: " + pyBoolStr(info.is_declared_global()) + "\n";
//             ret += indent + "  is_local: " + pyBoolStr(info.is_local()) + "\n";
//             ret += indent + "  is_free: " + pyBoolStr(info.is_free()) + "\n";
//             ret += indent + "  is_assigned: " + pyBoolStr(info.is_assigned()) + "\n";
//             ret += indent + "  is_namespace: " + pyBoolStr(info.is_namespace()) + "\n";
//             nss = info.get_namespaces();
//             nsslen = nss.length;
//             ret += indent + "  namespaces: [\n";
//             sub = [];
//             for (j = 0; j < nsslen; ++j) {
//                 ns = nss[j];
//                 sub.push(getIdents(ns, indent + "    "));
//             }
//             ret += sub.join("\n");
//             ret += indent + "  ]\n";
//         }
//         return ret;
//     };
//     return getIdents(st.top, "");
// };
