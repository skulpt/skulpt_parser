// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

// deno-lint-ignore-file camelcase no-fallthrough

import type { Attrs, expr_context, expr, stmt, keyword, JoinedStr, Compare, cmpop } from "../ast/astnodes.ts";

import {
    alias,
    arg,
    arguments_,
    ASTKind,
    AsyncFunctionDef,
    Attribute,
    Call,
    ClassDef,
    Constant,
    FunctionDef,
    In,
    List,
    Load,
    Module,
    Name,
    Starred,
    Subscript,
    Tuple,
} from "../ast/astnodes.ts";
import { pyBytes, pyEllipsis, pyFalse, pyNone, pyTrue } from "../ast/constants.ts";
import { pySyntaxError } from "../ast/errors.ts";
import { DOT, ELLIPSIS } from "../tokenize/token.ts";
import type { TokenInfo } from "../tokenize/tokenize.ts";
import { assert } from "../util/assert.ts";
import type { Parser } from "./parser.ts";
import { FstringParser, parsestr } from "./parse_string.ts";
import {
    CmpopExprPair,
    EXTRA_EXPR,
    KeyValuePair,
    KeywordOrStarred,
    NameDefaultPair,
    SlashWithDefault,
    StarEtc,
    TARGETS_TYPE,
} from "./pegen_types.ts";

/** see pegen.h for implementation */
export function NEW_TYPE_COMMENT(_p: Parser, tc: TokenInfo | null): string | null {
    if (tc === null) {
        return null;
    }
    return new_type_comment(tc.string);
}

/** @todo pyTypes - at the moment this is just a js string or null */
export function new_type_comment(s: string | null): string | null {
    return s;
}

export function add_type_comment_to_arg(_p: Parser, a: arg, tc: TokenInfo | null): arg {
    if (tc === null) {
        return a;
    }

    return new arg(a.arg, a.annotation, tc.string, a.lineno, a.col_offset, a.end_lineno, a.end_col_offset);
}

export function new_identifier(/*p: Parser, */ n: string): string {
    // todo pull in the identifier check stuff we already have
    // this will have to return an interned python string
    return n;
}

export function _create_dummy_identifier(_p: Parser): string {
    return new_identifier("");
}

export function get_expr_name(e: expr): string {
    assert(e != null);
    switch (e._kind) {
        case ASTKind.Attribute:
        case ASTKind.Subscript:
        case ASTKind.Starred:
        case ASTKind.Name:
        case ASTKind.List:
        case ASTKind.Tuple:
        case ASTKind.Lambda:
            return e[Symbol.toStringTag].toLowerCase();
        case ASTKind.Call:
            return "function call";
        case ASTKind.BoolOp:
        case ASTKind.BinOp:
        case ASTKind.UnaryOp:
            return "operator";
        case ASTKind.GeneratorExp:
            return "generator expression";
        case ASTKind.Yield:
        case ASTKind.YieldFrom:
            return "yield expression";
        case ASTKind.Await:
            return "await expression";
        case ASTKind.ListComp:
            return "list comprehension";
        case ASTKind.SetComp:
            return "set comprehension";
        case ASTKind.DictComp:
            return "dict comprehension";
        case ASTKind.Dict:
            return "dict display";
        case ASTKind.Set_:
            return "set display";
        case ASTKind.JoinedStr:
        case ASTKind.FormattedValue:
            return "f-string expression";
        case ASTKind.Constant: {
            const value = (e as Constant).value;
            switch (value) {
                case pyNone:
                case pyFalse:
                case pyTrue:
                case pyEllipsis:
                    return value.toString();
                default:
                    return "literal";
            }
        }
        case ASTKind.Compare:
            return "comparison";
        case ASTKind.IfExp:
            return "conditional expression";
        case ASTKind.NamedExpr:
            return "named expression";
        default:
            throw new TypeError("unexpected expression in assignment");
    }
}

