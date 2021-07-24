#! /usr/bin/env python
"""Generate JS code from an ASDL description."""

# TO DO
# handle fields that have a type but no name

import os
import sys
import subprocess

import asdl

TABSIZE = 4
MAX_COL = 119

C_TO_TS_TYPES = {"int": "number"}
TS_TYPES = {"identifier", "number", "string", "constant"}


def clean_name(name: str) -> str:
    if name[-1] == "_":
        return name[:-1]
    return name


def get_ts_type(name: str) -> str:
    """Return a string for the ts name of the type.

    This function special cases the default types provided by asdl:
    identifier, string, int, bool.
    """
    if name in asdl.builtin_types:
        return C_TO_TS_TYPES.get(name, name)
    else:
        return name


def reflow_lines(s, depth):
    """Reflow the line s indented depth tabs.

    Return a sequence of lines where no line extends beyond MAX_COL
    when properly indented.  The first line is properly indented based
    exclusively on depth * TABSIZE.  All following lines -- these are
    the reflowed lines generated by this function -- start at the same
    column as the first character beyond the opening { in the first
    line.
    """
    size = MAX_COL - depth * TABSIZE
    if len(s) < size:
        return [s]

    lines = []
    cur = s
    padding = ""
    while len(cur) > size:
        i = cur.rfind(" ", 0, size)
        # XXX this should be fixed for real
        if i == -1 and "GeneratorExp" in cur:
            i = size + 3
        assert i != -1, "Impossible line %d to reflow: %r" % (size, s)
        lines.append(padding + cur[:i])
        if len(lines) == 1:
            # find new size based on brace
            j = cur.find("{", 0, i)
            if j >= 0:
                j += 2  # account for the brace and the space after it
                size -= j
                padding = " " * j
            else:
                j = cur.find("(", 0, i)
                if j >= 0:
                    j += 1  # account for the paren (no space after it)
                    size -= j
                    padding = " " * j
        cur = cur[i + 1 :]
    else:
        lines.append(padding + cur)
    return lines


def is_simple(sum):
    """Return True if a sum is a simple.

    A sum is simple if its types have no fields, e.g.
    unaryop = Invert | Not | UAdd | USub
    """
    for t in sum.types:
        if t.fields:
            return False
    return True


class EmitVisitor(asdl.VisitorBase):
    """Visit that emits lines"""

    def __init__(self, file):
        self.file = file
        super(EmitVisitor, self).__init__()

    def emit(self, s, depth, reflow=1):
        # XXX reflow long lines?
        if reflow:
            lines = reflow_lines(s, depth)
        else:
            lines = [s]
        for line in lines:
            line = (" " * TABSIZE * depth) + line + "\n"
            self.file.write(line)

    def emit_tp_name(self, name):
        self.emit(f'static _name = "{clean_name(name)}";', 1, 0)


class KindsVisitor(EmitVisitor):
    def visitModule(self, mod):
        for dfn in mod.dfns:
            self.visit(dfn)

    def visitType(self, type, depth=0):
        self.emit(f"{type.name},", depth=depth + 1)
        self.visit(type.value, type.name, depth)

    def visitSum(self, sum, name, depth):
        if not is_simple(sum):
            for t in sum.types:
                self.visit(t, name, sum.attributes)

    def visitConstructor(self, cons, type, attrs):
        self.emit(f"{cons.name},", depth=1)


class ASTVisitorVisitor(EmitVisitor):
    simple_types = set()

    def __init__(self, file):
        super().__init__(file)
        self.emit("visitSeq(seq: AST[] | null) {", depth=1)
        self.emit("if (seq === null) return null", depth=2)
        self.emit("for (const node of seq) {", depth=2)
        self.emit("node.walkabout(this);", depth=3)
        self.emit("}", depth=2)
        self.emit("}", depth=1)
        self.emit("", depth=0)

        self.emit("defaultVisitor(_node: AST): any {", depth=1)
        self.emit("throw new Error('NodeVisitor not implemented');", depth=2)
        self.emit("}", depth=1)
        self.emit("", depth=0)

    def visitModule(self, mod):
        for dfn in mod.dfns:
            self.visit(dfn)

    def visitType(self, type, depth=0):
        self.visit(type.value, type.name, depth)

    def visitSum(self, sum, name, depth):
        if not is_simple(sum):
            for t in sum.types:
                self.visit(t, name, sum.attributes)

    def visitConstructor(self, cons, type, attrs):
        self.emit(f"visit_{cons.name}(node: {cons.name}): any {{", depth=1)
        self.emit("return this.defaultVisitor(node);", depth=2)
        self.emit("}", depth=1)

    def visitProduct(self, prod, name, depth):
        self.emit(f"visit_{name}(node: {name}): any {{", depth=1)
        self.emit("return this.defaultVisitor(node);", depth=2)
        self.emit("}", depth=1)


