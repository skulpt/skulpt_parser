import ast
import argparse

parser = argparse.ArgumentParser(description="Dump AST from file to file")

parser.add_argument("content", type=str, help="source to be parsed")
parser.add_argument("--indent", type=int, default=None, required=False, help="indent")
parser.add_argument("--attrs", type=int, default=0, required=False, help="show attrs")
parser.add_argument("--js", type=int, default=0, required=False, help="show attrs")

args = parser.parse_args()

parsed = ast.parse(args.content)
indent = args.indent if args.indent != -1 else None


# We need null values to fil empty fields
class Null:
    def __repr__(self):
        return "null"


null = Null()


class jsVisitor(ast.NodeTransformer):
    def visit(self, node):
        cls = type(node)
        fields = []
        for field, old_value in ast.iter_fields(node):
            if old_value is None and getattr(cls, field, ...) is None:
                fields.append(null)
            elif old_value is None:
                fields.append("None")
            elif isinstance(old_value, ast.AST):
                fields.append(self.visit(old_value))
            elif isinstance(old_value, list):
                fields.append(
                    list(
                        map(
                            lambda x: self.visit(x) if isinstance(x, ast.AST) else x,
                            old_value,
                        )
                    )
                )
            else:
                fields.append(old_value)
        attrs = list(map(lambda attr: [attr, getattr(node, attr)], node._attributes))
        try:
            return cls(*fields, **dict(attrs))
        except Exception:
            raise


if args.js:
    parsed = jsVisitor().generic_visit(parsed)

print(ast.dump(parsed, include_attributes=args.attrs, indent=indent))
