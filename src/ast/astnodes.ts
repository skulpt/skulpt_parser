/* File automatically generated by gen_asdl/__main__.py. */

/* Object that holds all nodes */

/** @todo these should be a python types */
export type identifier = string;
export type constant = any;

/** base class for all AST nodes */
export interface AST {
    _fields: string[];
    _attributes: string[];
    tp$name: string;
}

export class AST {
    get [Symbol.toStringTag]() {
        return this.tp$name;
    }
}
AST.prototype._attributes = [];
AST.prototype._fields = [];
AST.prototype.tp$name = "AST";

/* ---------------------- */
/* constructors for nodes */
/* ---------------------- */

/* ----- expr_context ----- */
export class expr_context extends AST {
    _kind = 0;
}
expr_context.prototype.tp$name = "expr_context";

export const Load_kind = 1;
export const Store_kind = 2;
export const Del_kind = 3;
export class Load extends expr_context {
    _kind = 1;
}
Load.prototype.tp$name = "Load";
export class Store extends expr_context {
    _kind = 2;
}
Store.prototype.tp$name = "Store";
export class Del extends expr_context {
    _kind = 3;
}
Del.prototype.tp$name = "Del";

/* ----- boolop ----- */
export class boolop extends AST {
    _kind = 0;
}
boolop.prototype.tp$name = "boolop";

export const And_kind = 1;
export const Or_kind = 2;
export class And extends boolop {
    _kind = 1;
}
And.prototype.tp$name = "And";
export class Or extends boolop {
    _kind = 2;
}
Or.prototype.tp$name = "Or";

/* ----- operator ----- */
export class operator extends AST {
    _kind = 0;
}
operator.prototype.tp$name = "operator";

export const Add_kind = 1;
export const Sub_kind = 2;
export const Mult_kind = 3;
export const MatMult_kind = 4;
export const Div_kind = 5;
export const Mod_kind = 6;
export const Pow_kind = 7;
export const LShift_kind = 8;
export const RShift_kind = 9;
export const BitOr_kind = 10;
export const BitXor_kind = 11;
export const BitAnd_kind = 12;
export const FloorDiv_kind = 13;
export class Add extends operator {
    _kind = 1;
}
Add.prototype.tp$name = "Add";
export class Sub extends operator {
    _kind = 2;
}
Sub.prototype.tp$name = "Sub";
export class Mult extends operator {
    _kind = 3;
}
Mult.prototype.tp$name = "Mult";
export class MatMult extends operator {
    _kind = 4;
}
MatMult.prototype.tp$name = "MatMult";
export class Div extends operator {
    _kind = 5;
}
Div.prototype.tp$name = "Div";
export class Mod extends operator {
    _kind = 6;
}
Mod.prototype.tp$name = "Mod";
export class Pow extends operator {
    _kind = 7;
}
Pow.prototype.tp$name = "Pow";
export class LShift extends operator {
    _kind = 8;
}
LShift.prototype.tp$name = "LShift";
export class RShift extends operator {
    _kind = 9;
}
RShift.prototype.tp$name = "RShift";
export class BitOr extends operator {
    _kind = 10;
}
BitOr.prototype.tp$name = "BitOr";
export class BitXor extends operator {
    _kind = 11;
}
BitXor.prototype.tp$name = "BitXor";
export class BitAnd extends operator {
    _kind = 12;
}
BitAnd.prototype.tp$name = "BitAnd";
export class FloorDiv extends operator {
    _kind = 13;
}
FloorDiv.prototype.tp$name = "FloorDiv";

/* ----- unaryop ----- */
export class unaryop extends AST {
    _kind = 0;
}
unaryop.prototype.tp$name = "unaryop";

export const Invert_kind = 1;
export const Not_kind = 2;
export const UAdd_kind = 3;
export const USub_kind = 4;
export class Invert extends unaryop {
    _kind = 1;
}
Invert.prototype.tp$name = "Invert";
export class Not extends unaryop {
    _kind = 2;
}
Not.prototype.tp$name = "Not";
export class UAdd extends unaryop {
    _kind = 3;
}
UAdd.prototype.tp$name = "UAdd";
export class USub extends unaryop {
    _kind = 4;
}
USub.prototype.tp$name = "USub";

/* ----- cmpop ----- */
export class cmpop extends AST {
    _kind = 0;
}
cmpop.prototype.tp$name = "cmpop";