export function dummy_name(p: Parser): Name {
    // we don't care about caching yet, but it's a smart move when we're
    // creating big ol python string objects for this dummy thing everytime
    return new Name(_create_dummy_identifier(p), Load, 1, 0, 1, 0);
}

export interface NameTokenInfo extends TokenInfo {
    type: 1;
}

/** @todo */
export function interactive_exit(_p: Parser) {
    return null;
}

/* Creates a single-element asdl_seq* that contains a */
export function singleton_seq<A>(_p: Parser, a: A): A[] {
    return [a];
}

/* Creates a copy of seq and prepends a to it */
export function seq_insert_in_front<T>(p: Parser, a: T, seq: T[] | null): T[] {
    assert(a !== null);

    if (seq === null) {
        return singleton_seq(p, a);
    }

    return [a, ...seq];
}

/* Creates a copy of seq and appends a to it */
export function seq_append_to_end(_p: Parser, seq: expr[] | null, a: expr): expr[] {
    assert(a !== null);
    if (seq === null) {
        return [a];
    }
    return seq.concat(a);
}

/* Flattens an asdl_seq* of asdl_seq*s */
export function seq_flatten<A>(_p: Parser, seqs: A[][]): A[] {
    return seqs.flat();
}

/* Creates a new name of the form <first_name>.<second_name> */
export function join_names_with_dot(_p: Parser, first_name: Name, second_name: Name): Name {
    const first_identifier = first_name.id;
    const second_identifier = second_name.id;
    /** @todo if we make these pyStrings we'll have to change this */
    return new Name(first_identifier + "." + second_identifier, Load, ...EXTRA_EXPR(first_name, second_name));
}

class UnreachableException extends Error {}

function getNumDots(e: TokenInfo): number {
    switch (e.type) {
        case ELLIPSIS:
            return 3;
        case DOT:
            return 1;
        default:
            throw new UnreachableException();
    }
}

/* Counts the total number of dots in seq's tokens */
export function seq_count_dots(seq: TokenInfo[]): number {
    return seq.reduce((a, b) => a + getNumDots(b), 0);
}

/* Creates an alias with '*' as the identifier name */
export function alias_for_star(_p: Parser): alias {
    /** @todo should we inline this? */
    return new alias("*", null);
}

/* Creates a new asdl_seq* with the identifiers of all the names in seq */
export function map_names_to_ids(_p: Parser, seq: Name[]): string[] {
    return seq.map((e) => e.id);
}

export function get_cmpops(_p: Parser, seq: CmpopExprPair[]): cmpop[] {
    return seq.map((pair) => pair.cmpop);
}

export function get_exprs(_p: Parser, seq: CmpopExprPair[]): expr[] {
    return seq.map((pair) => pair.expr);
}

/* Creates an asdl_seq* where all the elements have been changed to have ctx as context */
function _set_seq_context(p: Parser, seq: expr[], ctx: expr_context) {
    return seq.map((e) => set_expr_context(p, e, ctx));
}

function _set_name_context(_p: Parser, e: Name, ctx: expr_context): Name {
    return new Name(e.id, ctx, ...EXTRA_EXPR(e));
}

function _set_tuple_context(p: Parser, e: Tuple, ctx: expr_context): Tuple {
    return new Tuple(_set_seq_context(p, e.elts, ctx), ctx, ...EXTRA_EXPR(e));
}

function _set_list_context(p: Parser, e: List, ctx: expr_context): List {
    return new List(_set_seq_context(p, e.elts, ctx), ctx, ...EXTRA_EXPR(e));
}

function _set_subscript_context(_p: Parser, e: Subscript, ctx: expr_context): Subscript {
    return new Subscript(e.value, e.slice, ctx, ...EXTRA_EXPR(e));
}

function _set_attribute_context(_p: Parser, e: Attribute, ctx: expr_context): Attribute {
    return new Attribute(e.value, e.attr, ctx, ...EXTRA_EXPR(e));
}

function _set_starred_context(p: Parser, e: Starred, ctx: expr_context): Starred {
    return new Starred(set_expr_context(p, e.value, ctx), ctx, ...EXTRA_EXPR(e));
}

