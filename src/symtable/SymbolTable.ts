// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import type * as astnode from "../ast/astnodes.ts";
import { ASTKind, Load, mod } from "../ast/astnodes.ts";
import { GenericASTVisitor } from "../ast/generic_visitor.ts";
import { pySyntaxError } from "../mock_types/errors.ts";
import { assert } from "../util/assert.ts";
import { SymbolTableScope } from "./SymbolTableScope.ts";
import { SYMTAB_CONSTS, mangle, BlockType, NameToFlag } from "./util.ts";

export class SymbolTable extends GenericASTVisitor {
    cur: SymbolTableScope | null = null;
    top: SymbolTableScope | null = null;
    stack: SymbolTableScope[] = [];
    global: NameToFlag = {};
    private: string | null = null;
    blocks = new Map<astnode.AST, SymbolTableScope>();

    // deno-lint-ignore no-explicit-any
    constructor(readonly filename: string, _future: any) {
        super();
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
        e.value.walkabout(this);
        e.target.walkabout(this);
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
        outermost.iter.walkabout(this);

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
        outermost.target.walkabout(this);
        this.cur.compIterTarget = false;

        /* Visit the rest of the comprehension body */
        this.visitSeq(outermost.ifs);

        this.visitSeq(generators.slice(1));
        if (value) {
            value.walkabout(this);
        }

        elt.walkabout(this);

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

    visit_GeneratorExp(e: astnode.GeneratorExp) {
        return this.handleComprehension(e, "genexpr", e.generators, e.elt, null);
    }

    visit_ListComp(e: astnode.ListComp) {
        return this.handleComprehension(e, "listcomp", e.generators, e.elt, null);
    }

    visit_SetComp(e: astnode.SetComp) {
        return this.handleComprehension(e, "setcomp", e.generators, e.elt, null);
    }

    visit_DictComp(e: astnode.DictComp) {
        return this.handleComprehension(e, "dictcomp", e.generators, e.key, e.value);
    }

    visitComprehension(lc: astnode.comprehension) {
        assert(this.cur);
        this.cur.compIterTarget = true;
        lc.target.walkabout(this);
        this.cur.compIterTarget = false;
        this.cur.compIterExpr++;
        lc.iter.walkabout(this);
        this.cur.compIterExpr--;
        this.visitSeq(lc.ifs);
        if (lc.is_async) {
            this.cur.coroutine = true;
        }
    }

    visitParams(args: astnode.arg[]) {
        for (const a of args) {
            this.addDef(a.arg, SYMTAB_CONSTS.DEF_PARAM);
        }
    }

    visit_arguments_(a: astnode.arguments_) {
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
            a.annotation?.walkabout(this);
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
        annotation.walkabout(this);
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
            a.vararg.annotation.walkabout(this);
        }
        if (a.kwarg && a.kwarg.annotation) {
            a.kwarg.annotation.walkabout(this);
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

    visit_ExceptHandler(eh: astnode.ExceptHandler) {
        if (eh.type) {
            eh.type.walkabout(this);
        }
        if (eh.name) {
            this.addDef(eh.name, SYMTAB_CONSTS.DEF_LOCAL);
        }
        this.visitSeq(eh.body);
    }

    visit_FunctionDef(funcDef: astnode.FunctionDef) {
        this.addDef(funcDef.name, SYMTAB_CONSTS.DEF_LOCAL);
        if (funcDef.args.defaults.length !== 0) {
            this.visitSeq(funcDef.args.defaults);
        }
        if (funcDef.decorator_list.length !== 0) {
            this.visitSeq(funcDef.decorator_list);
        }

        this.visitAnnotations(funcDef.args, funcDef.returns);
        this.enterBlock(funcDef.name, BlockType.FunctionBlock, funcDef, funcDef.lineno, funcDef.col_offset);
        funcDef.args.walkabout(this);
        this.visitSeq(funcDef.body);
        this.exitBlock();
    }

    visit_AsyncFunctionDef(asyncFunctionDef: astnode.AsyncFunctionDef) {
        assert(this.cur !== null);
        this.addDef(asyncFunctionDef.name, SYMTAB_CONSTS.DEF_LOCAL);
        if (asyncFunctionDef.args.defaults.length !== 0) {
            this.visitSeq(asyncFunctionDef.args.defaults);
        }
        if (asyncFunctionDef.args.kw_defaults.length !== 0) {
            this.visitSeq(asyncFunctionDef.args.kw_defaults);
        }
        this.visitAnnotations(asyncFunctionDef.args, asyncFunctionDef.returns);

        if (asyncFunctionDef.decorator_list.length !== 0) {
            this.visitSeq(asyncFunctionDef.decorator_list);
        }

        this.enterBlock(
            asyncFunctionDef.name,
            BlockType.FunctionBlock,
            asyncFunctionDef,
            asyncFunctionDef.lineno,
            asyncFunctionDef.col_offset
        );

        this.cur.coroutine = true;

        asyncFunctionDef.args.walkabout(this);
        this.visitSeq(asyncFunctionDef.body);
        this.exitBlock();
    }

    visit_ClassDef(classDef: astnode.ClassDef) {
        this.addDef(classDef.name, SYMTAB_CONSTS.DEF_LOCAL);
        this.visitSeq(classDef.bases);
        this.visitSeq(classDef.keywords);
        if (classDef.decorator_list.length !== 0) {
            this.visitSeq(classDef.decorator_list);
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
        this.visitSeq(classDef.body);
        this.private = tmp;
        this.exitBlock();
    }

    visit_Return(node: astnode.Return) {
        assert(this.cur);
        if (node.value) {
            super.visit_Return(node);
            this.cur.returnsValue = true;
        }
    }

    visit_AnnAssign(annAssign: astnode.AnnAssign) {
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
                    [this.filename, annAssign.lineno, annAssign.col_offset + 1, ""]
                );
            }

            if (annAssign.simple) {
                this.addDef(eName.id, SYMTAB_CONSTS.DEF_ANNOT | SYMTAB_CONSTS.DEF_LOCAL);
            } else if (annAssign.value) {
                this.addDef(eName.id, SYMTAB_CONSTS.DEF_LOCAL);
            }
        } else {
            annAssign.target.walkabout(this);
        }
        annAssign.annotation.walkabout(this);
        if (annAssign.value) {
            annAssign.value.walkabout(this);
        }
    }

