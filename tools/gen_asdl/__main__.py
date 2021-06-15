from . import out_file, asdl_path
from .asdl_js import main
from ..env import checkout_python_branch

checkout_python_branch()
main(asdl_path, out_file)