export const Eq_kind = 1;
export const NotEq_kind = 2;
export const Lt_kind = 3;
export const LtE_kind = 4;
export const Gt_kind = 5;
export const GtE_kind = 6;
export const Is_kind = 7;
export const IsNot_kind = 8;
export const In_kind = 9;
export const NotIn_kind = 10;
export class Eq extends cmpop {
    _kind = 1;
}
Eq.prototype.tp$name = "Eq";
export class NotEq extends cmpop {
    _kind = 2;
}
NotEq.prototype.tp$name = "NotEq";
export class Lt extends cmpop {
    _kind = 3;
}
Lt.prototype.tp$name = "Lt";
export class LtE extends cmpop {
    _kind = 4;
}
LtE.prototype.tp$name = "LtE";
export class Gt extends cmpop {
    _kind = 5;
}
Gt.prototype.tp$name = "Gt";
export class GtE extends cmpop {
    _kind = 6;
}
GtE.prototype.tp$name = "GtE";
export class Is extends cmpop {
    _kind = 7;
}
Is.prototype.tp$name = "Is";
export class IsNot extends cmpop {
    _kind = 8;
}
IsNot.prototype.tp$name = "IsNot";
export class In extends cmpop {
    _kind = 9;
}
In.prototype.tp$name = "In";
export class NotIn extends cmpop {
    _kind = 10;
}
NotIn.prototype.tp$name = "NotIn";

/* ----- mod ----- */
export class mod extends AST {}
mod.prototype.tp$name = "mod";

export const Module_kind = 1;
export const Interactive_kind = 2;
export const Expression_kind = 3;
export const FunctionType_kind = 4;
export class Module extends mod {
    body: stmt[];
    type_ignores: type_ignore[];
    _kind = 1;
    constructor(body: stmt[], type_ignores: type_ignore[]) {
        super();
        this.body = body;
        this.type_ignores = type_ignores;
    }
}
Module.prototype._fields = ["body", "type_ignores"];
Module.prototype.tp$name = "Module";

export class Interactive extends mod {
    body: stmt[];
    _kind = 2;
    constructor(body: stmt[]) {
        super();
        this.body = body;
    }
}
Interactive.prototype._fields = ["body"];
Interactive.prototype.tp$name = "Interactive";

export class Expression extends mod {
    body: expr;
    _kind = 3;
    constructor(body: expr) {
        super();
        this.body = body;
    }
}
Expression.prototype._fields = ["body"];
Expression.prototype.tp$name = "Expression";

export class FunctionType extends mod {
    argtypes: expr[];
    returns: expr;
    _kind = 4;
    constructor(argtypes: expr[], returns: expr) {
        super();
        this.argtypes = argtypes;
        this.returns = returns;
    }
}
FunctionType.prototype._fields = ["argtypes", "returns"];
FunctionType.prototype.tp$name = "FunctionType";

/* ----- stmt ----- */
export class stmt extends AST {
    lineno: number;
    col_offset: number;
    end_lineno?: number | null;
    end_col_offset?: number | null;
    _kind = 0;
    constructor(lineno: number, col_offset: number, end_lineno?: number | null, end_col_offset?: number | null) {
        super();
        this.lineno = lineno;
        this.col_offset = col_offset;
        this.end_lineno = end_lineno;
        this.end_col_offset = end_col_offset;
    }
}
stmt.prototype._attributes = ["lineno", "col_offset", "end_lineno", "end_col_offset"];
stmt.prototype.tp$name = "stmt";

export type stmtAttrs = [
    lineno: number,
    col_offset: number,
    end_lineno?: number | null,
    end_col_offset?: number | null
];

export const FunctionDef_kind = 1;
export const AsyncFunctionDef_kind = 2;
export const ClassDef_kind = 3;
export const Return_kind = 4;
export const Delete_kind = 5;
export const Assign_kind = 6;
export const AugAssign_kind = 7;
export const AnnAssign_kind = 8;
export const For_kind = 9;
export const AsyncFor_kind = 10;
export const While_kind = 11;
export const If_kind = 12;
export const With_kind = 13;
export const AsyncWith_kind = 14;
export const Raise_kind = 15;
export const Try_kind = 16;
export const Assert_kind = 17;
export const Import_kind = 18;
export const ImportFrom_kind = 19;
export const Global_kind = 20;
export const Nonlocal_kind = 21;
export const Expr_kind = 22;
export const Pass_kind = 23;
export const Break_kind = 24;
export const Continue_kind = 25;
export const Debugger_kind = 26;
export class FunctionDef extends stmt {
    name: identifier;
    args: arguments_;
    body: stmt[];
    decorator_list: expr[];
    returns: expr | null;
    type_comment: string | null;
    _kind = 1;
    constructor(
        name: identifier,
        args: arguments_,
        body: stmt[],
        decorator_list: expr[],
        returns: expr | null,
        type_comment: string | null,
        ...attrs: stmtAttrs
    ) {
        super(...attrs);
        this.name = name;
        this.args = args;
        this.body = body;
        this.decorator_list = decorator_list;
        this.returns = returns;
        this.type_comment = type_comment;
    }
}
FunctionDef.prototype._fields = ["name", "args", "body", "decorator_list", "returns", "type_comment"];
FunctionDef.prototype.tp$name = "FunctionDef";

