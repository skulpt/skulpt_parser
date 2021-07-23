import { SymbolTableScope } from "./SymbolTableScope.ts";
import { SYMTAB_CONSTS } from "./util.ts";

export class Symbol_ {
    __name: string;
    __flags: number;
    __scope: number;
    __namespaces: SymbolTableScope[] | null = null;
    __module_scope = false;

    constructor(name: string, flags: number, namespaces: SymbolTableScope[] | null = null, moduleScope = false) {
        this.__name = name;
        this.__flags = flags;
        this.__scope = (flags >> SYMTAB_CONSTS.SCOPE_OFFSET) & SYMTAB_CONSTS.SCOPE_MASK; // like PyST_GetScope()
        this.__namespaces = namespaces;
        this.__module_scope = moduleScope;
    }

    get [Symbol.toStringTag]() {
        return '<symbol "' + this.__name + '">';
    }

    get_name() {
        return this.__name;
    }

    is_referenced() {
        return !!(this.__flags & SYMTAB_CONSTS.USE);
    }

    is_parameter() {
        return !!(this.__flags & SYMTAB_CONSTS.DEF_PARAM);
    }

    is_global() {
        /* Return *True* if the symbol is global. */
        return !!(
            [SYMTAB_CONSTS.GLOBAL_IMPLICIT, SYMTAB_CONSTS.GLOBAL_EXPLICIT].includes(this.__scope) ||
            (this.__module_scope && !!(this.__flags & SYMTAB_CONSTS.DEF_BOUND))
        );
    }

    is_nonlocal() {
        return !!(this.__flags & SYMTAB_CONSTS.DEF_NONLOCAL);
    }

    is_declared_global() {
        return !!(this.__scope === SYMTAB_CONSTS.GLOBAL_EXPLICIT);
    }

    is_local() {
        /* Return *True* if the symbol is local. */
        return !!(
            [SYMTAB_CONSTS.LOCAL, SYMTAB_CONSTS.CELL].includes(this.__scope) ||
            (this.__module_scope && this.__flags & SYMTAB_CONSTS.DEF_BOUND)
        );
    }

    is_annotated() {
        return !!(this.__flags & SYMTAB_CONSTS.DEF_ANNOT);
    }

    is_free() {
        return !!(this.__scope === SYMTAB_CONSTS.FREE);
    }

    is_imported() {
        return !!(this.__flags & SYMTAB_CONSTS.DEF_IMPORT);
    }

    is_assigned() {
        return !!(this.__flags & SYMTAB_CONSTS.DEF_LOCAL);
    }

    is_comprehension() {
        return !!(this.__flags & SYMTAB_CONSTS.DEF_COMP_ITER);
    }

    is_namespace() {
        /*
        Returns true if name binding introduces new namespace.

        If the name is used as the target of a function or class
        statement, this will be true.

        Note that a single name can be bound to multiple objects.  If
        is_namespace() is true, the name may also be bound to other
        objects, like an int or list, that does not introduce a new
        namespace.
        */
        return this.__namespaces !== null && this.__namespaces.length > 0;
    }

    get_namespaces() {
        /* Return a list of namespaces bound to this name */
        return this.__namespaces;
    }

    get_namespace() {
        /*
        Returns the single namespace bound to this name.

        Raises ValueError if the name is bound to multiple namespaces.
        */

        if (this.__namespaces?.length !== 1) {
            throw Error("name is bound to multiple namespaces");
            // todo: This should be a value error maybe
        }

        return this.__namespaces[0];
    }
}
