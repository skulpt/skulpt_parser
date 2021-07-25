// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import {
    Add,
    And,
    AST,
    ASTVisitor,
    BinOp,
    BitAnd,
    BitOr,
    BitXor,
    BoolOp,
    cmpop,
    Compare,
    Constant,
    Div,
    Expr,
    expr,
    FloorDiv,
    Invert,
    Load,
    LShift,
    Mod,
    mod,
    Mult,
    Pow,
    RShift,
    Sub,
    Subscript,
    Tuple,
    UAdd,
    UnaryOp,
    USub,
} from "./astnodes.ts";
import { ASTKind, Not, Is, IsNot, In, NotIn } from "./astnodes.ts";
import { pyConstant, pyFalse, pyTrue, pyTuple } from "../mock_types/constants.ts";
import {
    pyIsTrue,
    pyNumber_Add,
    pyNumber_Sub,
    pyNumber_Mult,
    pyNumber_Neg,
    pyNumber_Pos,
    pyNumber_Invert,
    pyNumber_Pow,
} from "../mock_types/helpers.ts";

export function astOptimize(node: mod) {
    const visitor = new OptimizingVisitor();
    return node.mutateOver(visitor);
}

class OptimizingVisitor extends ASTVisitor {
    defaultVisitor<T>(node: T) {
        return node;
    }

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
                newval = pyNumber_Add(lv, rv);
                break;
            case Sub:
                newval = pyNumber_Sub(lv, rv);
                break;
            case Mult:
                newval = pyNumber_Mult(lv, rv);
                break;
            case Div:
                // newval = PyNumber_TrueDivide(lv, rv);
                break;
            case FloorDiv:
                // newval = pyNumber_FloorDivide(lv, rv);
                break;
            case Mod:
                // newval = safe_mod(lv, rv);
                break;
            case Pow:
                newval = pyNumber_Pow(lv, rv);
                break;
            case LShift:
                // newval = safe_lshift(lv, rv);
                break;
            case RShift:
                // newval = pyNumber_Rshift(lv, rv);
                break;
            case BitOr:
                // newval = pyNumber_Or(lv, rv);
                break;
            case BitXor:
                // newval = pyNumber_Xor(lv, rv);
                break;
            case BitAnd:
                // newval = pyNumber_And(lv, rv);
                break;
            default:
                // Unknown operator
                return node;
        }

        return makeConst(node, newval);
    }

    visit_UnaryOp(node: UnaryOp) {
        const arg = node.operand; // maybe;
        if (arg._kind !== ASTKind.Constant) {
            /* Fold not into comparison */
            const compare = arg as Compare;
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

        /** @todo we could make these constant Astnodes simple values - this is what pypy and cpython do? */
        let unaryOpFn;
        switch (node.op) {
            case Invert:
                unaryOpFn = pyNumber_Invert;
                break;
            case Not:
                unaryOpFn = unaryNot;
                break;
            case UAdd:
                unaryOpFn = pyNumber_Pos;
                break;
            case USub:
                unaryOpFn = pyNumber_Neg;
                break;
            default:
                throw new Error("bad unary operator " + node.op);
        }

        const newval = unaryOpFn((arg as Constant).value);
        return makeConst(node, newval);
    }

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

    visit_Tuple(node: Tuple) {
        if (node.ctx !== Load) {
            return node;
        }
        const newval = makeConstTuple(node.elts);
        return makeConst(node, newval);
    }

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

        // const newval = pyObjectGetItem((arg as Constant).value, (idx as Constant).value);
        const newval = null;
        return makeConst(node, newval);
    }

    // visit_Iter;
}

function asConstantTruth(node: AST) {
    if (node._kind !== ASTKind.Constant) {
        return null;
    }
    return pyIsTrue((node as Constant).value);
}

function makeConst(node: expr, newval: pyConstant | null) {
    if (newval === null) {
        return node;
    }
    return new Constant(newval, null, node.lineno, node.col_offset, node.end_lineno, node.end_col_offset);
}

function unaryNot(constant: pyConstant) {
    return pyIsTrue(constant) ? pyTrue : pyFalse;
}

function makeConstTuple(elts: expr[]): null | pyTuple {
    const copy = [];
    for (const e of elts) {
        if (e._kind !== ASTKind.Constant) {
            return null;
        }
        copy.push((e as Constant).value);
    }
    return new pyTuple(copy);
}
