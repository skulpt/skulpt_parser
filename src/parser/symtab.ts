import {
    AST,
    ASTKind,
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
    Set,
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
    Load,
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
} from "../ast/astnodes.ts";
import { pySyntaxError } from "../ast/errors.ts";
import { assert } from "./pegen.ts";

export const ModuleBlock = "module";
export type ModuleBlock = "module";
export const FunctionBlock = "function";
export type FunctionBlock = "function";
export const ClassBlock = "class";
export type ClassBlock = "class";
export const AnnotationBlock = "annotation";
export type AnnotationBlock = "annotation";

type BlockTypes = ModuleBlock | FunctionBlock | ClassBlock | AnnotationBlock;

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

class Symbol_ {
    __name: string;
    __flags: number;
    __scope: number;
    __namespaces: any[] | null = null;
    __module_scope: boolean = false;

    constructor(name: string, flags: number, namespaces: any[] | null = null, module_scope = false) {
        this.__name = name;
        this.__flags = flags;
        this.__scope = (flags >> SYMTAB_CONSTS.SCOPE_OFFSET) & SYMTAB_CONSTS.SCOPE_MASK; // like PyST_GetScope()
        this.__namespaces = namespaces || [];
        this.__module_scope = module_scope;
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
        /* Return *True* if the sysmbol is global. */
        return !!(
            this.__scope in [SYMTAB_CONSTS.GLOBAL_IMPLICIT, SYMTAB_CONSTS.GLOBAL_EXPLICIT] ||
            (this.__module_scope && !!(this.__flags & SYMTAB_CONSTS.DEF_BOUND))
        );
    }

    is_nonlocal() {
        return !!(this.__flags & SYMTAB_CONSTS.DEF_NONLOCAL);
    }

    is_declared_global() {
        return !!(this.__scope == SYMTAB_CONSTS.GLOBAL_EXPLICIT);
    }

    is_local() {
        /* Return *True* if the symbol is local. */
        return !!(
            this.__scope in [SYMTAB_CONSTS.LOCAL, SYMTAB_CONSTS.CELL] ||
            (this.__module_scope && this.__flags & SYMTAB_CONSTS.DEF_BOUND)
        );
    }

    is_annotated() {
        return !!(this.__flags & SYMTAB_CONSTS.DEF_ANNOT);
    }

    is_free() {
        return !!(this.__scope == SYMTAB_CONSTS.FREE);
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

        if (this.__namespaces?.length != 1) {
            throw Error("name is bound to multiple namespaces");
            // todo: This should be a value error maybe
        }

        return this.__namespaces[0];
    }
}

var astScopeCounter = 0;

class SymbolTableScope {
    symFlags: { [flag: string]: any };
    name: string;
    varnames: any;
    children: SymbolTableScope[];
    blockType: BlockTypes;
    isNested = false;
    hasFree: boolean;
    childHasFree: any;
    generator: any;
    varargs: boolean;
    varkeywords: any;
    returnsValue: any;
    lineno: number;
    col_offset: number;
    table: any;
    symbols: any;
    _funcLocals: string[] | null = null;
    _funcParams: string[] | null = null;
    _funcGlobals: string[] | null = null;
    _funcFrees: string[] | null = null;
    _classMethods: string[] | null = null;
    comp_iter_expr = 0;
    comp_iter_target = false;
    comprehension = false;
    directives: [string, number, number][] | null = null;
    coroutine = false;

