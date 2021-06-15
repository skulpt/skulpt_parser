import subprocess
import os

PATH_TO_CPYTHON = "../cpython"
PYTHON_BRANCH = "3.9"


def checkout_python_branch():
    cwd = os.getcwd()
    os.chdir(PATH_TO_CPYTHON)
    print(f"#### checking out python {PYTHON_BRANCH} ####")
    label = subprocess.check_output(["git", "checkout", PYTHON_BRANCH]).strip()
    print(str(label, "utf"))
    os.chdir(cwd)
