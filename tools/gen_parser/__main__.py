from . import path_to_cpython, out_file, js_generator

import shutil
import os

python_parser_path = path_to_cpython + "/Tools/peg_generator/pegen/python_generator.py"
grammar_file = path_to_cpython + "/Grammar/python.gram"
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