    constructor(
        table: SymbolTable,
        name: string,
        type: BlockTypes,
        ast: AST,
        lineno: number,
        col_offset: number,
        end_lineno?: number | null,
        end_col_offset?: number | null
    ) {
        this.symFlags = {};
        this.name = name;
        this.varnames = [];
        this.children = [];
        this.blockType = type;

        this.isNested = false;
        this.hasFree = false;
        this.childHasFree = false; // true if child block has free vars including free refs to globals
        this.generator = false;
        this.varargs = false;
        this.varkeywords = false;
        this.returnsValue = false;

        this.lineno = lineno;
        this.col_offset = col_offset;

        this.table = table;

        if (table.cur && (table.cur.isNested || table.cur.blockType === FunctionBlock)) {
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
        return this.children.length > 0;
    }

    get_identifiers() {
        return this._identsMatching(function () {
            return true;
        });
    }

    getSymbol(name: string): Symbol_ {
        return this.lookup(name);
    }

    lookup(name: string): Symbol_ {
        let sym;
        if (!(name in this.symbols)) {
            const flags = this.symFlags[name];
            const namespaces = this.__check_children(name);
            sym = this.symbols[name] = new Symbol_(name, flags, namespaces);
        } else {
            sym = this.symbols[name];
        }
        return sym;
    }

    __check_children(name: string): any[] {
        //print("  check_children:", name);
        var child;
        var i;
        var ret = [];
        for (i = 0; i < this.children.length; ++i) {
            child = this.children[i];
            if (child.name === name) {
                ret.push(child);
            }
        }
        return ret;
    }

    _identsMatching(f: (flag: number) => boolean) {
        var k;
        var ret = [];
        for (k in this.symFlags) {
            if (k in this.symFlags) {
                if (f(this.symFlags[k])) {
                    ret.push(k);
                }
            }
        }
        ret.sort();
        return ret;
    }

    get_parameters(): string[] {
        assert(this.get_type() == "function", "get_parameters only valid for function scopes");
        if (!this._funcParams) {
            this._funcParams = this._identsMatching((x) => !!(x & SYMTAB_CONSTS.DEF_PARAM));
        }
        return this._funcParams;
    }

    get_locals(): string[] {
        assert(this.get_type() == "function", "get_locals only valid for function scopes");
        if (!this._funcLocals) {
            this._funcLocals = this._identsMatching((x) => !!(x & SYMTAB_CONSTS.DEF_BOUND));
        }
        return this._funcLocals;
    }

    get_globals(): string[] {
        assert(this.get_type() == "function", "get_globals only valid for function scopes");
        if (!this._funcGlobals) {
            this._funcGlobals = this._identsMatching(function (x) {
                var masked = (x >> SYMTAB_CONSTS.SCOPE_OFFSET) & SYMTAB_CONSTS.SCOPE_MASK;
                return masked == SYMTAB_CONSTS.GLOBAL_IMPLICIT || masked == SYMTAB_CONSTS.GLOBAL_EXPLICIT;
            });
        }
        return this._funcGlobals;
    }

    get_frees() {
        assert(this.get_type() == "function", "get_frees only valid for function scopes");
        if (!this._funcFrees) {
            this._funcFrees = this._identsMatching(function (x) {
                var masked = (x >> SYMTAB_CONSTS.SCOPE_OFFSET) & SYMTAB_CONSTS.SCOPE_MASK;
                return masked == SYMTAB_CONSTS.FREE;
            });
        }
        return this._funcFrees;
    }

    get_methods() {
        var i;
        var all;
        assert(this.get_type() == "class", "get_methods only valid for class scopes");
        if (!this._classMethods) {
            // todo; uniq?
            all = [];
            for (i = 0; i < this.children.length; ++i) {
                all.push(this.children[i].name);
            }
            all.sort();
            this._classMethods = all;
        }
        return this._classMethods;
    }

    get_scope(name: string): number {
        //print("getScope");
        //for (var k in this.symFlags) print(k);
        var v = this.symFlags[name];
        if (v === undefined) {
            return 0;
        }
        return (v >> SYMTAB_CONSTS.SCOPE_OFFSET) & SYMTAB_CONSTS.SCOPE_MASK;
    }
}

function _Py_Mangle(privateobj: string | null, ident: string) {
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
    if (ident.endsWith("__") || ident.indexOf(".") != -1) {
        return ident; /* Don't mangle __whatever__ */
    }

    /* Strip leading underscores from class name */
    const stripped = privateobj.replace(/^_+/, "");
    if (stripped.length === 0) {
        return ident; /* Don't mangle if class is just underscores */
    }

    /* ident = "_" + priv[ipriv:] + ident # i.e. 1+plen+nlen bytes */
    return `_${stripped}${ident}`;
}

class SymbolTable {
    filename: string;
    cur: SymbolTableScope | null = null;
    top: any | null = null;
    stack: SymbolTableScope[] = [];
    global: any | null = null;
    curClass: string | null = null;
    tmpname = 0;
    stss: { [thing: number]: any } = {};

    constructor(filename: string) {
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
        const cur_ste = ste || this.cur;
        assert(cur_ste !== null, "need to know what we're operating on");

        const mangled = _Py_Mangle(this.private, name);
        let val = cur_ste.symbols[mangled];
        if (val !== undefined) {
            if (flag & SYMTAB_CONSTS.DEF_PARAM && val & SYMTAB_CONSTS.DEF_PARAM) {
                throw new pySyntaxError("duplicate argument '" + name + "' in function definition", [
                    this.filename,
                    cur_ste.lineno,
                    cur_ste.col_offset,
                    "",
                ]);
            }
            val |= flag;
        } else {
            val = flag;
        }

        if (cur_ste.comp_iter_target) {
            /* This name is an iteration variable in a comprehension,
             * so check for a binding conflict with any named expressions.
             * Otherwise, mark it as an iteration variable so subsequent
             * named expressions can check for conflicts.
             */
            if (val & (SYMTAB_CONSTS.DEF_GLOBAL | SYMTAB_CONSTS.DEF_NONLOCAL)) {
                // @stu no end line and end coloffset in syntax err??
                throw new pySyntaxError(
                    `comprehension inner loop cannot rebind assignment expression target '${name}'`,
                    [this.filename, cur_ste.lineno, cur_ste.col_offset, ""]
                );
            }
            val |= SYMTAB_CONSTS.DEF_COMP_ITER;
        }

        cur_ste.symbols[mangled] = val;

        if (flag & SYMTAB_CONSTS.DEF_PARAM) {
            cur_ste.varnames.push(mangled);
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
                visitor(node);
            }
        }
    }

    SEQ<T>(visitor: (node: T) => void, nodes: (T | null)[]) {
        assert(Array.isArray(nodes), "SEQ: nodes isn't array? got " + nodes.toString());
        for (const node of nodes) {
            if (node) {
                visitor(node);
            }
        }
    }

    recordDirective(name: string, lineno: number, col_offset: number) {
        assert(this.cur !== null);

        if (!this.cur.directives) {
            this.cur.directives = [];
        }

        const mangled = _Py_Mangle(this.private, name);

        this.cur.directives.push([mangled, lineno, col_offset]);
    }

