import ast
import argparse

parser = argparse.ArgumentParser(description='Dump AST from file to file')

parser.add_argument('filename', type=str, help="filename to be parsed and dumped")
parser.add_argument('--ext', type=str, help="extension to add to the file", default=".ast")

args = parser.parse_args()

with open(args.filename, 'r') as f:
    content = f.read()
    parsed = ast.parse(content)
    with open(args.filename + args.ext, 'w') as o:
        o.write(ast.dump(parsed, indent=4))