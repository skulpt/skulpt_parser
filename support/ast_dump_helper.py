import ast


class Null:
    def __repr__(self):
        return "null"


null = Null()


def clean_val(x):
    # we're hacking a bit since we don't have pyStr
    if isinstance(x, str):
        return repr(x)[1:-1]
    return x


class jsVisitor(ast.NodeTransformer):
    def visit(self, node):
        cls = type(node)
        fields = []
        for field, old_value in ast.iter_fields(node):
            if old_value is None and getattr(cls, field, ...) is None:
                fields.append(null)
            elif old_value is None:
                fields.append(None)
            elif isinstance(old_value, ast.AST):
                fields.append(self.visit(old_value))
            elif isinstance(old_value, list):
                fields.append(
                    list(
                        map(
                            lambda x: self.visit(x) if isinstance(x, ast.AST) else clean_val(x),
                            old_value,
                        )
                    )
                )
            else:
                fields.append(clean_val(old_value))
        attrs = list(map(lambda attr: [attr, getattr(node, attr)], node._attributes))
        try:
            return cls(*fields, **dict(attrs))
        except Exception:
            raise


def dump(source, include_attributes=False, js=False, indent=None, mode="exec"):
    parsed = ast.parse(source, mode=mode)
    if js:
        parsed = jsVisitor().generic_visit(parsed)
    return ast.dump(parsed, annotate_fields=not js, include_attributes=include_attributes, indent=indent)
