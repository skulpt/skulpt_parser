// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import type * as astnode from "../ast/astnodes.ts";
import { ASTKind, Load } from "../ast/astnodes.ts";
import { pySyntaxError } from "../mock_types/errors.ts";
import { assert } from "../util/assert.ts";
import { SymbolTableScope } from "./SymbolTableScope.ts";
import { SYMTAB_CONSTS, mangle, BlockType, NameToFlag } from "./util.ts";

export class SymbolTable {
    filename: string;
    cur: SymbolTableScope | null = null;
    top: SymbolTableScope | null = null;
    stack: SymbolTableScope[] = [];
    global: NameToFlag = {};
    private: string | null = null;
    blocks = new Map<astnode.AST, SymbolTableScope>();

    // deno-lint-ignore no-explicit-any
    constructor(filename: string, _future: any) {
        this.filename = filename;
    }

    lookupScope(ast: astnode.AST) {
        const v = this.blocks.get(ast);
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
                    curSte.colOffset + 1,
                    "",
                ]);
            }
            val |= flag;
        } else {
            val = flag;
        }

        if (curSte.compIterTarget) {
            /* This name is an iteration variable in a comprehension,
             * so check for a binding conflict with any named expressions.
             * Otherwise, mark it as an iteration variable so subsequent
             * named expressions can check for conflicts.
             */
            if (val & (SYMTAB_CONSTS.DEF_GLOBAL | SYMTAB_CONSTS.DEF_NONLOCAL)) {
                throw new pySyntaxError(
                    `comprehension inner loop cannot rebind assignment expression target '${name}'`,
                    [this.filename, curSte.lineno, curSte.colOffset + 1, ""]
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
        for (let i = start; i < nodes.length; i++) {
            const node = nodes[i];
            if (node) {
                visitor.call(this, node);
            }
        }
    }

    SEQ<T>(visitor: (node: T) => void, nodes: (T | null)[]) {
        assert(Array.isArray(nodes), "SEQ: nodes isn't array? got " + typeof nodes);
        for (const node of nodes) {
            if (node) {
                visitor.call(this, node);
            }
        }
    }

    recordDirective(name: string, lineno: number, colOffset: number) {
        assert(this.cur !== null);

        this.cur.directives.push([mangle(this.private, name), lineno, colOffset]);
    }

    extendNamedexprScope(e: astnode.Name) {
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

            /* If we find a BlockType.FunctionBlock entry, add as astnode.GLOBAL/LOCAL or NONLOCAL/LOCAL */
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
            /* If we find a BlockType.ModuleBlock entry, add as astnode.GLOBAL */
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

    handleNamedExpr(e: astnode.NamedExpr) {
        assert(this.cur !== null, "need current scope for namedExpr");
        if (this.cur.compIterExpr > 0) {
            throw new pySyntaxError("Assignment isn't allowed in a comprehension iterable expression", [
                this.filename,
                e.lineno,
                e.col_offset,
                "",
            ]);
        }
        if (this.cur.comprehension) {
            /* Inside a comprehension body, so find the right target scope */
            this.extendNamedexprScope(e.target as astnode.Name);
        }
        this.visitExpr(e.value);
        this.visitExpr(e.target);
    }

    enterBlock(
        name: string,
        block: BlockType,
        ast: astnode.AST,
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

        /* bpo-37757: astnode.For now, disallow *all* assignment expressions in the
         * outermost iterator expression of a comprehension, even those inside
         * a nested comprehension or a lambda expression.
         */
        if (prev) {
            ste.compIterExpr = prev.compIterExpr;
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
            this.stack.pop();
            this.cur = this.stack[this.stack.length - 1] || null;
        }
    }

    implicitArg(pos: number) {
        this.addDef(`.${pos}`, SYMTAB_CONSTS.DEF_PARAM);
    }

    handleComprehension(
        e: astnode.GeneratorExp | astnode.ListComp | astnode.SetComp | astnode.DictComp,
        scopeName: string,
        generators: astnode.comprehension[],
        elt: astnode.expr,
        value: astnode.expr | null
    ) {
        assert(this.cur);
        const isGenerator = e._kind === ASTKind.GeneratorExp;
        const outermost = generators[0];
        /* Outermost iterator is evaluated in current scope */
        this.cur.compIterExpr++;
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
        this.cur.compIterTarget = true;
        this.visitExpr(outermost.target);
        this.cur.compIterTarget = false;

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
                [this.filename, e.lineno, e.col_offset + 1, ""]
            );
        }

        this.cur.generator = isGenerator;
        const isAsync = this.cur.coroutine && !isGenerator;
        this.exitBlock();
        if (isAsync) {
            this.cur.coroutine = true;
        }
    }

    visitKeyword(k: astnode.keyword) {
        this.visitExpr(k.value);
    }

    visitGenexp(e: astnode.GeneratorExp) {
        return this.handleComprehension(e, "genexpr", e.generators, e.elt, null);
    }

    visitListcomp(e: astnode.ListComp) {
        return this.handleComprehension(e, "listcomp", e.generators, e.elt, null);
    }

    visitSetcomp(e: astnode.SetComp) {
        return this.handleComprehension(e, "setcomp", e.generators, e.elt, null);
    }

    visitDictcomp(e: astnode.DictComp) {
        return this.handleComprehension(e, "dictcomp", e.generators, e.key, e.value);
    }

    visitComprehension(lc: astnode.comprehension) {
        assert(this.cur);
        this.cur.compIterTarget = true;
        this.visitExpr(lc.target);
        this.cur.compIterTarget = false;
        this.cur.compIterExpr++;
        this.visitExpr(lc.iter);
        this.cur.compIterExpr--;
        this.SEQ(this.visitExpr, lc.ifs);
        if (lc.is_async) {
            this.cur.coroutine = true;
        }
    }

    visitExpr(e: astnode.expr) {
        switch (e._kind) {
            case ASTKind.NamedExpr:
                this.handleNamedExpr(e as astnode.NamedExpr);
                break;
            case ASTKind.BoolOp:
                this.SEQ(this.visitExpr, (e as astnode.BoolOp).values);
                break;
            case ASTKind.BinOp: {
                const binOp = e as astnode.BinOp;
                this.visitExpr(binOp.left);
                this.visitExpr(binOp.right);
                break;
            }
            case ASTKind.UnaryOp:
                this.visitExpr((e as astnode.UnaryOp).operand);
                break;
            case ASTKind.Lambda: {
                const lambda = e as astnode.Lambda;
                if (lambda.args.defaults.length !== 0) {
                    this.SEQ(this.visitExpr, lambda.args.defaults);
                }
                if (lambda.args.kw_defaults.length !== 0) {
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
                const ifExp = e as astnode.IfExp;
                this.visitExpr(ifExp.test);
                this.visitExpr(ifExp.body);
                this.visitExpr(ifExp.orelse);
                break;
            }
            case ASTKind.Dict: {
                const dict = e as astnode.Dict;
                this.SEQ(this.visitExpr, dict.keys);
                this.SEQ(this.visitExpr, dict.values);
                break;
            }
            case ASTKind.Set_:
                this.SEQ(this.visitExpr, (e as astnode.Set_).elts);
                break;
            case ASTKind.GeneratorExp:
                this.visitGenexp(e as astnode.GeneratorExp);
                break;
            case ASTKind.ListComp:
                this.visitListcomp(e as astnode.ListComp);
                break;
            case ASTKind.SetComp:
                this.visitSetcomp(e as astnode.SetComp);
                break;
            case ASTKind.DictComp:
                this.visitDictcomp(e as astnode.DictComp);
                break;
            case ASTKind.Yield: {
                assert(this.cur !== null);
                const yield_ = e as astnode.Yield;
                if (yield_.value) {
                    this.visitExpr(yield_.value);
                }
                this.cur.generator = true;
                break;
            }
            case ASTKind.YieldFrom:
                assert(this.cur !== null);
                this.visitExpr((e as astnode.YieldFrom).value);
                this.cur.generator = true;
                break;
            case ASTKind.Await:
                assert(this.cur !== null);
                this.visitExpr((e as astnode.Await).value);
                this.cur.coroutine = true;
                break;
            case ASTKind.Compare: {
                const compare = e as astnode.Compare;
                this.visitExpr(compare.left);
                this.SEQ(this.visitExpr, compare.comparators);
                break;
            }
            case ASTKind.Call: {
                const call = e as astnode.Call;
                this.visitExpr(call.func);
                this.SEQ(this.visitExpr, call.args);
                this.SEQ(this.visitKeyword, call.keywords);
                break;
            }
            case ASTKind.FormattedValue: {
                const formattedValue = e as astnode.FormattedValue;
                this.visitExpr(formattedValue.value);
                if (formattedValue.format_spec) {
                    this.visitExpr(formattedValue.format_spec);
                }
                break;
            }
            case ASTKind.JoinedStr: {
                this.SEQ(this.visitExpr, (e as astnode.JoinedStr).values);
                break;
            }
            case ASTKind.Constant:
                /* Nothing to do here. */
                break;
            /* The following exprs can be assignment targets. */
            case ASTKind.Attribute:
                this.visitExpr((e as astnode.Attribute).value);
                break;
            case ASTKind.Subscript: {
                const subscript = e as astnode.Subscript;
                this.visitExpr(subscript.value);
                this.visitExpr(subscript.slice);
                break;
            }
            case ASTKind.Starred:
                this.visitExpr((e as astnode.Starred).value);
                break;
            case ASTKind.Slice: {
                const slice = e as astnode.Slice;
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
                const name = e as astnode.Name;
                this.addDef(name.id, name.ctx === Load ? SYMTAB_CONSTS.USE : SYMTAB_CONSTS.DEF_LOCAL);
                /* Special-case super: it counts as a use of __class__ */
                if (name.ctx === Load && this.cur.blockType === BlockType.FunctionBlock && name.id === "super") {
                    this.addDef("__class__", SYMTAB_CONSTS.USE);
                }
                break;
            }
            /* child nodes of List and Tuple will have expr_context set */
            case ASTKind.List:
                this.SEQ(this.visitExpr, (e as astnode.List).elts);
                break;
            case ASTKind.Tuple:
                this.SEQ(this.visitExpr, (e as astnode.Tuple).elts);
                break;
        }
    }

    visitParams(args: astnode.arg[]) {
        for (const a of args) {
            this.addDef(a.arg, SYMTAB_CONSTS.DEF_PARAM);
        }
    }

    visitArguments(a: astnode.arguments_) {
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

    visitArgannotations(args: astnode.arg[]) {
        for (const a of args) {
            if (a.annotation) {
                this.visitExpr(a.annotation);
            }
        }
    }

    visitAnnotation(annotation: astnode.expr) {
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

    visitAnnotations(a: astnode.arguments_, returns: astnode.expr | null) {
        // int future_annotations = st->st_future->ff_features & CO_FUTURE_ANNOTATIONS;
        // if (future_annotations &&
        //     !symtable_enter_block(st, GET_IDENTIFIER(_annotation), AnnotationBlock,
        //                           (void *)o, o->lineno, o->col_offset, o->end_lineno,
        //                           o->end_col_offset)) {
        //     VISIT_QUIT(st, 0);
        // }
        if (a.posonlyargs.length !== 0) {
            this.visitArgannotations(a.posonlyargs);
        }
        if (a.args.length !== 0) {
            this.visitArgannotations(a.args);
        }
        if (a.vararg && a.vararg.annotation) {
            this.visitExpr(a.vararg.annotation);
        }
        if (a.kwarg && a.kwarg.annotation) {
            this.visitExpr(a.kwarg.annotation);
        }
        if (a.kwonlyargs.length !== 0) {
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

    visitAlias(a: astnode.alias) {
        /* Compute storeName, the name actually bound by the import
           operation.  It is different than a->name when a->name is a
           dotted package name (e.g. spam.eggs)
        */
        const name = a.asname ?? a.name;
        const dot = name.indexOf(".");
        let storeName: string;

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
                    this.cur.colOffset + 1,
                    "",
                ]);
            }
        }
    }

    visitWithItem(item: astnode.withitem) {
        this.visitExpr(item.context_expr);
        if (item.optional_vars) {
            this.visitExpr(item.optional_vars);
        }
    }

    visitExcepthandler(eh: astnode.ExceptHandler) {
        if (eh.type) {
            this.visitExpr(eh.type);
        }
        if (eh.name) {
            this.addDef(eh.name, SYMTAB_CONSTS.DEF_LOCAL);
        }
        this.SEQ(this.visitStmt, eh.body);
    }

    visitStmt(s: astnode.stmt) {
        assert(s !== undefined, "visitStmt called with undefined");
        switch (s._kind) {
            case ASTKind.FunctionDef: {
                const funcDef = s as astnode.FunctionDef;
                this.addDef(funcDef.name, SYMTAB_CONSTS.DEF_LOCAL);
                if (funcDef.args.defaults.length !== 0) {
                    this.SEQ(this.visitExpr, funcDef.args.defaults);
                }
                if (funcDef.decorator_list.length !== 0) {
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
                const classDef = s as astnode.ClassDef;
                this.addDef(classDef.name, SYMTAB_CONSTS.DEF_LOCAL);
                this.SEQ(this.visitExpr, classDef.bases);
                this.SEQ(this.visitKeyword, classDef.keywords);
                if (classDef.decorator_list.length !== 0) {
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
                const tmp = this.private;
                this.private = classDef.name;
                this.SEQ(this.visitStmt, classDef.body);
                this.private = tmp;
                this.exitBlock();
                break;
            }
            case ASTKind.Return: {
                assert(this.cur);
                const return_ = s as astnode.Return;
                if (return_.value) {
                    this.visitExpr(return_.value);
                    this.cur.returnsValue = true;
                }
                break;
            }
            case ASTKind.Delete:
                this.SEQ(this.visitExpr, (s as astnode.Delete).targets);
                break;
            case ASTKind.Assign: {
                const assign = s as astnode.Assign;
                this.SEQ(this.visitExpr, assign.targets);
                this.visitExpr(assign.value);
                break;
            }
            case ASTKind.AnnAssign: {
                const annAssign = s as astnode.AnnAssign;
                if (annAssign.target._kind === ASTKind.Name) {
                    assert(this.cur);
                    const eName = annAssign.target as astnode.Name;
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
                            [this.filename, s.lineno, s.col_offset + 1, ""]
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
                const augAssign = s as astnode.AugAssign;

                this.visitExpr(augAssign.target);
                this.visitExpr(augAssign.value);
                break;
            }
            case ASTKind.For: {
                const for_ = s as astnode.For;

                this.visitExpr(for_.target);
                this.visitExpr(for_.iter);
                this.SEQ(this.visitStmt, for_.body);
                if (for_.orelse.length !== 0) {
                    this.SEQ(this.visitStmt, for_.orelse);
                }
                break;
            }
            case ASTKind.While: {
                const while_ = s as astnode.While;

                this.visitExpr(while_.test);
                this.SEQ(this.visitStmt, while_.body);
                if (while_.orelse.length !== 0) {
                    this.SEQ(this.visitStmt, while_.orelse);
                }
                break;
            }
            case ASTKind.If: {
                const if_ = s as astnode.If;

                /* XXX if 0: and lookup_yield() hacks */
                this.visitExpr(if_.test);
                this.SEQ(this.visitStmt, if_.body);
                if (if_.orelse.length !== 0) {
                    this.SEQ(this.visitStmt, if_.orelse);
                }
                break;
            }
            case ASTKind.Raise: {
                const raise = s as astnode.Raise;

                if (raise.exc) {
                    this.visitExpr(raise.exc);
                    if (raise.cause) {
                        this.visitExpr(raise.cause);
                    }
                }
                break;
            }
            case ASTKind.Try: {
                const try_ = s as astnode.Try;

                this.SEQ(this.visitStmt, try_.body);
                this.SEQ(this.visitStmt, try_.orelse);
                this.SEQ(
                    this.visitExcepthandler,
                    try_.handlers as astnode.ExceptHandler[]
                ); /** @todo Update asdl to make `handlers` of type ExceptHandler[] */
                this.SEQ(this.visitStmt, try_.finalbody);
                break;
            }
            case ASTKind.Assert: {
                const assert = s as astnode.Assert;
                this.visitExpr(assert.test);
                if (assert.msg) {
                    this.visitExpr(assert.msg);
                }
                break;
            }
            case ASTKind.Import: {
                const import_ = s as astnode.Import;
                this.SEQ(this.visitAlias, import_.names);
                break;
            }
            case ASTKind.ImportFrom: {
                const importFrom = s as astnode.ImportFrom;
                this.SEQ(this.visitAlias, importFrom.names);
                break;
            }
            case ASTKind.Global: {
                const global = s as astnode.Global;

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

                        throw new pySyntaxError(msg, [this.filename, s.lineno, s.col_offset + 1, ""]);
                    }
                    this.addDef(name, SYMTAB_CONSTS.DEF_GLOBAL);
                    this.recordDirective(name, s.lineno, s.col_offset);
                }
                break;
            }
            case ASTKind.Nonlocal: {
                const nonlolal = s as astnode.Nonlocal;

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

                        throw new pySyntaxError(msg, [this.filename, s.lineno, s.col_offset + 1, ""]);
                    }
                    this.addDef(name, SYMTAB_CONSTS.DEF_NONLOCAL);
                    this.recordDirective(name, s.lineno, s.col_offset);
                }
                break;
            }
            case ASTKind.Expr: {
                this.visitExpr((s as astnode.Expr).value);
                break;
            }
            case ASTKind.Pass:
            case ASTKind.Break:
            case ASTKind.Continue:
                /* nothing to do here */
                break;
            case ASTKind.With: {
                const with_ = s as astnode.With;
                this.SEQ(this.visitWithItem, with_.items);
                this.SEQ(this.visitStmt, with_.body);
                break;
            }
            case ASTKind.AsyncFunctionDef: {
                assert(this.cur);
                const asyncFunctionDef = s as astnode.AsyncFunctionDef;

                this.addDef(asyncFunctionDef.name, SYMTAB_CONSTS.DEF_LOCAL);
                if (asyncFunctionDef.args.defaults.length !== 0) {
                    this.SEQ(this.visitExpr, asyncFunctionDef.args.defaults);
                }
                if (asyncFunctionDef.args.kw_defaults.length !== 0) {
                    this.SEQ(this.visitExpr, asyncFunctionDef.args.kw_defaults);
                }
                this.visitAnnotations(asyncFunctionDef.args, asyncFunctionDef.returns);

                if (asyncFunctionDef.decorator_list.length !== 0) {
                    this.SEQ(this.visitExpr, asyncFunctionDef.decorator_list);
                }

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
                const asyncWith = s as astnode.AsyncWith;
                this.SEQ(this.visitWithItem, asyncWith.items);
                this.SEQ(this.visitStmt, asyncWith.body);
                break;
            }
            case ASTKind.AsyncFor: {
                const asyncFor = s as astnode.AsyncFor;
                this.visitExpr(asyncFor.target);
                this.visitExpr(asyncFor.iter);
                this.SEQ(this.visitStmt, asyncFor.body);
                if (asyncFor.orelse.length !== 0) {
                    this.SEQ(this.visitStmt, asyncFor.orelse);
                }
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
