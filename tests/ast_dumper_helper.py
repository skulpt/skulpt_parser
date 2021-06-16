import ast
import argparse

parser = argparse.ArgumentParser(description="Dump AST from file to file")

parser.add_argument("content", type=str, help="source to be parsed")
parser.add_argument("--indent", type=int, default=None, required=False, help="indent")
parser.add_argument("--attrs", type=int, default=0, required=False, help="show attrs")

args = parser.parse_args()

parsed = ast.parse(args.content)
indent = args.indent if args.indent != -1 else None
print(ast.dump(parsed, include_attributes=args.attrs, indent=indent))
