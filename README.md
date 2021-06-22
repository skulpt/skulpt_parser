Experiments with python 3.9 pegen parser for Skulpt

Requirements

-   [Deno](https://deno.land/manual/getting_started/installation)
-   [Velociraptor](https://velociraptor.run/docs/installation/)
-   [Pre-commit](https://pre-commit.com/#install)

Scripts

-   `vr build` - bundles the typescript files into a javascript bundle
-   `vr bundle` - an alternative to build - uses deno bundle - no minified version
-   `vr format` - runs the precommit hooks for all files

-   `vr gen_parser [-v --verbose --verbosity]=1|2` - generates the javascript parser. Use --verbose|-v|--verbosity to generate a verbose parser.
-   `vr gen_asdl` - generates the javascript astnodes
-   `vr gen_ast` - regenerates the ast for the run-test files from python and dumps the ast in .ast files

-   `vr gen_gramar_patch` - run this after you manually changed the gramar file to store your changes
-   `vr apply_gramar_patch` - run this patch the gramar with the changes stored in the patch

-   `vr parse <filename|number> --no_comapre --mode=exec` - parses a python file and logs the generated ast vs the python ast
-   `vr parse_str <code string> --no_comapre --mode=exec` - parses a python file and logs the generated ast vs the python ast

-   `vr test <shortname> [-f --fail-fast] [-v]` - run a test - shortnames: pypeg, parse, dump
