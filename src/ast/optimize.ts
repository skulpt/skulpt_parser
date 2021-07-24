// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import {
    Add,
    BinOp,
    BitAnd,
    BitOr,
    BitXor,
    cmpop,
    Compare,
    Constant,
    Div,
    Expr,
    expr,
    FloorDiv,
    LShift,
    Mod,
    mod,
    Mult,
    Pow,
    RShift,
    Sub,
    UnaryOp,
} from "./astnodes.ts";
import { ASTKind, Not, Is, IsNot, In, NotIn } from "./astnodes.ts";

export function astOptimize(node: mod) {
    return astfoldMod(mod);
}

function makeConst(node: expr, val: any) {}

/** @todo - this is differnt for different parents */
function replaceChild(parent: Expr, newChild: expr) {
    // or maybe do some weird Object.setPrototypeOf()

    parent.value = newChild;
}

function unaryNot(v) {}

/** changes not 1 in (1, 2) with 1 not in (1, 2) */
function foldUnaryOp(node: UnaryOp, parent: Expr) {
    const arg = node.operand as Compare; // maybe;
    if (arg._kind !== ASTKind.Constant) {
        if (node.op === Not || (arg._kind === ASTKind.Compare && arg.ops.length === 1)) {
            let op: cmpop | boolean = arg.ops[0];
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
                arg.ops[0] = op;
                replaceChild(parent, arg);
            }
        }
    }
}

function safeMultiply(v, w) {}

function safePower(v, w) {}

function safeLshift(v, w) {}

function safeMod(v, w) {}

function foldBinop(node: BinOp, parent) {
    const lhs = node.left;
    const rhs = node.right;

    if (lhs._kind !== ASTKind.Constant || rhs._kind !== ASTKind.Constant) {
        return;
    }

    const lv = (lhs as Constant).value;
    const rv = (rhs as Constant).value;

    let newval: Constant;

    switch (node.op) {
        case Add:
            newval = pyNumberAdd(lv, rv);
            break;
        case Sub:
            newval = pyNumberSub(lv, rv);
            break;
        case Mult:
            newval = safeMultiply(lv, rv);
        case Div:
            newval = PyNumber_TrueDivide(lv, rv);
            break;
        case FloorDiv:
            newval = PyNumber_FloorDivide(lv, rv);
            break;
        case Mod:
            newval = safe_mod(lv, rv);
            break;
        case Pow:
            newval = safe_power(lv, rv);
            break;
        case LShift:
            newval = safe_lshift(lv, rv);
            break;
        case RShift:
            newval = PyNumber_Rshift(lv, rv);
            break;
        case BitOr:
            newval = PyNumber_Or(lv, rv);
            break;
        case BitXor:
            newval = PyNumber_Xor(lv, rv);
            break;
        case BitAnd:
            newval = PyNumber_And(lv, rv);
            break;
        default:
            // Unknown operator
            return;
    }

    return makeConst(node, newval);
}

function makeConstTuple(elts: expr[]) {
    const copy = [];
    for (const e of elts) {
        if (e._kind !== ASTKind.Constant) {
            return;
        }
        copy.push(e);
    }
    return copy;
}

function foldTuple(node, parent) {
    if (node.ctx !== Load) {
        return;
    }

    const newval = makeConstTuple(node.elts);
    if (newval !== undefined) {
        return makeConst(node, newval);
    }
}

function foldSubscr(node, parent) {}
