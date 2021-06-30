## Experiments with python 3.9 pegen parser for Skulpt

### Requirements

- [Deno](https://deno.land/manual/getting_started/installation)
- [Velociraptor](https://velociraptor.run/docs/installation/)
- [Pre-commit](https://pre-commit.com/#install) - `pre-commit install` must be executed for this plugin to have an effect

### Scripts

- `vr build`
  ⋅⋅⋅ _bundles the typescript files into a javascript bundle)_
- `vr bundle`
  _an alternative to build - uses deno bundle - no minified version_
- `vr format`
  _runs the precommit hooks for all files_
- `vr gen_parser [-v --verbose --verbosity]=1|2`
  _generates the javascript parser. Use `--verbose|-v|--verbosity` to generate a verbose parser._
- `vr gen_asdl`
  _generates the javascript astnodes_
- `vr gen_ast`
  _regenerates the ast for the run-test files from python and dumps the ast in .ast files_
- `vr gen_gramar_patch`
  _run this after you manually changed the gramar file to store your changes_
- `vr apply_gramar_patch`
  _run this patch the gramar with the changes stored in the patch_
- `vr parse <filename|number> [--nc --no_comapre] [--mode=exec]`
  _parses a python file and logs the generated ast vs the python ast_
- `vr parse_str <code string> [--nc --no_comapre] [--mode=exec]`
  _parses a python file and logs the generated ast vs the python ast_
- `vr test <shortname> [-f --fail-fast] [-v]`
  _run a test - shortnames: `pypeg`, `parse`, `dump`_

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
