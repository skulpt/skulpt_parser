from . import (
    out_file,
    js_generator,
    python_parser_path,
    grammar_file,
)

import shutil
import os
import subprocess
import argparse
import tempfile
from ..env import checkout_python_branch

parser = argparse.ArgumentParser(description="generate the parser")

parser.add_argument(
    "-v", "--verbosity", "--verbose", nargs="?", type=int, const=1, help="verbose parser = 1 or 2", default=0
)
args = parser.parse_args()
verbosity = args.verbosity

checkout_python_branch()
# apply the grammar patch
subprocess.run(["vr", "apply_grammar_patch"])

# make a tmp copy of the python_parser
with tempfile.NamedTemporaryFile("w+", suffix=".py") as tmp:
    shutil.copyfile(python_parser_path, tmp.name)
    try:
        # replace the python parser with our js parser
        shutil.copyfile(js_generator, python_parser_path)
        # we can't do this at the top of the file since we need to have changed the parser generator first
        from pegen.build import build_python_parser_and_generator

        build_python_parser_and_generator(grammar_file, out_file)
        # run prettier
        subprocess.run(["pre-commit", "run", "prettier", "--files", out_file, "||", "true"])
    finally:
        # put the file back
        shutil.copyfile(tmp.name, python_parser_path)

if not verbosity:
    quit()

with open(out_file, "r") as f:
    content = f.read()
with open(out_file, "w") as f:
    verbosity = 1 if verbosity == 1 else 2
    content = content.replace("{ pegen }", f"{{ pegenV{verbosity} as pegen }}")
    if verbosity == 2:
        content = content.replace("./parser", "./verbose_parser")
    f.write(content)