class GenericASTVisitorVisitor(EmitVisitor):
    def __init__(self, file):
        super().__init__(file)
        self.emit("visitSeq(seq: AST[] | null) {", depth=1)
        self.emit("if (seq === null) return null", depth=2)
        self.emit("for (const node of seq) {", depth=2)
        self.emit("node.walkabout(this);", depth=3)
        self.emit("}", depth=2)
        self.emit("}", depth=1)
        self.emit("", depth=0)

        self.emit("defaultVisitor(_node: AST) {", depth=1)
        self.emit("throw new Error('NodeVisitor not implemented');", depth=2)
        self.emit("}", depth=1)
        self.emit("", depth=0)

    def visitModule(self, mod):
        for dfn in mod.dfns:
            self.visit(dfn)

    def visitType(self, type, depth=0):
        self.visit(type.value, type.name, depth)

    def visitSum(self, sum, name, depth):
        if not is_simple(sum):
            for t in sum.types:
                self.visit(t, name, sum.attributes)

    def visitConstructor(self, cons, type, attrs):
        self.emit(f"visit_{cons.name}(node: {cons.name}) {{", depth=1)
        self.emit("return this.defaultVisitor(node);", depth=2)
        self.emit("}", depth=1)


simple_sum_types = set()


class TypeDefVisitor(EmitVisitor):
    def visitModule(self, mod):
        for dfn in mod.dfns:
            self.visit(dfn)

    def visitType(self, type, depth=0):
        self.visit(type.value, type.name, depth)

    def visitSum(self, sum, name, depth):
        if is_simple(sum):
            self.simple_sum(sum, name, depth)
            simple_sum_types.add(name)

    def simple_sum(self, sum, name, depth):
        def emit(s, depth=depth):
            self.emit(s, depth)

        emit(f"/* ----- {name} ----- */")
        emit(f"export class {name} extends AST {{")
        self.emit_tp_name(name)
        emit("}")
        emit(f"{name}.prototype._enum = true;")
        emit("")

        class T:
            def __init__(self, name):
                self.name = name

        for type in sum.types:
            emit(f"export class {type.name + 'Type'} extends {name} {{")
            self.emit_tp_name(type.name)
            emit("}")
        for type in sum.types:
            emit(f"export const {type.name} = new {type.name + 'Type'}()")
        emit("")

    def visitProduct(self, product, name, depth):
        pass


class PrototypeVisitor(EmitVisitor):
    """Generate function prototypes for the .h file"""

    def visitModule(self, mod):
        for dfn in mod.dfns:
            self.visit(dfn)

    def visitType(self, type):
        self.visit(type.value, type.name)

    def visitSum(self, sum, name):
        if is_simple(sum):
            pass  # XXX
        else:
            self.emit(f"/* ----- {name} ----- */", 0)
            self.emit_base(name, self.get_args(sum.attributes))

            for t in sum.types:
                self.visit(t, name, sum.attributes)

    def get_args(self, fields):
        """Return list of ts argument into, one for each field.

        Argument info is 3-tuple of a ts type, variable name, and flag
        that is true if type can be NULL.
        """
        args = []
        unnamed = {}
        for f in fields:
            if f.name is None:
                name = f.type
                c = unnamed[name] = unnamed.get(name, 0) + 1
                if c > 1:
                    name = "name%d" % (c - 1)
            else:
                name = f.name
            # XXX should extend get_c_type() to handle this
            if f.seq:
                # @TODO this would be replaces by an asdl patch
                if name == "kw_defaults" or name == "keys":
                    ts_type = "(expr | null)[]"
                else:
                    ts_type = f"{f.type}[]"
            else:
                ts_type = get_ts_type(f.type)
            args.append((ts_type, name, f.opt, f.seq))
        return args

    @staticmethod
    def _constructor_args(args, attrs=False):
        ts_args = []
        for atype, aname, opt, seq in args:
            atype = atype
            if (opt or seq) and not attrs:
                # optional types really means can be null rather than optional
                atype = atype if not opt and not seq else atype + " | null"
            ts_args.append(f"{aname}: {atype}")
        return ", ".join(ts_args)

    def visitConstructor(self, cons, type, attrs):
        args = self.get_args(cons.fields)
        attrs = self.get_args(attrs)
        ts_type = get_ts_type(type)
        self.emit_function(cons.name, ts_type, args, attrs)

    def visitProduct(self, prod, name):
        self.emit(f"/* ----- {name} ----- */", 0)
        self.emit_function(
            name, get_ts_type(name), self.get_args(prod.fields), self.get_args(prod.attributes), union=0
        )