/* Creates an `expr_ty` equivalent to `expr` but with `ctx` as context */
export function set_expr_context(p: Parser, e: expr, ctx: expr_context): expr {
    assert(e !== null);
    let newExpr: expr;
    switch (e._kind) {
        case ASTKind.Name:
            newExpr = _set_name_context(p, e as Name, ctx);
            break;
        case ASTKind.Tuple:
            newExpr = _set_tuple_context(p, e as Tuple, ctx);
            break;
        case ASTKind.List:
            newExpr = _set_list_context(p, e as List, ctx);
            break;
        case ASTKind.Subscript:
            newExpr = _set_subscript_context(p, e as Subscript, ctx);
            break;
        case ASTKind.Attribute:
            newExpr = _set_attribute_context(p, e as Attribute, ctx);
            break;
        case ASTKind.Starred:
            newExpr = _set_starred_context(p, e as Starred, ctx);
            break;
        default:
            newExpr = e;
    }
    return newExpr;
}

/* Extracts all keys from an asdl_seq* of KeyValuePair*'s */
export function get_keys(_p: Parser, seq: KeyValuePair[] | null): (expr | null)[] {
    if (seq === null) {
        return [];
    }

    return seq.map((kv) => kv.key);
}

/* Extracts all values from an asdl_seq* of KeyValuePair*'s */
export function get_values(_p: Parser, seq: KeyValuePair[] | null): expr[] {
    if (seq === null) {
        return [];
    }

    return seq.map((kv) => kv.value);
}

/* Constructs a NameDefaultPair */
export function name_default_pair<V>(p: Parser, arg: arg, value: V, tc: TokenInfo | null): NameDefaultPair<V> {
    const a = add_type_comment_to_arg(p, arg, tc);
    return new NameDefaultPair<V>(a, value);
}

export function join_sequences(_p: Parser, a: KeywordOrStarred[], b: KeywordOrStarred[]): KeywordOrStarred[] {
    return a.concat(b);
}

export function get_names(_p: Parser, names_with_defaults: NameDefaultPair[] | null): arg[] {
    if (names_with_defaults === null) {
        return [];
    }

    return names_with_defaults.map((pair) => pair.arg);
}

type exprOrNull<T> = T extends NameDefaultPair<infer R> ? (R extends expr ? R : expr | null) : expr | null;

export function get_defaults<T extends NameDefaultPair<exprOrNull<T>>>(
    _p: Parser,
    names_with_defaults: T[]
): exprOrNull<T>[] {
    return names_with_defaults.map((pair) => pair.value);
}

/* Constructs an arguments_ty object out of all the parsed constructs in the parameters rule */
export function make_arguments(
    p: Parser,
    slash_without_default: arg[] | null,
    slash_with_default: SlashWithDefault | null,
    plain_names: arg[] | null,
    names_with_default: NameDefaultPair<expr>[] | null,
    star_etc: StarEtc | null
): arguments_ {
    let posonlyargs: arg[] = [];
    if (slash_without_default !== null) {
        posonlyargs = slash_without_default;
    } else if (slash_with_default !== null) {
        const slash_with_default_names = get_names(p, slash_with_default.names_with_defaults);
        posonlyargs = slash_with_default.plain_names.concat(slash_with_default_names);
    }

    let posargs: arg[] = [];
    if (plain_names !== null && names_with_default !== null) {
        const names_with_default_names = get_names(p, names_with_default);
        posargs = plain_names.concat(names_with_default_names);
    } else if (plain_names === null && names_with_default !== null) {
        posargs = get_names(p, names_with_default);
    } else if (plain_names !== null && names_with_default === null) {
        posargs = plain_names;
    }

    let posdefaults: expr[] = [];
    if (slash_with_default !== null && names_with_default !== null) {
        const slash_with_default_values = get_defaults(p, slash_with_default.names_with_defaults);
        const names_with_default_values = get_defaults(p, names_with_default);
        posdefaults = slash_with_default_values.concat(names_with_default_values);
    } else if (slash_with_default === null && names_with_default !== null) {
        posdefaults = get_defaults(p, names_with_default);
    } else if (slash_with_default !== null && names_with_default === null) {
        posdefaults = get_defaults(p, slash_with_default.names_with_defaults);
    }

    let vararg: arg | null = null;
    if (star_etc !== null && star_etc.vararg !== null) {
        vararg = star_etc.vararg;
    }

    let kwonlyargs: arg[] = [];
    if (star_etc !== null && star_etc.kwonlyargs !== null) {
        kwonlyargs = get_names(p, star_etc.kwonlyargs);
    }

    let kwdefaults: (expr | null)[] = [];
    if (star_etc !== null && star_etc.kwonlyargs !== null) {
        kwdefaults = get_defaults(p, star_etc.kwonlyargs);
    }

    let kwarg: arg | null = null;
    if (star_etc !== null && star_etc.kwarg !== null) {
        kwarg = star_etc.kwarg;
    }

    return new arguments_(posonlyargs, posargs, vararg, kwonlyargs, kwdefaults, kwarg, posdefaults);
}

