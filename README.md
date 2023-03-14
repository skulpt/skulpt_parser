## Experiments with python 3.9 pegen parser for Skulpt

### Requirements

- [Deno](https://deno.land/manual/getting_started/installation)
- [Velociraptor](https://velociraptor.run/docs/installation/)
- [Pre-commit](https://pre-commit.com/#install) - `pre-commit install` must be executed for this plugin to have an effect

### Scripts

- `deno task build`
  - _bundles the typescript files into a javascript bundle)_
- `deno task bundle`
  - _an alternative to build - uses deno bundle - no minified version_
- `deno task format`
  - _runs the precommit hooks for all files_
- `deno task gen_parser [-v --verbose --verbosity]=1|2`
  - _generates the javascript parser. Use `--verbose|-v|--verbosity` to generate a verbose parser._
- `deno task gen_asdl`
  - _generates the javascript astnodes_
- `deno task gen_ast`
  - _regenerates the ast for the run-test files from python and dumps the ast in .ast files_
- `deno task gen_gramar_patch`
  - _run this after you manually changed the gramar file to store your changes_
- `deno task apply_gramar_patch`
  - _run this patch the gramar with the changes stored in the patch_
- `deno task parse <filename|number> [--nc --no_comapre] [--mode=exec]`
  - _parses a python file and logs the generated ast vs the python ast_
- `deno task parse_str <code string> [--nc --no_comapre] [--mode=exec]`
  - _parses a python file and logs the generated ast vs the python ast_
- `deno task symtable <filename|number>`
  - _parses the file and created a symbol table for that ast and prints it_
- `deno task test <shortname> [-f --fail-fast] [-v]`
  - _run a test - shortnames: `pypeg`, `parse`, `dump`, `symtable`_

### Debugging/Pofiling

See Deno docs on [the subject](https://deno.land/manual/getting_started/debugging_your_code).

```sh
# example script execution for inspection use the [--inspect-brk] flag
deno run -A --inspect-brk scripts/parse.ts tmp.txt
```

Open `chrome://inspect` and click `Inspect` below `Target`:

<img width="240" alt="inspect" src="https://deno.land/x/deno@v1.11.3/docs/images/debugger1.jpg">

- This will open chrome devtools.
- The execution of the script will be paused.
- Run the profiler or add break points to the source and resume the execution
  _(Click `pretty-print` in source files to display times from profiling)_