    extendNamedexprScope(e: Name) {
        assert(this.stack);
        assert(e._kind === ASTKind.Name);

        const target_name = e.id;

        /* Iterate over the stack in reverse and add to the nearest adequate scope */
        for (const ste of this.stack) {
            /* If we find a comprehension scope, check for a target
             * binding conflict with iteration variables, otherwise skip it
             */
            if (ste.comprehension) {
                const target_in_scope = ste.getSymbol(target_name);
                if (target_in_scope.is_comprehension()) {
                    throw new pySyntaxError(
                        `assignment expression cannot rebind comprehension iteration variable '${target_name}'`,
                        ["", 0, 0, ""]
                    );
                }
                continue;
            }

            /* If we find a FunctionBlock entry, add as GLOBAL/LOCAL or NONLOCAL/LOCAL */
            if (ste.blockType === FunctionBlock) {
                const target_in_scope = ste.getSymbol(target_name);
                if (target_in_scope.is_global()) {
                    this.addDef(target_name, SYMTAB_CONSTS.DEF_GLOBAL);
                } else {
                    this.addDef(target_name, SYMTAB_CONSTS.DEF_NONLOCAL);
                }
                this.recordDirective(target_name, e.lineno, e.col_offset);
                return this.addDef(target_name, SYMTAB_CONSTS.DEF_LOCAL, ste);
            }
            /* If we find a ModuleBlock entry, add as GLOBAL */
            if (ste.blockType === ModuleBlock) {
                this.addDef(target_name, SYMTAB_CONSTS.DEF_GLOBAL);
                this.recordDirective(target_name, e.lineno, e.col_offset);
                return this.addDef(target_name, SYMTAB_CONSTS.DEF_GLOBAL, ste);
            }
            /* Disallow usage in ClassBlock */
            if (ste.blockType === ClassBlock) {
                throw new pySyntaxError(
                    "assignment expression within a comprehension cannot be used in a class body",
                    [this.filename, e.lineno, e.col_offset, ""]
                );
            }
        }

        assert(
            0,
            "We should always find either a FunctionBlock, ModuleBlock or ClassBlock and should never fall to this case"
        );
    }