export class AsyncFunctionDef extends stmt {
    name: identifier;
    args: arguments_;
    body: stmt[];
    decorator_list: expr[];
    returns: expr | null;
    type_comment: string | null;
    _kind = 2;
    constructor(
        name: identifier,
        args: arguments_,
        body: stmt[],
        decorator_list: expr[],
        returns: expr | null,
        type_comment: string | null,
        ...attrs: stmtAttrs
    ) {
        super(...attrs);
        this.name = name;
        this.args = args;
        this.body = body;
        this.decorator_list = decorator_list;
        this.returns = returns;
        this.type_comment = type_comment;
    }
}
AsyncFunctionDef.prototype._fields = ["name", "args", "body", "decorator_list", "returns", "type_comment"];
AsyncFunctionDef.prototype.tp$name = "AsyncFunctionDef";

export class ClassDef extends stmt {
    name: identifier;
    bases: expr[];
    keywords: keyword[];
    body: stmt[];
    decorator_list: expr[];
    _kind = 3;
    constructor(
        name: identifier,
        bases: expr[],
        keywords: keyword[],
        body: stmt[],
        decorator_list: expr[],
        ...attrs: stmtAttrs
    ) {
        super(...attrs);
        this.name = name;
        this.bases = bases;
        this.keywords = keywords;
        this.body = body;
        this.decorator_list = decorator_list;
    }
}
ClassDef.prototype._fields = ["name", "bases", "keywords", "body", "decorator_list"];
ClassDef.prototype.tp$name = "ClassDef";

export class Return extends stmt {
    value: expr | null;
    _kind = 4;
    constructor(value: expr | null, ...attrs: stmtAttrs) {
        super(...attrs);
        this.value = value;
    }
}
Return.prototype._fields = ["value"];
Return.prototype.tp$name = "Return";

export class Delete extends stmt {
    targets: expr[];
    _kind = 5;
    constructor(targets: expr[], ...attrs: stmtAttrs) {
        super(...attrs);
        this.targets = targets;
    }
}
Delete.prototype._fields = ["targets"];
Delete.prototype.tp$name = "Delete";

export class Assign extends stmt {
    targets: expr[];
    value: expr;
    type_comment: string | null;
    _kind = 6;
    constructor(targets: expr[], value: expr, type_comment: string | null, ...attrs: stmtAttrs) {
        super(...attrs);
        this.targets = targets;
        this.value = value;
        this.type_comment = type_comment;
    }
}
Assign.prototype._fields = ["targets", "value", "type_comment"];
Assign.prototype.tp$name = "Assign";

export class AugAssign extends stmt {
    target: expr;
    op: operator;
    value: expr;
    _kind = 7;
    constructor(target: expr, op: operator, value: expr, ...attrs: stmtAttrs) {
        super(...attrs);
        this.target = target;
        this.op = op;
        this.value = value;
    }
}
AugAssign.prototype._fields = ["target", "op", "value"];
AugAssign.prototype.tp$name = "AugAssign";

export class AnnAssign extends stmt {
    target: expr;
    annotation: expr;
    value: expr | null;
    simple: number;
    _kind = 8;
    constructor(target: expr, annotation: expr, value: expr | null, simple: number, ...attrs: stmtAttrs) {
        super(...attrs);
        this.target = target;
        this.annotation = annotation;
        this.value = value;
        this.simple = simple;
    }
}
AnnAssign.prototype._fields = ["target", "annotation", "value", "simple"];
AnnAssign.prototype.tp$name = "AnnAssign";

export class For extends stmt {
    target: expr;
    iter: expr;
    body: stmt[];
    orelse: stmt[];
    type_comment: string | null;
    _kind = 9;
    constructor(
        target: expr,
        iter: expr,
        body: stmt[],
        orelse: stmt[],
        type_comment: string | null,
        ...attrs: stmtAttrs
    ) {
        super(...attrs);
        this.target = target;
        this.iter = iter;
        this.body = body;
        this.orelse = orelse;
        this.type_comment = type_comment;
    }
}
For.prototype._fields = ["target", "iter", "body", "orelse", "type_comment"];
For.prototype.tp$name = "For";

