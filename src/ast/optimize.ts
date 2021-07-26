// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

/**
 * This file is based on ast_opt.c from cpython: https://github.com/python/cpython/blob/v3.9.5/Python/ast_opt.c
 * and optimize.py from pypy:  https://github.com/mozillazg/pypy/blob/master/pypy/interpreter/astcompiler/optimize.py
 */
import type { AST, BinOp, BoolOp, cmpop, Compare, expr, mod, Subscript, Tuple, UnaryOp } from "./astnodes.ts";
import {
    Add,
    And,
    ASTVisitor,
    ASTKind,
    BitAnd,
    BitOr,
    BitXor,
    Constant,
    Div,
    FloorDiv,
    In,
    Invert,
    Is,
    IsNot,
    Load,
    LShift,
    Mod,
    Not,
    NotIn,
    Mult,
    Pow,
    RShift,
    Sub,
    UAdd,
    USub,
} from "./astnodes.ts";
import { pyFalse, pyTrue, pyTuple } from "../mock_types/constants.ts";
import type { pyConstant } from "../mock_types/constants.ts";
import {
    pyAdd,
    pyAnd,
    pyDiv,
    pyFloorDiv,
    pyGetItem,
    pyInvert,
    pyIsTrue,
    pyLshift,
    pyMod,
    pyMult,
    pyNeg,
    pyOr,
    pyPos,
    pyPow,
    pyRshift,
    pySub,
    pyXor,
} from "../mock_types/operator.ts";

/**
 * walks the AST folding AST Nodes where possible.
 * Optimizations are largely based on folding python constant types and related operations.
 * Our mock python types implement enough of the number operations to make certain binary/unary operations possible.
 */
export function astOptimize(node: mod) {
    const visitor = new OptimizingVisitor();
    return node.mutateOver(visitor);
}

function asConstantTruth(node: AST) {
    if (node._kind !== ASTKind.Constant) {
        return null;
    }
    return pyIsTrue((node as Constant).value);
}

/**
 * If we weren't able to do any ast folding newval will be null so return the original node.
 * Otherwise return a new Constant node whose `value` is `newval`
 */
function makeConst(node: expr, newval: pyConstant | null) {
    if (newval === null) {
        return node;
    }
    return new Constant(newval, null, node.lineno, node.col_offset, node.end_lineno, node.end_col_offset);
}

function unaryNot(constant: pyConstant) {
    return pyIsTrue(constant) ? pyFalse : pyTrue;
}

/**
 * Takes the elts from a Tuple astnode and checks whether they are all Constants
 * If any elt is a non Constant return null - no optimizing available
 * If all elts are Constants then we can convert the Tuple astnode
 * into a Constant node whose value is a pyTuple made up of pyConstants
 */
function makeConstTuple(elts: expr[]): null | pyTuple {
    if (elts.some((e) => e._kind !== ASTKind.Constant)) {
        return null;
    }
    return new pyTuple(elts.map((e) => (e as Constant).value));
}

/**
 * Based largely on pypy implementation of optimize.py
 */
class OptimizingVisitor extends ASTVisitor {
    defaultVisitor<T>(node: T) {
        return node;
    }

    /**
     * Do simple Binary Operations on Constant types. E.g. `1 + 2` => `3`
     * If the operation might fail or can't be optimized the python methods return null
     * e.g. pyDiv(1, 0) => null
     */
    visit_BinOp(node: BinOp) {
        const lhs = node.left;
        const rhs = node.right;

        if (lhs._kind !== ASTKind.Constant || rhs._kind !== ASTKind.Constant) {
            return node;
        }

        const lv = (lhs as Constant).value;
        const rv = (rhs as Constant).value;

        let newval: pyConstant | null = null;

        switch (node.op) {
            case Add:
                newval = pyAdd(lv, rv);
                break;
            case Sub:
                newval = pySub(lv, rv);
                break;
            case Mult:
                newval = pyMult(lv, rv);
                break;
            case Div:
                newval = pyDiv(lv, rv);
                break;
            case FloorDiv:
                newval = pyFloorDiv(lv, rv);
                break;
            case Mod:
                newval = pyMod(lv, rv);
                break;
            case Pow:
                newval = pyPow(lv, rv);
                break;
            case LShift:
                newval = pyLshift(lv, rv);
                break;
            case RShift:
                newval = pyRshift(lv, rv);
                break;
            case BitOr:
                newval = pyOr(lv, rv);
                break;
            case BitXor:
                newval = pyXor(lv, rv);
                break;
            case BitAnd:
                newval = pyAnd(lv, rv);
                break;
            default:
                // Unknown operator (MatMul)
                return node;
        }

        return makeConst(node, newval);
    }

