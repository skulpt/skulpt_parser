## you should be in the root directory
## run this module
# python -m tools.build_parser

import sys

path_to_cpython = "../cpython"
sys.path += [path_to_cpython + "/Parser"]

out_file = "src/parser/astnodes.ts"
