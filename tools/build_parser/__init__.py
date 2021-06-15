## you should be in the root directory
## run this module
# python -m tools.build_parser

import sys

path_to_cpython = "../cpython"
sys.path += [path_to_cpython + "/Tools/peg_generator"]

js_generator = "tools/build_parser/skulpt_parser_genarator.py"
out_file = "src/parser/generated_parser.ts"