    /**
     * Convert `not 1 in (1, 2)`  => `1 not in (1, 2)`
     * Do simple Unary Operations on Constant types. E.g. -2
     */
    visit_UnaryOp(node: UnaryOp) {
        const arg = node.operand;
        if (arg._kind !== ASTKind.Constant) {
            /* Fold not into comparison */
            const compare = arg as Compare; // maybe
            if (node.op === Not && compare._kind === ASTKind.Compare && compare.ops.length === 1) {
                /* Eq and NotEq are often implemented in terms of one another, so
                   folding not (self == other) into self != other breaks implementation
                   of !=. Detecting such cases doesn't seem worthwhile.
                   Python uses </> for 'is subset'/'is superset' operations on sets.
                   They don't satisfy not folding laws. */
                let op: cmpop | boolean = compare.ops[0];
                switch (op) {
                    case Is:
                        op = IsNot;
                        break;
                    case IsNot:
                        op = Is;
                        break;
                    case In:
                        op = NotIn;
                        break;
                    case NotIn:
                        op = In;
                        break;
                    default:
                        op = false;
                }
                if (op) {
                    compare.ops[0] = op;
                    return arg;
                }
            }
            return node;
        }

        /** @todo maybe we should make Invert, Not etc constant number values instead of subclasses of AST - this is what pypy and cpython do */
        let unaryOpFn;
        switch (node.op) {
            case Invert:
                unaryOpFn = pyInvert;
                break;
            case Not:
                unaryOpFn = unaryNot;
                break;
            case UAdd:
                unaryOpFn = pyPos;
                break;
            case USub:
                unaryOpFn = pyNeg;
                break;
            default:
                throw new Error("bad unary operator " + node.op);
        }

        const newval = unaryOpFn((arg as Constant).value);
        return makeConst(node, newval);
    }

    /** remove unneessary chained `and`/`or` constants. `1 and 2 and 3` => `3` */
    visit_BoolOp(node: BoolOp) {
        const values = node.values;
        const weAreAnd = node.op === And;
        let i = 0;
        while (i < values.length - 1) {
            const truth = asConstantTruth(values[i]);
            if (truth !== null) {
                if (!truth === weAreAnd) {
                    values.splice(i + 1);
                    break;
                } else {
                    values.splice(i, 1);
                }
            } else {
                i++;
            }
        }
        if (values.length === 1) {
            return values[0];
        }
        return node;
    }

    /** a tuple of all constant elements can be turned into a constant astnode */
    visit_Tuple(node: Tuple) {
        if (node.ctx !== Load) {
            return node;
        }
        const newval = makeConstTuple(node.elts);
        return makeConst(node, newval);
    }

    /**
     * Fold Constant lookups of constant types `'abc'[0]` => `a`
     * pyGetItem returns null for an invalid lookup
     */
    visit_Subscript(node: Subscript) {
        if (node.ctx !== Load) {
            return node;
        }
        const arg = node.value;
        if (arg._kind !== ASTKind.Constant) {
            return node;
        }
        const idx = node.slice;
        if (idx._kind !== ASTKind.Constant) {
            return node;
        }

        const newval = pyGetItem((arg as Constant).value, (idx as Constant).value);
        return makeConst(node, newval);
    }
}