export class AsyncFor extends stmt {
    target: expr;
    iter: expr;
    body: stmt[];
    orelse: stmt[];
    type_comment: string | null;
    _kind = 10;
    constructor(
        target: expr,
        iter: expr,
        body: stmt[],
        orelse: stmt[],
        type_comment: string | null,
        ...attrs: stmtAttrs
    ) {
        super(...attrs);
        this.target = target;
        this.iter = iter;
        this.body = body;
        this.orelse = orelse;
        this.type_comment = type_comment;
    }
}
AsyncFor.prototype._fields = ["target", "iter", "body", "orelse", "type_comment"];
AsyncFor.prototype.tp$name = "AsyncFor";

export class While extends stmt {
    test: expr;
    body: stmt[];
    orelse: stmt[];
    _kind = 11;
    constructor(test: expr, body: stmt[], orelse: stmt[], ...attrs: stmtAttrs) {
        super(...attrs);
        this.test = test;
        this.body = body;
        this.orelse = orelse;
    }
}
While.prototype._fields = ["test", "body", "orelse"];
While.prototype.tp$name = "While";

export class If extends stmt {
    test: expr;
    body: stmt[];
    orelse: stmt[];
    _kind = 12;
    constructor(test: expr, body: stmt[], orelse: stmt[], ...attrs: stmtAttrs) {
        super(...attrs);
        this.test = test;
        this.body = body;
        this.orelse = orelse;
    }
}
If.prototype._fields = ["test", "body", "orelse"];
If.prototype.tp$name = "If";

export class With extends stmt {
    items: withitem[];
    body: stmt[];
    type_comment: string | null;
    _kind = 13;
    constructor(items: withitem[], body: stmt[], type_comment: string | null, ...attrs: stmtAttrs) {
        super(...attrs);
        this.items = items;
        this.body = body;
        this.type_comment = type_comment;
    }
}
With.prototype._fields = ["items", "body", "type_comment"];
With.prototype.tp$name = "With";

export class AsyncWith extends stmt {
    items: withitem[];
    body: stmt[];
    type_comment: string | null;
    _kind = 14;
    constructor(items: withitem[], body: stmt[], type_comment: string | null, ...attrs: stmtAttrs) {
        super(...attrs);
        this.items = items;
        this.body = body;
        this.type_comment = type_comment;
    }
}
AsyncWith.prototype._fields = ["items", "body", "type_comment"];
AsyncWith.prototype.tp$name = "AsyncWith";

export class Raise extends stmt {
    exc: expr | null;
    cause: expr | null;
    _kind = 15;
    constructor(exc: expr | null, cause: expr | null, ...attrs: stmtAttrs) {
        super(...attrs);
        this.exc = exc;
        this.cause = cause;
    }
}
Raise.prototype._fields = ["exc", "cause"];
Raise.prototype.tp$name = "Raise";

export class Try extends stmt {
    body: stmt[];
    handlers: excepthandler[];
    orelse: stmt[];
    finalbody: stmt[];
    _kind = 16;
    constructor(body: stmt[], handlers: excepthandler[], orelse: stmt[], finalbody: stmt[], ...attrs: stmtAttrs) {
        super(...attrs);
        this.body = body;
        this.handlers = handlers;
        this.orelse = orelse;
        this.finalbody = finalbody;
    }
}
Try.prototype._fields = ["body", "handlers", "orelse", "finalbody"];
Try.prototype.tp$name = "Try";

export class Assert extends stmt {
    test: expr;
    msg: expr | null;
    _kind = 17;
    constructor(test: expr, msg: expr | null, ...attrs: stmtAttrs) {
        super(...attrs);
        this.test = test;
        this.msg = msg;
    }
}
Assert.prototype._fields = ["test", "msg"];
Assert.prototype.tp$name = "Assert";

export class Import extends stmt {
    names: alias[];
    _kind = 18;
    constructor(names: alias[], ...attrs: stmtAttrs) {
        super(...attrs);
        this.names = names;
    }
}
Import.prototype._fields = ["names"];
Import.prototype.tp$name = "Import";

export class ImportFrom extends stmt {
    module: identifier | null;
    names: alias[];
    level: number | null;
    _kind = 19;
    constructor(module: identifier | null, names: alias[], level: number | null, ...attrs: stmtAttrs) {
        super(...attrs);
        this.module = module;
        this.names = names;
        this.level = level;
    }
}
ImportFrom.prototype._fields = ["module", "names", "level"];
ImportFrom.prototype.tp$name = "ImportFrom";

export class Global extends stmt {
    names: identifier[];
    _kind = 20;
    constructor(names: identifier[], ...attrs: stmtAttrs) {
        super(...attrs);
        this.names = names;
    }
}
Global.prototype._fields = ["names"];
Global.prototype.tp$name = "Global";

export class Nonlocal extends stmt {
    names: identifier[];
    _kind = 21;
    constructor(names: identifier[], ...attrs: stmtAttrs) {
        super(...attrs);
        this.names = names;
    }
}
Nonlocal.prototype._fields = ["names"];
Nonlocal.prototype.tp$name = "Nonlocal";

