import { Module, stmt } from "../ast/astnodes.ts";
import { Parser } from "./parser.ts";

export function make_module(p: Parser, a: stmt[]) {
    // Ingoring the #type: ignore comment mangling here
    return new Module(a, []);
}

export function new_type_comment(p: Parser, c: any): any {
    // _PyPegen_new_type_comment(Parser *p, char *s)
    // {
    //     PyObject *res = PyUnicode_DecodeUTF8(s, strlen(s), NULL);
    //     if (res == NULL) {
    //         return NULL;
    //     }
    //     if (PyArena_AddPyObject(p->arena, res) < 0) {
    //         Py_DECREF(res);
    //         return NULL;
    //     }
    //     return res;
    // }
}

// _PyPegen_make_Module(Parser *p, asdl_seq *a) {
//     asdl_seq *type_ignores = NULL;
//     Py_ssize_t num = p->type_ignore_comments.num_items;
//     if (num > 0) {
//         // Turn the raw (comment, lineno) pairs into TypeIgnore objects in the arena
//         type_ignores = _Py_asdl_seq_new(num, p->arena);
//         if (type_ignores == NULL) {
//             return NULL;
//         }
//         for (int i = 0; i < num; i++) {
//             PyObject *tag = _PyPegen_new_type_comment(p, p->type_ignore_comments.items[i].comment);
//             if (tag == NULL) {
//                 return NULL;
//             }
//             type_ignore_ty ti = TypeIgnore(p->type_ignore_comments.items[i].lineno, tag, p->arena);
//             if (ti == NULL) {
//                 return NULL;
//             }
//             asdl_seq_SET(type_ignores, i, ti);
//         }
//     }
//     return Module(a, type_ignores, p->arena);
// }
