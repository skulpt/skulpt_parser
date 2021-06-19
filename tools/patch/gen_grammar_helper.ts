import { Colors } from "../../deps.ts";
import { getDiff } from "../../support/diff.ts";
/**
 * This script is a helper function to generate a skulpt.gram file from a python.gram file
 * To run this script use
 * deno run tools/patch/gen_grammar_helper.ts
 * or
 * vr gen_grammar_helper
 */

const grammar = Deno.readTextFileSync("../cpython/Grammar/python.gram");

const newGrammar = grammar
    .replaceAll(/_ty(\]|\))/g, "$1")
    .replaceAll(/(^|\[)arguments/gm, "$1arguments_")
    .replaceAll("*]", "]")
    .replaceAll("asdl_seq", "any")
    .replaceAll("NULL", "null")
    .replaceAll("_Py_", "new astnodes.")
    .replaceAll("_PyPegen_", "pegen.")
    .replaceAll("EXTRA", "...EXTRA")
    .replaceAll("AugOperator", "operator")
    // .replaceAll(/CHECK\((.+?\))\)/g, "$1") // we might need this but I don't think so
    .replaceAll(/,\s+p->arena/g, "")
    .replaceAll("(p, ", "(this, ")
    .replaceAll(/->v\.[\w]+\.(\w+)/g, ".$1")
    .replaceAll(/([^'"])->/g, "$1.")
    .replaceAll(/([,{] )([A-Z]+[a-z]+[\w]*)/g, "$1 new astnodes.$2") // , Load et al
    .replaceAll(/\(([a-z])\) \? \(\(expr\) [a-z]\)\.(\w+) : null/g, "$1 ? $1.$2 : null")
    .replaceAll(/"pegen.augoperator\((new astnodes.\w+)\)/g, "$1")
    .replaceAll(/Py_([None|False|True|Ellipsis])/g, "py$1")
    .replaceAll("RAISE", "pegen.RAISE")
    .replaceAll("NEW_TYPE_COMMENT", "pegen.NEW_TYPE_COMMENT");

// const diff = getDiff(grammar, newGrammar);
// console.log(diff);

Deno.writeTextFileSync("tools/patch/skulpt.temp.gram", newGrammar);

console.log(Colors.green("done"));