    visit_alias(a: astnode.alias) {
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

    visit_Yield(yield_: astnode.Yield) {
        assert(this.cur !== null);
        yield_.value?.walkabout(this);
        this.cur.generator = true;
    }

    visit_YieldFrom(yield_: astnode.YieldFrom) {
        assert(this.cur !== null);
        yield_.value.walkabout(this);
        this.cur.generator = true;
    }

    visit_Await(await_: astnode.Await) {
        assert(this.cur !== null);
        await_.value.walkabout(this);
        this.cur.coroutine = true;
    }

    visit_Global(global: astnode.Global) {
        for (const name of global.names) {
            const cur = this.lookup(name);
            if (
                cur &
                (SYMTAB_CONSTS.DEF_PARAM | SYMTAB_CONSTS.DEF_LOCAL | SYMTAB_CONSTS.USE | SYMTAB_CONSTS.DEF_ANNOT)
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

                throw new pySyntaxError(msg, [this.filename, global.lineno, global.col_offset + 1, ""]);
            }
            this.addDef(name, SYMTAB_CONSTS.DEF_GLOBAL);
            this.recordDirective(name, global.lineno, global.col_offset);
        }
    }

    visit_Nonlocal(nonlocal: astnode.Nonlocal) {
        for (const name of nonlocal.names) {
            const cur = this.lookup(name);
            if (
                cur &
                (SYMTAB_CONSTS.DEF_PARAM | SYMTAB_CONSTS.DEF_LOCAL | SYMTAB_CONSTS.USE | SYMTAB_CONSTS.DEF_ANNOT)
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

                throw new pySyntaxError(msg, [this.filename, nonlocal.lineno, nonlocal.col_offset + 1, ""]);
            }
            this.addDef(name, SYMTAB_CONSTS.DEF_NONLOCAL);
            this.recordDirective(name, nonlocal.lineno, nonlocal.col_offset);
        }
    }

    visit_Lambda(lambda: astnode.Lambda) {
        if (lambda.args.defaults.length !== 0) {
            this.visitSeq(lambda.args.defaults);
        }
        if (lambda.args.kw_defaults.length !== 0) {
            this.visitSeq(lambda.args.kw_defaults);
        }
        this.enterBlock(
            "lambda",
            BlockType.FunctionBlock,
            lambda,
            lambda.lineno,
            lambda.col_offset,
            lambda.end_lineno,
            lambda.end_col_offset
        );
        lambda.args.walkabout(this);
        lambda.body.walkabout(this);
        this.exitBlock();
    }

    visit_NamedExpr(namedExpr: astnode.NamedExpr) {
        this.handleNamedExpr(namedExpr);
    }

    visit_Name(name: astnode.Name) {
        assert(this.cur);
        this.addDef(name.id, name.ctx === Load ? SYMTAB_CONSTS.USE : SYMTAB_CONSTS.DEF_LOCAL);
        /* Special-case super: it counts as a use of __class__ */
        if (name.ctx === Load && this.cur.blockType === BlockType.FunctionBlock && name.id === "super") {
            this.addDef("__class__", SYMTAB_CONSTS.USE);
        }
    }

    analyze() {
        assert(this.top);
        const free = new Set<string>();
        const global = new Set<string>();
        this.top.analyzeBlock(null, free, global);
    }
}