    handleNamedExpr(e: NamedExpr) {
        assert(this.cur !== null, "need current scope for namedExpr");
        if (this.cur.comp_iter_expr > 0) {
            // @todo -- needs line number etc
            throw new pySyntaxError("Assignment isn't allowed in a comprehension iterable expression", ["", 0, 0, ""]);
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
        block: BlockTypes,
        ast: AST,
        lineno: number,
        col_offset: number,
        end_lineno?: number | null,
        end_col_offset?: number | null
    ) {
        const ste = new SymbolTableScope(this, name, block, ast, lineno, col_offset, end_lineno, end_col_offset);
        this.stack.push(ste);
        const prev = this.cur;

        /* bpo-37757: For now, disallow *all* assignment expressions in the
         * outermost iterator expression of a comprehension, even those inside
         * a nested comprehension or a lambda expression.
         */
        if (prev) {
            ste.comp_iter_expr = prev.comp_iter_expr;
        }

        /* Annotation blocks shouldn't have any affect on the symbol table since in
         * the compilation stage, they will all be transformed to strings. They are
         * only created if future 'annotations' feature is activated. */
        if (block === AnnotationBlock) {
            return;
        }

        if (block === ModuleBlock) {
            this.global = this.cur?.symbols;
        }

        if (prev) {
            prev.children.push(ste);
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
        this.enterBlock(scopeName, FunctionBlock, e, e.lineno, e.col_offset, e.end_lineno, e.end_col_offset);

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
        // @stu todo maybe?
        // if (++st->recursion_depth > st->recursion_limit) {
        //     PyErr_SetString(PyExc_RecursionError,
        //                     "maximum recursion depth exceeded during compilation");
        //     VISIT_QUIT(st, 0);
        // }
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
                    FunctionBlock,
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
                this.SEQ(this.visitExpr, (e as Set).elts);
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
                if (name.ctx == Load && this.cur.blockType === FunctionBlock && name.id === "super") {
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
                this.enterBlock(funcDef.name, FunctionBlock, s, s.lineno, s.col_offset);
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
                    ClassBlock,
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
            // case Sk.astnodes.Return:
            //     if (s.value) {
            //         this.visitExpr(s.value);
            //         this.cur.returnsValue = true;
            //     }
            //     break;
            // case Sk.astnodes.Delete:
            //     this.SEQExpr(s.targets);
            //     break;
            // case Sk.astnodes.Assign:
            //     this.SEQExpr(s.targets);
            //     this.visitExpr(s.value);
            //     break;
            // case Sk.astnodes.AnnAssign:
            //     if (s.target.constructor == Sk.astnodes.Name) {
            //         e_name = s.target;
            //         name = Sk.mangleName(this.curClass, e_name.id).v;
            //         name = Sk.fixReserved(name);
            //         cur = this.cur.symFlags[name];
            //         if ((cur & (DEF_GLOBAL | DEF_NONLOCAL) )
            //             && (this.global != this.cur.symFlags) // TODO
            //             && (s.simple)) {
            //             throw new Sk.builtin.SyntaxError("annotated name '"+ name +"' can't be global", this.filename, s.lineno);
            //         }
            //         if (s.simple) {
            //             this.addDef(new Sk.builtin.str(name), DEF_ANNOT | DEF_LOCAL, s.lineno);
            //         } else if (s.value) {
            //             this.addDef(new Sk.builtin.str(name), DEF_LOCAL, s.lineno);
            //         }
            //     } else {
            //         this.visitExpr(s.target);
            //     }
            //     this.visitExpr(s.annotation);
            //     if (s.value) {
            //         this.visitExpr(s.value);
            //     }
            //     break;
            // case Sk.astnodes.AugAssign:
            //     this.visitExpr(s.target);
            //     this.visitExpr(s.value);
            //     break;
            // case Sk.astnodes.Print:
            //     if (s.dest) {
            //         this.visitExpr(s.dest);
            //     }
            //     this.SEQExpr(s.values);
            //     break;
            // case Sk.astnodes.For:
            //     this.visitExpr(s.target);
            //     this.visitExpr(s.iter);
            //     this.SEQStmt(s.body);
            //     if (s.orelse) {
            //         this.SEQStmt(s.orelse);
            //     }
            //     break;
            // case Sk.astnodes.While:
            //     this.visitExpr(s.test);
            //     this.SEQStmt(s.body);
            //     if (s.orelse) {
            //         this.SEQStmt(s.orelse);
            //     }
            //     break;
            // case Sk.astnodes.If:
            //     this.visitExpr(s.test);
            //     this.SEQStmt(s.body);
            //     if (s.orelse) {
            //         this.SEQStmt(s.orelse);
            //     }
            //     break;
            // case Sk.astnodes.Raise:
            //     if (s.exc) {
            //         this.visitExpr(s.exc);
            //         // Our hacked AST supports both Python 2 (inst, tback)
            //         // and Python 3 (cause) versions of the Raise statement
            //         if (s.inst) {
            //             this.visitExpr(s.inst);
            //             if (s.tback) {
            //                 this.visitExpr(s.tback);
            //             }
            //         }
            //         if (s.cause) {
            //             this.visitExpr(s.cause);
            //         }
            //     }
            //     break;
            // case Sk.astnodes.Assert:
            //     this.visitExpr(s.test);
            //     if (s.msg) {
            //         this.visitExpr(s.msg);
            //     }
            //     break;
            // case Sk.astnodes.Import:
            // case Sk.astnodes.ImportFrom:
            //     this.visitAlias(s.names, s.lineno);
            //     break;
            // case Sk.astnodes.Global:
            //     nameslen = s.names.length;
            //     for (i = 0; i < nameslen; ++i) {
            //         name = Sk.mangleName(this.curClass, s.names[i]).v;
            //         name = Sk.fixReserved(name);
            //         cur = this.cur.symFlags[name];
            //         if (cur & (DEF_LOCAL | USE)) {
            //             if (cur & DEF_LOCAL) {
            //                 throw new Sk.builtin.SyntaxError("name '" + name + "' is assigned to before global declaration", this.filename, s.lineno);
            //             }
            //             else {
            //                 throw new Sk.builtin.SyntaxError("name '" + name + "' is used prior to global declaration", this.filename, s.lineno);
            //             }
            //         }
            //         this.addDef(new Sk.builtin.str(name), DEF_GLOBAL, s.lineno);
            //     }
            //     break;
            // case Sk.astnodes.Expr:
            //     this.visitExpr(s.value);
            //     break;
            // case Sk.astnodes.Pass:
            // case Sk.astnodes.Break:
            // case Sk.astnodes.Continue:
            // case Sk.astnodes.Debugger:
            //     // nothing
            //     break;
            // case Sk.astnodes.With:
            //     VISIT_SEQ(this.visit_withitem.bind(this), s.items);
            //     VISIT_SEQ(this.visitStmt.bind(this), s.body);
            //     break;

            // case Sk.astnodes.Try:
            //     this.SEQStmt(s.body);
            //     this.visitExcepthandlers(s.handlers)
            //     this.SEQStmt(s.orelse);
            //     this.SEQStmt(s.finalbody);
            //     break;

            // default:
            //     Sk.asserts.fail("Unhandled type " + s.constructor.name + " in visitStmt");
        }
    }
}

// SymbolTable.prototype.SEQStmt = function (nodes) {
//     var val;
//     var i;
//     var len;
//     if (nodes !== null) {
//        assert(Sk.isArrayLike(nodes), "SEQ: nodes isn't array? got " + nodes.toString());
//         len = nodes.length;
//         for (i = 0; i < len; ++i) {
//             val = nodes[i];
//             if (val) {
//                 this.visitStmt(val);
//             }
//         }
//     }
// };

// SymbolTable.prototype.visitParams = function (args, toplevel) {
//     var arg;
//     var i;
//     for (i = 0; i < args.length; ++i) {
//         arg = args[i];
//         if (arg.constructor === Sk.astnodes.arg) {
//             // TODO arguments are more complicated in Python 3...
//             this.addDef(arg.arg, DEF_PARAM, arg.lineno);
//         }
//         else {
//             // Tuple isn't supported
//             throw new Sk.builtin.SyntaxError("invalid expression in parameter list", this.filename);
//         }
//     }
// };

// SymbolTable.prototype.visitAnnotations = function (a, returns) {
//     if (a.posonlyargs) {
//         this.visitArgAnnotations(a.posonlyargs);
//     }
//     if (a.args) {
//         this.visitArgAnnotations(a.args);
//     }
//     if (a.vararg && a.vararg.annotation) {
//         this.visitExpr(a.vararg.annotation);
//     }
//     if (a.kwarg && a.kwarg.annotation) {
//         this.visitExpr(a.kwarg.annotation);
//     }
//     if (a.kwonlyargs) {
//         this.visitArgAnnotations(a.kwonlyargs);
//     }
//     if (returns) {
//         this.visitExpr(returns);
//     }
// };

// SymbolTable.prototype.visitArgAnnotations = function (args) {
//     for (let i = 0; i < args.length; i++) {
//         const arg = args[i];
//         if (arg.annotation) {
//             this.visitExpr(arg.annotation);
//         }
//     }
// };

// SymbolTable.prototype.visitArguments = function (a, lineno) {
//     if (a.args) {
//         this.visitParams(a.args, true);
//     }
//     if (a.kwonlyargs) {
//         this.visitParams(a.kwonlyargs, true);
//     }
//     if (a.vararg) {
//         this.addDef(a.vararg.arg, DEF_PARAM, lineno);
//         this.cur.varargs = true;
//     }
//     if (a.kwarg) {
//         this.addDef(a.kwarg.arg, DEF_PARAM, lineno);
//         this.cur.varkeywords = true;
//     }
// };

// SymbolTable.prototype.newTmpname = function (lineno) {
//     this.addDef(new Sk.builtin.str("_[" + (++this.tmpname) + "]"), DEF_LOCAL, lineno);
// };

// SymbolTable.prototype.addDef = function (name, flag, lineno) {
//     var fromGlobal;
//     var val;
//     var mangled = Sk.mangleName(this.curClass, name).v;
//     mangled = Sk.fixReserved(mangled);
//     val = this.cur.symFlags[mangled];
//     if (val !== undefined) {
//         if ((flag & DEF_PARAM) && (val & DEF_PARAM)) {
//             throw new Sk.builtin.SyntaxError("duplicate argument '" + name.v + "' in function definition", this.filename, lineno);
//         }
//         val |= flag;
//     }
//     else {
//         val = flag;
//     }
//     this.cur.symFlags[mangled] = val;
//     if (flag & DEF_PARAM) {
//         this.cur.varnames.push(mangled);
//     }
//     else if (flag & DEF_GLOBAL) {
//         val = flag;
//         fromGlobal = this.global[mangled];
//         if (fromGlobal !== undefined) {
//             val |= fromGlobal;
//         }
//         this.global[mangled] = val;
//     }
// };

// SymbolTable.prototype.visitSlice = function (s) {
//     var i;
//     switch (s.constructor) {
//         case Sk.astnodes.Slice:
//             if (s.lower) {
//                 this.visitExpr(s.lower);
//             }
//             if (s.upper) {
//                 this.visitExpr(s.upper);
//             }
//             if (s.step) {
//                 this.visitExpr(s.step);
//             }
//             break;
//         case Sk.astnodes.ExtSlice:
//             for (i = 0; i < s.dims.length; ++i) {
//                 this.visitSlice(s.dims[i]);
//             }
//             break;
//         case Sk.astnodes.Index:
//             this.visitExpr(s.value);
//             break;
//         case Sk.astnodes.Ellipsis:
//             break;
//     }
// };

// SymbolTable.prototype.visitStmt = function (s) {
//     var cur;
//     var name;
//     var i;
//     var nameslen;
//     var tmp;
//     var e_name;
//    assert(s !== undefined, "visitStmt called with undefined");
//     switch (s.constructor) {
//         case Sk.astnodes.FunctionDef:
//             this.addDef(s.name, DEF_LOCAL, s.lineno);
//             if (s.args.defaults) {
//                 this.SEQExpr(s.args.defaults);
//             }
//             if (s.decorator_list) {
//                 this.SEQExpr(s.decorator_list);
//             }
//             this.visitAnnotations(s.args, s.returns);
//             this.enterBlock(s.name.v, FunctionBlock, s, s.lineno);
//             this.visitArguments(s.args, s.lineno);
//             this.SEQStmt(s.body);
//             this.exitBlock();
//             break;
//         case Sk.astnodes.ClassDef:
//             this.addDef(s.name, DEF_LOCAL, s.lineno);
//             this.SEQExpr(s.bases);
//             if (s.decorator_list) {
//                 this.SEQExpr(s.decorator_list);
//             }
//             this.enterBlock(s.name.v, ClassBlock, s, s.lineno);
//             tmp = this.curClass;
//             this.curClass = s.name;
//             this.SEQStmt(s.body);
//             this.exitBlock();
//             break;
//         case Sk.astnodes.Return:
//             if (s.value) {
//                 this.visitExpr(s.value);
//                 this.cur.returnsValue = true;
//             }
//             break;
//         case Sk.astnodes.Delete:
//             this.SEQExpr(s.targets);
//             break;
//         case Sk.astnodes.Assign:
//             this.SEQExpr(s.targets);
//             this.visitExpr(s.value);
//             break;
//         case Sk.astnodes.AnnAssign:
//             if (s.target.constructor == Sk.astnodes.Name) {
//                 e_name = s.target;
//                 name = Sk.mangleName(this.curClass, e_name.id).v;
//                 name = Sk.fixReserved(name);
//                 cur = this.cur.symFlags[name];
//                 if ((cur & (DEF_GLOBAL | DEF_NONLOCAL) )
//                     && (this.global != this.cur.symFlags) // TODO
//                     && (s.simple)) {
//                     throw new Sk.builtin.SyntaxError("annotated name '"+ name +"' can't be global", this.filename, s.lineno);
//                 }
//                 if (s.simple) {
//                     this.addDef(new Sk.builtin.str(name), DEF_ANNOT | DEF_LOCAL, s.lineno);
//                 } else if (s.value) {
//                     this.addDef(new Sk.builtin.str(name), DEF_LOCAL, s.lineno);
//                 }
//             } else {
//                 this.visitExpr(s.target);
//             }
//             this.visitExpr(s.annotation);
//             if (s.value) {
//                 this.visitExpr(s.value);
//             }
//             break;
//         case Sk.astnodes.AugAssign:
//             this.visitExpr(s.target);
//             this.visitExpr(s.value);
//             break;
//         case Sk.astnodes.Print:
//             if (s.dest) {
//                 this.visitExpr(s.dest);
//             }
//             this.SEQExpr(s.values);
//             break;
//         case Sk.astnodes.For:
//             this.visitExpr(s.target);
//             this.visitExpr(s.iter);
//             this.SEQStmt(s.body);
//             if (s.orelse) {
//                 this.SEQStmt(s.orelse);
//             }
//             break;
//         case Sk.astnodes.While:
//             this.visitExpr(s.test);
//             this.SEQStmt(s.body);
//             if (s.orelse) {
//                 this.SEQStmt(s.orelse);
//             }
//             break;
//         case Sk.astnodes.If:
//             this.visitExpr(s.test);
//             this.SEQStmt(s.body);
//             if (s.orelse) {
//                 this.SEQStmt(s.orelse);
//             }
//             break;
//         case Sk.astnodes.Raise:
//             if (s.exc) {
//                 this.visitExpr(s.exc);
//                 // Our hacked AST supports both Python 2 (inst, tback)
//                 // and Python 3 (cause) versions of the Raise statement
//                 if (s.inst) {
//                     this.visitExpr(s.inst);
//                     if (s.tback) {
//                         this.visitExpr(s.tback);
//                     }
//                 }
//                 if (s.cause) {
//                     this.visitExpr(s.cause);
//                 }
//             }
//             break;
//         case Sk.astnodes.Assert:
//             this.visitExpr(s.test);
//             if (s.msg) {
//                 this.visitExpr(s.msg);
//             }
//             break;
//         case Sk.astnodes.Import:
//         case Sk.astnodes.ImportFrom:
//             this.visitAlias(s.names, s.lineno);
//             break;
//         case Sk.astnodes.Global:
//             nameslen = s.names.length;
//             for (i = 0; i < nameslen; ++i) {
//                 name = Sk.mangleName(this.curClass, s.names[i]).v;
//                 name = Sk.fixReserved(name);
//                 cur = this.cur.symFlags[name];
//                 if (cur & (DEF_LOCAL | USE)) {
//                     if (cur & DEF_LOCAL) {
//                         throw new Sk.builtin.SyntaxError("name '" + name + "' is assigned to before global declaration", this.filename, s.lineno);
//                     }
//                     else {
//                         throw new Sk.builtin.SyntaxError("name '" + name + "' is used prior to global declaration", this.filename, s.lineno);
//                     }
//                 }
//                 this.addDef(new Sk.builtin.str(name), DEF_GLOBAL, s.lineno);
//             }
//             break;
//         case Sk.astnodes.Expr:
//             this.visitExpr(s.value);
//             break;
//         case Sk.astnodes.Pass:
//         case Sk.astnodes.Break:
//         case Sk.astnodes.Continue:
//         case Sk.astnodes.Debugger:
//             // nothing
//             break;
//         case Sk.astnodes.With:
//             VISIT_SEQ(this.visit_withitem.bind(this), s.items);
//             VISIT_SEQ(this.visitStmt.bind(this), s.body);
//             break;

//         case Sk.astnodes.Try:
//             this.SEQStmt(s.body);
//             this.visitExcepthandlers(s.handlers)
//             this.SEQStmt(s.orelse);
//             this.SEQStmt(s.finalbody);
//             break;

//         default:
//             Sk.asserts.fail("Unhandled type " + s.constructor.name + " in visitStmt");
//     }
// };

// SymbolTable.prototype.visit_withitem = function(item) {
//     this.visitExpr(item.context_expr);
//     if (item.optional_vars) {
//         this.visitExpr(item.optional_vars);
//     }
// }

// function VISIT_SEQ(visitFunc, seq) {
//     var i;
//     for (i = 0; i < seq.length; i++) {
//         var elt = seq[i];
//         visitFunc(elt)
//     }
// }

// SymbolTable.prototype.visitExpr = function (e) {
//     var i;
//    assert(e !== undefined, "visitExpr called with undefined");
//     // console.log("  e: ", e.constructor.name);
//     switch (e.constructor) {
//         case Sk.astnodes.BoolOp:
//             this.SEQExpr(e.values);
//             break;
//         case Sk.astnodes.BinOp:
//             this.visitExpr(e.left);
//             this.visitExpr(e.right);
//             break;
//         case Sk.astnodes.UnaryOp:
//             this.visitExpr(e.operand);
//             break;
//         case Sk.astnodes.Lambda:
//             this.addDef(new Sk.builtin.str("lambda"), DEF_LOCAL, e.lineno);
//             if (e.args.defaults) {
//                 this.SEQExpr(e.args.defaults);
//             }
//             this.enterBlock("lambda", FunctionBlock, e, e.lineno);
//             this.visitArguments(e.args, e.lineno);
//             this.visitExpr(e.body);
//             this.exitBlock();
//             break;
//         case Sk.astnodes.IfExp:
//             this.visitExpr(e.test);
//             this.visitExpr(e.body);
//             this.visitExpr(e.orelse);
//             break;
//         case Sk.astnodes.Dict:
//             this.SEQExpr(e.keys);
//             this.SEQExpr(e.values);
//             break;
//         case Sk.astnodes.DictComp:
//         case Sk.astnodes.SetComp:
//             this.visitComprehension(e.generators, 0);
//             break;
//         case Sk.astnodes.ListComp:
//             this.newTmpname(e.lineno);
//             this.visitExpr(e.elt);
//             this.visitComprehension(e.generators, 0);
//             break;
//         case Sk.astnodes.GeneratorExp:
//             this.visitGenexp(e);
//             break;
//         case Sk.astnodes.YieldFrom:
//         case Sk.astnodes.Yield:
//             if (e.value) {
//                 this.visitExpr(e.value);
//             }
//             this.cur.generator = true;
//             if (this.cur.returnsValue) {
//                 throw new Sk.builtin.SyntaxError("'return' with argument inside generator", this.filename);
//             }
//             break;
//         case Sk.astnodes.Compare:
//             this.visitExpr(e.left);
//             this.SEQExpr(e.comparators);
//             break;
//         case Sk.astnodes.Call:
//             this.visitExpr(e.func);
//             if (e.args) {
//                 for (let a of e.args) {
//                     if (a.constructor === Sk.astnodes.Starred) {
//                         this.visitExpr(a.value);
//                     } else {
//                         this.visitExpr(a);
//                     }
//                 }
//             }
//             if (e.keywords) {
//                 for (let k of e.keywords) {
//                     this.visitExpr(k.value);
//                 }
//             }
//             break;
//         case Sk.astnodes.Num:
//         case Sk.astnodes.Str:
//         case Sk.astnodes.Bytes:
//             break;
//         case Sk.astnodes.JoinedStr:
//             for (let s of e.values) {
//                 this.visitExpr(s);
//             }
//             break;
//         case Sk.astnodes.FormattedValue:
//             this.visitExpr(e.value);
//             if (e.format_spec) {
//                 this.visitExpr(e.format_spec);
//             }
//             break;
//         case Sk.astnodes.Attribute:
//             this.visitExpr(e.value);
//             break;
//         case Sk.astnodes.Subscript:
//             this.visitExpr(e.value);
//             this.visitSlice(e.slice);
//             break;
//         case Sk.astnodes.Name:
//             this.addDef(e.id, e.ctx === Sk.astnodes.Load ? USE : DEF_LOCAL, e.lineno);
//             break;
//         case Sk.astnodes.NameConstant:
//             break;
//         case Sk.astnodes.List:
//         case Sk.astnodes.Tuple:
//         case Sk.astnodes.Set:
//             this.SEQExpr(e.elts);
//             break;
//         case Sk.astnodes.Starred:
//             this.visitExpr(e.value);
//             break;
//         case Sk.astnodes.Ellipsis:
//             break;
//         default:
//             Sk.asserts.fail("Unhandled type " + e.constructor.name + " in visitExpr");
//     }
// };

// SymbolTable.prototype.visitComprehension = function (lcs, startAt) {
//     var lc;
//     var i;
//     var len = lcs.length;
//     for (i = startAt; i < len; ++i) {
//         lc = lcs[i];
//         this.visitExpr(lc.target);
//         this.visitExpr(lc.iter);
//         this.SEQExpr(lc.ifs);
//     }
// };

// SymbolTable.prototype.visitAlias = function (names, lineno) {
//     /* Compute store_name, the name actually bound by the import
//      operation.  It is diferent than a->name when a->name is a
//      dotted package name (e.g. spam.eggs)
//      */
//     var dot;
//     var storename;
//     var name;
//     var a;
//     var i;
//     for (i = 0; i < names.length; ++i) {
//         a = names[i];
//         name = a.asname === null ? a.name.v : a.asname.v;
//         storename = name;
//         dot = name.indexOf(".");
//         if (dot !== -1) {
//             storename = name.substr(0, dot);
//         }
//         if (name !== "*") {
//             this.addDef(new Sk.builtin.str(storename), DEF_IMPORT, lineno);
//         }
//         else {
//             if (this.cur.blockType !== ModuleBlock) {
//                 throw new Sk.builtin.SyntaxError("import * only allowed at module level", this.filename);
//             }
//         }
//     }
// };

// SymbolTable.prototype.visitGenexp = function (e) {
//     var outermost = e.generators[0];
//     // outermost is evaled in current scope
//     this.visitExpr(outermost.iter);
//     this.enterBlock("genexpr", FunctionBlock, e, e.lineno);
//     this.cur.generator = true;
//     this.addDef(new Sk.builtin.str(".0"), DEF_PARAM, e.lineno);
//     this.visitExpr(outermost.target);
//     this.SEQExpr(outermost.ifs);
//     this.visitComprehension(e.generators, 1);
//     this.visitExpr(e.elt);
//     this.exitBlock();
// };

// SymbolTable.prototype.visitExcepthandlers = function (handlers) {
//     var i, eh;
//     for (i = 0; eh = handlers[i]; ++i) {
//         if (eh.type) {
//             this.visitExpr(eh.type);
//         }
//         if (eh.name) {
//             this.visitExpr(eh.name);
//         }
//         this.SEQStmt(eh.body);
//     }
// };

// function _dictUpdate (a, b) {
//     var kb;
//     for (kb in b) {
//         a[kb] = b[kb];
//     }
// }

// SymbolTable.prototype.analyzeBlock = function (ste, bound, free, global) {
//     var c;
//     var i;
//     var childlen;
//     var allfree;
//     var flags;
//     var name;
//     var local = {};
//     var scope = {};
//     var newglobal = {};
//     var newbound = {};
//     var newfree = {};

//     if (ste.blockType == ClassBlock) {
//         _dictUpdate(newglobal, global);
//         if (bound) {
//             _dictUpdate(newbound, bound);
//         }
//     }

//     for (name in ste.symFlags) {
//         flags = ste.symFlags[name];
//         this.analyzeName(ste, scope, name, flags, bound, local, free, global);
//     }

//     if (ste.blockType !== ClassBlock) {
//         if (ste.blockType === FunctionBlock) {
//             _dictUpdate(newbound, local);
//         }
//         if (bound) {
//             _dictUpdate(newbound, bound);
//         }
//         _dictUpdate(newglobal, global);
//     }

//     allfree = {};
//     childlen = ste.children.length;
//     for (i = 0; i < childlen; ++i) {
//         c = ste.children[i];
//         this.analyzeChildBlock(c, newbound, newfree, newglobal, allfree);
//         if (c.hasFree || c.childHasFree) {
//             ste.childHasFree = true;
//         }
//     }

//     _dictUpdate(newfree, allfree);
//     if (ste.blockType === FunctionBlock) {
//         this.analyzeCells(scope, newfree);
//     }
//     let discoveredFree = this.updateSymbols(ste.symFlags, scope, bound, newfree, ste.blockType === ClassBlock);
//     ste.hasFree = ste.hasFree || discoveredFree;

//     _dictUpdate(free, newfree);
// };

// SymbolTable.prototype.analyzeChildBlock = function (entry, bound, free, global, childFree) {
//     var tempGlobal;
//     var tempFree;
//     var tempBound = {};
//     _dictUpdate(tempBound, bound);
//     tempFree = {};
//     _dictUpdate(tempFree, free);
//     tempGlobal = {};
//     _dictUpdate(tempGlobal, global);

//     this.analyzeBlock(entry, tempBound, tempFree, tempGlobal);
//     _dictUpdate(childFree, tempFree);
// };

// SymbolTable.prototype.analyzeCells = function (scope, free) {
//     var flags;
//     var name;
//     for (name in scope) {
//         flags = scope[name];
//         if (flags !== LOCAL) {
//             continue;
//         }
//         if (free[name] === undefined) {
//             continue;
//         }
//         scope[name] = CELL;
//         delete free[name];
//     }
// };

// /**
//  * store scope info back into the st symbols dict. symbols is modified,
//  * others are not.
//  */
// SymbolTable.prototype.updateSymbols = function (symbols, scope, bound, free, classflag) {
//     var i;
//     var o;
//     var pos;
//     var freeValue;
//     var w;
//     var flags;
//     var name;
//     var discoveredFree = false;
//     for (name in symbols) {
//         flags = symbols[name];
//         w = scope[name];
//         flags |= w << SCOPE_OFF;
//         symbols[name] = flags;
//     }

//     freeValue = FREE << SCOPE_OFF;
//     pos = 0;
//     for (name in free) {
//         o = symbols[name];
//         if (o !== undefined) {
//             // it could be a free variable in a method of the class that has
//             // the same name as a local or global in the class scope
//             if (classflag && (o & (DEF_BOUND | DEF_GLOBAL))) {
//                 i = o | DEF_FREE_CLASS;
//                 symbols[name] = i;
//             }
//             // else it's not free, probably a cell
//             continue;
//         }
//         if (bound[name] === undefined) {
//             continue;
//         }
//         symbols[name] = freeValue;
//         discoveredFree = true;
//     }
//     return discoveredFree;
// };

// SymbolTable.prototype.analyzeName = function (ste, dict, name, flags, bound, local, free, global) {
//     if (flags & DEF_GLOBAL) {
//         if (flags & DEF_PARAM) {
//             throw new Sk.builtin.SyntaxError("name '" + name + "' is local and global", this.filename, ste.lineno);
//         }
//         dict[name] = GLOBAL_EXPLICIT;
//         global[name] = null;
//         if (bound && bound[name] !== undefined) {
//             delete bound[name];
//         }
//         return;
//     }
//     if (flags & DEF_BOUND) {
//         dict[name] = LOCAL;
//         local[name] = null;
//         delete global[name];
//         return;
//     }

//     if (bound && bound[name] !== undefined) {
//         dict[name] = FREE;
//         ste.hasFree = true;
//         free[name] = null;
//     }
//     else if (global && global[name] !== undefined) {
//         dict[name] = GLOBAL_IMPLICIT;
//     }
//     else {
//         if (ste.isNested) {
//             ste.hasFree = true;
//         }
//         dict[name] = GLOBAL_IMPLICIT;
//     }
// };

// SymbolTable.prototype.analyze = function () {
//     var free = {};
//     var global = {};
//     this.analyzeBlock(this.top, null, free, global);
// };

// /**
//  * @param {Object} ast
//  * @param {string} filename
//  */
// Sk.symboltable = function (ast, filename) {
//     var i;
//     var ret = new SymbolTable(filename);

//     ret.enterBlock("top", ModuleBlock, ast, 0);
//     ret.top = ret.cur;

//     //print(Sk.astDump(ast));
//     for (i = 0; i < ast.body.length; ++i) {
//         ret.visitStmt(ast.body[i]);
//     }

//     ret.exitBlock();

//     ret.analyze();

//     return ret;
// };

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

// Sk.exportSymbol("Sk.symboltable", Sk.symboltable);
// Sk.exportSymbol("Sk.dumpSymtab", Sk.dumpSymtab);