export class Expr extends stmt {
    value: expr;
    _kind = 22;
    constructor(value: expr, ...attrs: stmtAttrs) {
        super(...attrs);
        this.value = value;
    }
}
Expr.prototype._fields = ["value"];
Expr.prototype.tp$name = "Expr";

export class Pass extends stmt {
    _kind = 23;
    constructor(...attrs: stmtAttrs) {
        super(...attrs);
    }
}
Pass.prototype._fields = [];
Pass.prototype.tp$name = "Pass";

export class Break extends stmt {
    _kind = 24;
    constructor(...attrs: stmtAttrs) {
        super(...attrs);
    }
}
Break.prototype._fields = [];
Break.prototype.tp$name = "Break";

export class Continue extends stmt {
    _kind = 25;
    constructor(...attrs: stmtAttrs) {
        super(...attrs);
    }
}
Continue.prototype._fields = [];
Continue.prototype.tp$name = "Continue";

export class Debugger extends stmt {
    _kind = 26;
    constructor(...attrs: stmtAttrs) {
        super(...attrs);
    }
}
Debugger.prototype._fields = [];
Debugger.prototype.tp$name = "Debugger";

/* ----- expr ----- */
export class expr extends AST {
    lineno: number;
    col_offset: number;
    end_lineno?: number | null;
    end_col_offset?: number | null;
    _kind = 0;
    constructor(lineno: number, col_offset: number, end_lineno?: number | null, end_col_offset?: number | null) {
        super();
        this.lineno = lineno;
        this.col_offset = col_offset;
        this.end_lineno = end_lineno;
        this.end_col_offset = end_col_offset;
    }
}
expr.prototype._attributes = ["lineno", "col_offset", "end_lineno", "end_col_offset"];
expr.prototype.tp$name = "expr";

export type exprAttrs = [
    lineno: number,
    col_offset: number,
    end_lineno?: number | null,
    end_col_offset?: number | null
];

export const BoolOp_kind = 1;
export const NamedExpr_kind = 2;
export const BinOp_kind = 3;
export const UnaryOp_kind = 4;
export const Lambda_kind = 5;
export const IfExp_kind = 6;
export const Dict_kind = 7;
export const Set_kind = 8;
export const ListComp_kind = 9;
export const SetComp_kind = 10;
export const DictComp_kind = 11;
export const GeneratorExp_kind = 12;
export const Await_kind = 13;
export const Yield_kind = 14;
export const YieldFrom_kind = 15;
export const Compare_kind = 16;
export const Call_kind = 17;
export const FormattedValue_kind = 18;
export const JoinedStr_kind = 19;
export const Constant_kind = 20;
export const Attribute_kind = 21;
export const Subscript_kind = 22;
export const Starred_kind = 23;
export const Name_kind = 24;
export const List_kind = 25;
export const Tuple_kind = 26;
export const Slice_kind = 27;
export class BoolOp extends expr {
    op: boolop;
    values: expr[];
    _kind = 1;
    constructor(op: boolop, values: expr[], ...attrs: exprAttrs) {
        super(...attrs);
        this.op = op;
        this.values = values;
    }
}
BoolOp.prototype._fields = ["op", "values"];
BoolOp.prototype.tp$name = "BoolOp";

export class NamedExpr extends expr {
    target: expr;
    value: expr;
    _kind = 2;
    constructor(target: expr, value: expr, ...attrs: exprAttrs) {
        super(...attrs);
        this.target = target;
        this.value = value;
    }
}
NamedExpr.prototype._fields = ["target", "value"];
NamedExpr.prototype.tp$name = "NamedExpr";

export class BinOp extends expr {
    left: expr;
    op: operator;
    right: expr;
    _kind = 3;
    constructor(left: expr, op: operator, right: expr, ...attrs: exprAttrs) {
        super(...attrs);
        this.left = left;
        this.op = op;
        this.right = right;
    }
}
BinOp.prototype._fields = ["left", "op", "right"];
BinOp.prototype.tp$name = "BinOp";

export class UnaryOp extends expr {
    op: unaryop;
    operand: expr;
    _kind = 4;
    constructor(op: unaryop, operand: expr, ...attrs: exprAttrs) {
        super(...attrs);
        this.op = op;
        this.operand = operand;
    }
}
UnaryOp.prototype._fields = ["op", "operand"];
UnaryOp.prototype.tp$name = "UnaryOp";

export class Lambda extends expr {
    args: arguments_;
    body: expr;
    _kind = 5;
    constructor(args: arguments_, body: expr, ...attrs: exprAttrs) {
        super(...attrs);
        this.args = args;
        this.body = body;
    }
}
Lambda.prototype._fields = ["args", "body"];
Lambda.prototype.tp$name = "Lambda";

