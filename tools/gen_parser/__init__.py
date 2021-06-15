## you should be in the root directory
## run this module
# python -m tools.gen_parser

import sys
from ..env import PATH_TO_CPYTHON, PYTHON_BRANCH

sys.path += [PATH_TO_CPYTHON + "/Tools/peg_generator"]

js_generator = "tools/gen_parser/skulpt_parser_genarator.py"
out_file = "src/parser/generated_parser.ts"
python_parser_path = PATH_TO_CPYTHON + "/Tools/peg_generator/pegen/python_generator.py"
grammar_file = PATH_TO_CPYTHON + "/Grammar/python.gram"
