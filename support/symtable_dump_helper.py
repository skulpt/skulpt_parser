from symtable import Class, Function, Symbol, SymbolTable, symtable
from typing import Mapping, Union, cast
import json


def symbol_to_dict(symbol: Symbol):
    return {
        "name": symbol.get_name(),
        "referenced": symbol.is_referenced(),
        "parameter": symbol.is_parameter(),
        "global": symbol.is_global(),
        "nonlocal": symbol.is_nonlocal(),
        "declared_global": symbol.is_declared_global(),
        "local": symbol.is_local(),
        "annotated": symbol.is_annotated(),
        "free": symbol.is_free(),
        "imported": symbol.is_imported(),
        "assigned": symbol.is_assigned(),
        "namespace": symbol.is_namespace(),
        "namespaces": [table_to_dict(t) for t in symbol.get_namespaces()],
    }


def table_to_dict(table: SymbolTable) -> Mapping[str, Union[str, int, bool]]:
    res = {
        "type": table.get_type(),
        "name": table.get_name(),
        "lineno": table.get_lineno(),
        "nested": table.is_nested(),
        "has_children": table.has_children(),
        "children": [table_to_dict(c) for c in table.get_children()],
    }

    if table.get_type() == "function":
        func: Function = cast(Function, table)
        res = {
            **res,
            "params": func.get_parameters(),
            "locals": func.get_locals(),
            "globals": func.get_globals(),
            "nonlocals": func.get_nonlocals(),
            "frees": func.get_frees(),
        }

    if table.get_type() == "class":
        class_: Class = cast(Class, table)
        res = {**res, "methods": class_.get_methods()}

    res["identifiers"] = [symbol_to_dict(table.lookup(s)) for s in table.get_identifiers()]

    return res


def dump(content):
    table = symtable(content, "<stdin>", "exec")
    return json.dumps(table_to_dict(table), indent=2)