export class IfExp extends expr {
    test: expr;
    body: expr;
    orelse: expr;
    _kind = 6;
    constructor(test: expr, body: expr, orelse: expr, ...attrs: exprAttrs) {
        super(...attrs);
        this.test = test;
        this.body = body;
        this.orelse = orelse;
    }
}
IfExp.prototype._fields = ["test", "body", "orelse"];
IfExp.prototype.tp$name = "IfExp";

export class Dict extends expr {
    keys: expr[];
    values: expr[];
    _kind = 7;
    constructor(keys: expr[], values: expr[], ...attrs: exprAttrs) {
        super(...attrs);
        this.keys = keys;
        this.values = values;
    }
}
Dict.prototype._fields = ["keys", "values"];
Dict.prototype.tp$name = "Dict";

export class Set extends expr {
    elts: expr[];
    _kind = 8;
    constructor(elts: expr[], ...attrs: exprAttrs) {
        super(...attrs);
        this.elts = elts;
    }
}
Set.prototype._fields = ["elts"];
Set.prototype.tp$name = "Set";

export class ListComp extends expr {
    elt: expr;
    generators: comprehension[];
    _kind = 9;
    constructor(elt: expr, generators: comprehension[], ...attrs: exprAttrs) {
        super(...attrs);
        this.elt = elt;
        this.generators = generators;
    }
}
ListComp.prototype._fields = ["elt", "generators"];
ListComp.prototype.tp$name = "ListComp";

export class SetComp extends expr {
    elt: expr;
    generators: comprehension[];
    _kind = 10;
    constructor(elt: expr, generators: comprehension[], ...attrs: exprAttrs) {
        super(...attrs);
        this.elt = elt;
        this.generators = generators;
    }
}
SetComp.prototype._fields = ["elt", "generators"];
SetComp.prototype.tp$name = "SetComp";

export class DictComp extends expr {
    key: expr;
    value: expr;
    generators: comprehension[];
    _kind = 11;
    constructor(key: expr, value: expr, generators: comprehension[], ...attrs: exprAttrs) {
        super(...attrs);
        this.key = key;
        this.value = value;
        this.generators = generators;
    }
}
DictComp.prototype._fields = ["key", "value", "generators"];
DictComp.prototype.tp$name = "DictComp";

export class GeneratorExp extends expr {
    elt: expr;
    generators: comprehension[];
    _kind = 12;
    constructor(elt: expr, generators: comprehension[], ...attrs: exprAttrs) {
        super(...attrs);
        this.elt = elt;
        this.generators = generators;
    }
}
GeneratorExp.prototype._fields = ["elt", "generators"];
GeneratorExp.prototype.tp$name = "GeneratorExp";

export class Await extends expr {
    value: expr;
    _kind = 13;
    constructor(value: expr, ...attrs: exprAttrs) {
        super(...attrs);
        this.value = value;
    }
}
Await.prototype._fields = ["value"];
Await.prototype.tp$name = "Await";

export class Yield extends expr {
    value: expr | null;
    _kind = 14;
    constructor(value: expr | null, ...attrs: exprAttrs) {
        super(...attrs);
        this.value = value;
    }
}
Yield.prototype._fields = ["value"];
Yield.prototype.tp$name = "Yield";

export class YieldFrom extends expr {
    value: expr;
    _kind = 15;
    constructor(value: expr, ...attrs: exprAttrs) {
        super(...attrs);
        this.value = value;
    }
}
YieldFrom.prototype._fields = ["value"];
YieldFrom.prototype.tp$name = "YieldFrom";

export class Compare extends expr {
    left: expr;
    ops: cmpop[];
    comparators: expr[];
    _kind = 16;
    constructor(left: expr, ops: cmpop[], comparators: expr[], ...attrs: exprAttrs) {
        super(...attrs);
        this.left = left;
        this.ops = ops;
        this.comparators = comparators;
    }
}
Compare.prototype._fields = ["left", "ops", "comparators"];
Compare.prototype.tp$name = "Compare";

export class Call extends expr {
    func: expr;
    args: expr[];
    keywords: keyword[];
    _kind = 17;
    constructor(func: expr, args: expr[], keywords: keyword[], ...attrs: exprAttrs) {
        super(...attrs);
        this.func = func;
        this.args = args;
        this.keywords = keywords;
    }
}
Call.prototype._fields = ["func", "args", "keywords"];
Call.prototype.tp$name = "Call";