class FunctionVisitor(PrototypeVisitor):
    """Visitor to generate constructorfunctions for AST."""

    def emit(self, s, depth=0, reflow=1):
        super().emit(s, depth, reflow)

    def emit_instance_types(self, args, attrs=False):
        for atype, aname, opt, seq in args:
            atype = atype
            if opt and not attrs:
                # optional types really means can be null rather than optional
                atype = atype if not opt else atype + " | null"
            self.emit(f"{aname}: {atype};", 1)

    def emit_function(self, name, ts_type, args, attrs, union=1):
        emit = self.emit

        arg_names = "[" + ", ".join(map(lambda arg: f'"{arg[1]}"', args)) + "]"

        emit(f"export class {name} extends {ts_type if union else 'AST'} {{")
        self.emit_tp_name(name)

        self.emit_instance_types(args)
        _args = self._constructor_args(args)
        sep = ", " if args else ""

        if union and attrs:
            constructorArgs = f"constructor({_args}{sep}...attrs: Attrs) {{"
            emit(constructorArgs, 1)
            emit("super(...attrs);", 2)
        else:
            self.emit_instance_types(attrs, True)
            _attrs = self._constructor_args(attrs, True)
            emit(f"constructor({_args}{sep}{_attrs}) {{", 1)
            emit("super();", 2)

        if union:
            self.emit_body_union(name, args, attrs)
            # print(name)
        else:
            self.emit_body_struct(name, args, attrs)
        emit("}", 1)

        self.emit_mutate_over(name, args)

        emit("}")
        # keep this on the prototype because defining it inside the class, e.g.
        # _fields = ['arg0', 'arg1'];
        # is an instance definition not a prototype definition so is created per instance
        # similarly:
        # static _fields = ['arg0', 'arg1'];
        # is also not what we want since to retrieve it from an instance has to call the constructor
        # js class definitions are almost perfect - apart from this!
        # related discussion https://github.com/Microsoft/TypeScript/issues/3743
        # could instead use
        # get _fields () {return ['arg0', 'arg1'];}
        emit(f"{name}.prototype._fields = {arg_names};")
        emit(f"{name}.prototype._kind = ASTKind.{name}")
        if not union and attrs:
            emit(f"{name}.prototype._attributes = _attrs;")
        emit("")

    def emit_body_union(self, name, args, attrs):
        self.emit_body_attrs(args)
        # don't both with the attrs since we inherit these from the super class

    def emit_mutate_over(self, name, args):
        emit = self.emit
        emit("mutateOver(visitor: ASTVisitor) {", 1)
        level = 2
        # first = True
        for a_type, argname, opt, seq in args:
            optional_seq = argname == "kw_defaults" or argname == "keys"
            typename = a_type.replace("[]", "")
            if typename in TS_TYPES or typename in simple_sum_types:
                continue
            # if first:
            #     emit("let newNode;", 2)
            #     first = False
            if opt:
                emit(f"if (this.{argname}) {{", level)
                level += 1
            if seq:
                emit(f"this.{argname}.forEach((node, i) => {{", level)
                if optional_seq:
                    emit("if (node === null) return;", level + 1)
                # emit(f"newNode = node.mutateOver(visitor);", level+1)
                # emit(f"newNode !== node && (this.{argname}[i] = newNode as {a_type.replace('[]', '')});", level+1)
                emit(f"this.{argname}[i] = node.mutateOver(visitor) as {a_type.replace('[]', '')};", level + 1)
                emit("})", level)
            else:
                #     emit(f"newNode = this.{argname}.mutateOver(visitor);", level)
                #     emit(f"newNode !== this.{argname} && (this.{argname} = newNode as {a_type});", level)
                emit(f"this.{argname} = this.{argname}.mutateOver(visitor) as {a_type.replace('[]', '')};", level + 1)

            if opt:
                level -= 1
                emit("}", level)

        emit(f"return visitor.visit_{name}(this)", 2)
        emit("}", 1)

        emit("walkabout(visitor: ASTVisitor) {", 1)
        emit(f"return visitor.visit_{name}(this)", 2)
        emit("}", 1)

    def emit_body_struct(self, name, args, attrs):
        self.emit_body_attrs(args)
        self.emit_body_attrs(attrs)

        # assert not attrs

    def emit_body_attrs(self, attrs):
        emit = self.emit
        for _, argname, _, seq in attrs:
            emit(f"this.{argname} = {argname}{' || []' if seq else ''};", 2)

    def emit_base(self, name, attrs):
        emit = self.emit

        if not attrs:
            emit(f"export class {name} extends AST {{")
            self.emit_tp_name(name)
            emit("}")
            emit("")
            return

        emit(f"export class {name} extends AST {{")
        self.emit_tp_name(name)

        self.emit_instance_types(attrs, True)
        _attrs = self._constructor_args(attrs, True)

        emit(f"constructor({_attrs}) {{", 1)
        emit("super();", 2)
        self.emit_body_attrs(attrs)
        emit("}", 1)
        emit("}")
        emit(f"{name}.prototype._attributes = _attrs;")
        emit("")


