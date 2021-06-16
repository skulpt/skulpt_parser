## you should be in the root directory
## run this module
# python -m tools.get_asdl

from ..env import PATH_TO_CPYTHON, PYTHON_BRANCH
import sys

sys.path += [PATH_TO_CPYTHON + "/Parser"]

out_file = "src/ast/astnodes.ts"
asdl_path = PATH_TO_CPYTHON + "/Parser/Python.asdl"