/* Constructs an empty arguments_ty object, that gets used when a function accepts no arguments. */
export function empty_arguments(_p: Parser): arguments_ {
    return new arguments_([], [], null, [], [], null, []);
}

/* Construct a FunctionDef equivalent to function_def, but with decorators */
export function function_def_decorators<T extends FunctionDef | AsyncFunctionDef>(
    _p: Parser,
    decorators: expr[],
    fdef: T
): T extends FunctionDef ? FunctionDef : AsyncFunctionDef {
    assert(fdef !== null);
    const NodeType = fdef._kind === ASTKind.FunctionDef ? FunctionDef : AsyncFunctionDef;
    return new NodeType(
        fdef.name,
        fdef.args,
        fdef.body,
        decorators,
        fdef.returns,
        fdef.type_comment,
        fdef.lineno,
        fdef.col_offset,
        fdef.end_lineno,
        fdef.end_col_offset
    );
}

/* Construct a ClassDef equivalent to class_def, but with decorators */
export function class_def_decorators(_p: Parser, decorators: expr[], class_def: ClassDef): ClassDef {
    assert(class_def !== null);
    return new ClassDef(
        class_def.name,
        class_def.bases,
        class_def.keywords,
        class_def.body,
        decorators,
        class_def.lineno,
        class_def.col_offset,
        class_def.end_lineno,
        class_def.end_col_offset
    );
}

/*
kwarg_or_starred[KeywordOrStarred*]:
    | a=NAME '=' b=expression {
        _PyPegen_keyword_or_starred(p, CHECK(_Py_keyword(a->v.Name.id, b, EXTRA)), 0) } <<-- here
    | a=starred_expression { _PyPegen_keyword_or_starred(p, a, 0) } <<-- here
    | invalid_kwarg
*/

function isKeyword(kw: KeywordOrStarred): kw is KeywordOrStarred<true> {
    return kw.is_keyword;
}

function isStarred(kw: KeywordOrStarred): kw is KeywordOrStarred<false> {
    return !kw.is_keyword;
}

/* Extract the starred expressions of an asdl_seq* of KeywordOrStarred*s */
export function seq_extract_starred_exprs(_p: Parser, kwargs: KeywordOrStarred[]): Starred[] {
    return kwargs.filter(isStarred).map((kw) => kw.element);
}

/* Return a new asdl_seq* with only the keywords in kwargs */
export function seq_delete_starred_exprs(_p: Parser, kwargs: KeywordOrStarred[]): keyword[] {
    return kwargs.filter(isKeyword).map((kw) => kw.element);
}

const encoder = new TextEncoder();

