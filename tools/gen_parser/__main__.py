from . import (
    out_file,
    js_generator,
    python_parser_path,
    grammar_file,
)

import shutil
import os

from ..env import checkout_python_branch

checkout_python_branch()

temp = "tmp.py"
# make a tmp copy of the python_parser
shutil.copyfile(python_parser_path, temp)

try:
    # replace the python parser with our js parser
    shutil.copyfile(js_generator, python_parser_path)
    from pegen.build import build_python_parser_and_generator

    build_python_parser_and_generator(grammar_file, out_file)
finally:
    shutil.copyfile(temp, python_parser_path)
    os.remove(temp)
