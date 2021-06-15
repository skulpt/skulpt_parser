from . import path_to_cpython, out_file
from .asdl_js import main

asdl_path = path_to_cpython + "/Parser/Python.asdl"
main(asdl_path, out_file)