/** concatenate strings from python like `'foo' 'bar'` */
export function concatenate_strings(p: Parser, tokens: TokenInfo[]): JoinedStr | Constant {
    const first = tokens[0];
    const last = tokens[tokens.length - 1];
    const fstringParser = new FstringParser(p, first, last);

    let bytesmode: boolean | null = null;
    let bytestr = "";

    for (const t of tokens) {
        const [s, fmode, this_bytesmode, rawmode] = parsestr(p, t);
        if (bytesmode !== null && bytesmode !== this_bytesmode) {
            p.raise_error(pySyntaxError, "cannot mix bytes and nonbytes literals");
        }
        bytesmode = this_bytesmode;
        if (fmode) {
            fstringParser.concatFstring(s, 0, s.length, rawmode, 0, t);
            /** @todo */
        } else if (bytesmode) {
            bytestr += s;
        } else {
            /* This is a regular string. Concatenate it. */
            fstringParser.concat(s);
        }
    }
    if (bytesmode) {
        const [lineno, col_offset] = tokens[0].start;
        const [end_lineno, end_col_offset] = tokens[tokens.length - 1].end;
        return new Constant(
            new pyBytes(encoder.encode(bytestr)),
            null,
            lineno,
            col_offset,
            end_lineno,
            end_col_offset
        );
    }

    return fstringParser.finish();
}

export function make_module(_p: Parser, a: stmt[] | null): Module {
    // Ingoring the #type: ignore comment mangling here
    return new Module(a ?? [], []);
}

/** Error reporting helpers */
export function get_invalid_target(e: expr | null, targets_type: TARGETS_TYPE): expr | null {
    if (e === null) {
        return null;
    }
    function _visit_container(container: List | Tuple) {
        for (const other of container.elts) {
            const child = get_invalid_target(other, targets_type);
            if (child !== null) {
                return child;
            }
        }
        return null;
    }

    switch (e._kind) {
        case ASTKind.List:
            return _visit_container(e as List);
        case ASTKind.Tuple:
            return _visit_container(e as Tuple);
        case ASTKind.Starred:
            return get_invalid_target((e as Starred).value, targets_type);
        case ASTKind.Compare:
            // This is needed, because the `a in b` in `for a in b` gets parsed
            // as a comparison, and so we need to search the left side of the comparison
            // for invalid targets.\
            if (targets_type == TARGETS_TYPE.FOR_TARGETS) {
                const cmpopVal = (e as Compare).ops[0];
                if (cmpopVal === In) {
                    return get_invalid_target((e as Compare).left, targets_type);
                }
                return null;
            }
            return e;
        case ASTKind.Name:
        case ASTKind.Subscript:
        case ASTKind.Attribute:
            return null;
        default:
            return e;
    }
}

export function arguments_parsing_error(p: Parser, e: Call) {
    let msg: string;
    if (e.keywords.some((k) => k.arg === null)) {
        msg = "positional argument follows keyword argument unpacking";
    } else {
        msg = "positional argument follows keyword argument";
    }
    return p.raise_error(pySyntaxError, msg);
}

export function nonparen_genexp_in_call(p: Parser, c: Call) {
    /* The rule that calls this function is 'args for_if_clauses'.
       For the input f(L, x for x in y), L and x are in args and
       the for is parsed as a for_if_clause. We have to check if
       len <= 1, so that input like dict((a, b) for a, b in x)
       gets successfully parsed and then we pass the last
       argument (x in the above example) as the location of the
       error */
    const args = c.args;
    if (args.length <= 1) {
        return null;
    }

    const { lineno, col_offset } = args[args.length - 1];
    return p.raise_error_known_location(
        pySyntaxError,
        lineno,
        col_offset + 1,
        "Generator expression must be parenthesized"
    );
}

export function collect_call_seqs(p: Parser, a: expr[], b: KeywordOrStarred[] | null, ...attrs: Attrs): Call {
    if (b === null) {
        return new Call(dummy_name(p), a, [], ...attrs);
    }

    const starreds = seq_extract_starred_exprs(p, b);
    const keywords = seq_delete_starred_exprs(p, b);
    const args = a.concat(starreds);

    return new Call(dummy_name(p), args, keywords, ...attrs);
}