export class FormattedValue extends expr {
    value: expr;
    conversion: number | null;
    format_spec: expr | null;
    _kind = 18;
    constructor(value: expr, conversion: number | null, format_spec: expr | null, ...attrs: exprAttrs) {
        super(...attrs);
        this.value = value;
        this.conversion = conversion;
        this.format_spec = format_spec;
    }
}
FormattedValue.prototype._fields = ["value", "conversion", "format_spec"];
FormattedValue.prototype.tp$name = "FormattedValue";

export class JoinedStr extends expr {
    values: expr[];
    _kind = 19;
    constructor(values: expr[], ...attrs: exprAttrs) {
        super(...attrs);
        this.values = values;
    }
}
JoinedStr.prototype._fields = ["values"];
JoinedStr.prototype.tp$name = "JoinedStr";

export class Constant extends expr {
    value: constant;
    kind: string | null;
    _kind = 20;
    constructor(value: constant, kind: string | null, ...attrs: exprAttrs) {
        super(...attrs);
        this.value = value;
        this.kind = kind;
    }
}
Constant.prototype._fields = ["value", "kind"];
Constant.prototype.tp$name = "Constant";

export class Attribute extends expr {
    value: expr;
    attr: identifier;
    ctx: expr_context;
    _kind = 21;
    constructor(value: expr, attr: identifier, ctx: expr_context, ...attrs: exprAttrs) {
        super(...attrs);
        this.value = value;
        this.attr = attr;
        this.ctx = ctx;
    }
}
Attribute.prototype._fields = ["value", "attr", "ctx"];
Attribute.prototype.tp$name = "Attribute";

export class Subscript extends expr {
    value: expr;
    slice: expr;
    ctx: expr_context;
    _kind = 22;
    constructor(value: expr, slice: expr, ctx: expr_context, ...attrs: exprAttrs) {
        super(...attrs);
        this.value = value;
        this.slice = slice;
        this.ctx = ctx;
    }
}
Subscript.prototype._fields = ["value", "slice", "ctx"];
Subscript.prototype.tp$name = "Subscript";

export class Starred extends expr {
    value: expr;
    ctx: expr_context;
    _kind = 23;
    constructor(value: expr, ctx: expr_context, ...attrs: exprAttrs) {
        super(...attrs);
        this.value = value;
        this.ctx = ctx;
    }
}
Starred.prototype._fields = ["value", "ctx"];
Starred.prototype.tp$name = "Starred";

export class Name extends expr {
    id: identifier;
    ctx: expr_context;
    _kind = 24;
    constructor(id: identifier, ctx: expr_context, ...attrs: exprAttrs) {
        super(...attrs);
        this.id = id;
        this.ctx = ctx;
    }
}
Name.prototype._fields = ["id", "ctx"];
Name.prototype.tp$name = "Name";

export class List extends expr {
    elts: expr[];
    ctx: expr_context;
    _kind = 25;
    constructor(elts: expr[], ctx: expr_context, ...attrs: exprAttrs) {
        super(...attrs);
        this.elts = elts;
        this.ctx = ctx;
    }
}
List.prototype._fields = ["elts", "ctx"];
List.prototype.tp$name = "List";

export class Tuple extends expr {
    elts: expr[];
    ctx: expr_context;
    _kind = 26;
    constructor(elts: expr[], ctx: expr_context, ...attrs: exprAttrs) {
        super(...attrs);
        this.elts = elts;
        this.ctx = ctx;
    }
}
Tuple.prototype._fields = ["elts", "ctx"];
Tuple.prototype.tp$name = "Tuple";

export class Slice extends expr {
    lower: expr | null;
    upper: expr | null;
    step: expr | null;
    _kind = 27;
    constructor(lower: expr | null, upper: expr | null, step: expr | null, ...attrs: exprAttrs) {
        super(...attrs);
        this.lower = lower;
        this.upper = upper;
        this.step = step;
    }
}
Slice.prototype._fields = ["lower", "upper", "step"];
Slice.prototype.tp$name = "Slice";

/* ----- comprehension ----- */
export class comprehension extends AST {
    target: expr;
    iter: expr;
    ifs: expr[];
    is_async: number;
    constructor(target: expr, iter: expr, ifs: expr[], is_async: number) {
        super();
        this.target = target;
        this.iter = iter;
        this.ifs = ifs;
        this.is_async = is_async;
    }
}
comprehension.prototype._fields = ["target", "iter", "ifs", "is_async"];
comprehension.prototype.tp$name = "comprehension";

/* ----- excepthandler ----- */
export class excepthandler extends AST {
    lineno: number;
    col_offset: number;
    end_lineno?: number | null;
    end_col_offset?: number | null;
    _kind = 0;
    constructor(lineno: number, col_offset: number, end_lineno?: number | null, end_col_offset?: number | null) {
        super();
        this.lineno = lineno;
        this.col_offset = col_offset;
        this.end_lineno = end_lineno;
        this.end_col_offset = end_col_offset;
    }
}
excepthandler.prototype._attributes = ["lineno", "col_offset", "end_lineno", "end_col_offset"];
excepthandler.prototype.tp$name = "excepthandler";