class ChainOfVisitors:
    def __init__(self, *visitors):
        self.visitors = visitors

    def visit(self, object):
        for v in self.visitors:
            v.visit(object)


common_msg = "/* File automatically generated by %s. */\n"


def main(asdlfile, outputfile):
    argv0 = sys.argv[0]
    components = argv0.split(os.sep)
    argv0 = os.sep.join(components[-2:])
    auto_gen_msg = common_msg % argv0
    with open(asdlfile, "r") as file:
        # @TODO this would be replaces by an asdl patch
        lines = (
            file.read()
            .replace("arguments", "arguments_")
            .replace("Set", "Set_")
            .replace("Set_Comp", "SetComp")
            .replace("Continue", "Continue | Debugger")
        )
    with open("temp.asdl", "w") as f:
        f.write(lines)

    mod = asdl.parse("temp.asdl")
    os.remove("temp.asdl")
    if not asdl.check(mod):
        sys.exit(1)

    f = open(outputfile, "w")

    with open("./LICENSE.txt", "r") as license:
        license_prelude = "".join(f"// {line}" for line in license.readlines()) + "\n"

    f.write(license_prelude)
    f.write(auto_gen_msg)
    f.write("/* module that holds all nodes */\n")
    f.write("// deno-lint-ignore-file camelcase\n\n")
    f.write(
        """
import type { pyConstant } from "./constants.ts";

export type identifier = string;
export type constant = pyConstant;
"""
    )

    f.write("export const enum ASTKind {")
    k = KindsVisitor(f)
    k.visit(mod)
    f.write("}")

    f.write(
        """
/** base class for all AST nodes */
export interface AST {
    _fields: string[];
    _attributes: string[];
    _enum: boolean;
    _kind: ASTKind;
    mutateOver(visitor: ASTVisitor): any;
}

export class AST {
    static _name = "AST";
    get [Symbol.toStringTag]() {
        return (this.constructor as typeof AST)._name;
    }
    mutateOver(visitor: ASTVisitor): any {
        throw new Error("mutateOver() implementation not provided")
    }
    walkabout(visitor: ASTVisitor): any {
        throw new Error("walkabout() implementation not provided")
    }
}
AST.prototype._attributes = [];
AST.prototype._fields = [];
AST.prototype._enum = false;

export type Attrs = [number, number, number, number];
const _attrs = ["lineno", "col_offset", "end_lineno", "end_col_offset"];

"""
    )

    f.write("/* ---------------------- */\n")
    f.write("/* constructors for nodes */\n")
    f.write("/* ---------------------- */\n")
    f.write("\n")

    c = TypeDefVisitor(f)
    c.visit(mod)

    v = FunctionVisitor(f)
    v.visit(mod)

    f.write("export class ASTVisitor {")
    a = ASTVisitorVisitor(f)
    a.visit(mod)
    f.write("}")

    f.close()
    print(simple_sum_types)

    # run prettier over the file
    subprocess.run(["pre-commit", "run", "prettier", "--files", outputfile])