export type excepthandlerAttrs = [
    lineno: number,
    col_offset: number,
    end_lineno?: number | null,
    end_col_offset?: number | null
];

export const ExceptHandler_kind = 1;
export class ExceptHandler extends excepthandler {
    type: expr | null;
    name: identifier | null;
    body: stmt[];
    _kind = 1;
    constructor(type: expr | null, name: identifier | null, body: stmt[], ...attrs: excepthandlerAttrs) {
        super(...attrs);
        this.type = type;
        this.name = name;
        this.body = body;
    }
}
ExceptHandler.prototype._fields = ["type", "name", "body"];
ExceptHandler.prototype.tp$name = "ExceptHandler";

/* ----- arguments_ ----- */
export class arguments_ extends AST {
    posonlyargs: arg[];
    args: arg[];
    vararg: arg | null;
    kwonlyargs: arg[];
    kw_defaults: expr[];
    kwarg: arg | null;
    defaults: expr[];
    constructor(
        posonlyargs: arg[],
        args: arg[],
        vararg: arg | null,
        kwonlyargs: arg[],
        kw_defaults: expr[],
        kwarg: arg | null,
        defaults: expr[]
    ) {
        super();
        this.posonlyargs = posonlyargs;
        this.args = args;
        this.vararg = vararg;
        this.kwonlyargs = kwonlyargs;
        this.kw_defaults = kw_defaults;
        this.kwarg = kwarg;
        this.defaults = defaults;
    }
}
arguments_.prototype._fields = ["posonlyargs", "args", "vararg", "kwonlyargs", "kw_defaults", "kwarg", "defaults"];
arguments_.prototype.tp$name = "arguments";

/* ----- arg ----- */
export class arg extends AST {
    arg: identifier;
    annotation: expr | null;
    type_comment: string | null;
    lineno: number;
    col_offset: number;
    end_lineno: number | null;
    end_col_offset: number | null;
    constructor(
        arg: identifier,
        annotation: expr | null,
        type_comment: string | null,
        lineno: number,
        col_offset: number,
        end_lineno: number | null,
        end_col_offset: number | null
    ) {
        super();
        this.arg = arg;
        this.annotation = annotation;
        this.type_comment = type_comment;
        this.lineno = lineno;
        this.col_offset = col_offset;
        this.end_lineno = end_lineno;
        this.end_col_offset = end_col_offset;
    }
}
arg.prototype._fields = ["arg", "annotation", "type_comment"];
arg.prototype.tp$name = "arg";

/* ----- keyword ----- */
export class keyword extends AST {
    arg: identifier | null;
    value: expr;
    lineno: number;
    col_offset: number;
    end_lineno: number | null;
    end_col_offset: number | null;
    constructor(
        arg: identifier | null,
        value: expr,
        lineno: number,
        col_offset: number,
        end_lineno: number | null,
        end_col_offset: number | null
    ) {
        super();
        this.arg = arg;
        this.value = value;
        this.lineno = lineno;
        this.col_offset = col_offset;
        this.end_lineno = end_lineno;
        this.end_col_offset = end_col_offset;
    }
}
keyword.prototype._fields = ["arg", "value"];
keyword.prototype.tp$name = "keyword";

/* ----- alias ----- */
export class alias extends AST {
    name: identifier;
    asname: identifier | null;
    constructor(name: identifier, asname: identifier | null) {
        super();
        this.name = name;
        this.asname = asname;
    }
}
alias.prototype._fields = ["name", "asname"];
alias.prototype.tp$name = "alias";

/* ----- withitem ----- */
export class withitem extends AST {
    context_expr: expr;
    optional_vars: expr | null;
    constructor(context_expr: expr, optional_vars: expr | null) {
        super();
        this.context_expr = context_expr;
        this.optional_vars = optional_vars;
    }
}
withitem.prototype._fields = ["context_expr", "optional_vars"];
withitem.prototype.tp$name = "withitem";

/* ----- type_ignore ----- */
export class type_ignore extends AST {}
type_ignore.prototype.tp$name = "type_ignore";

export const TypeIgnore_kind = 1;
export class TypeIgnore extends type_ignore {
    lineno: number;
    tag: string;
    _kind = 1;
    constructor(lineno: number, tag: string) {
        super();
        this.lineno = lineno;
        this.tag = tag;
    }
}
TypeIgnore.prototype._fields = ["lineno", "tag"];
TypeIgnore.prototype.tp$name = "TypeIgnore";
