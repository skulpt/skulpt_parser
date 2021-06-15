def foo(x):
    yield len(x)
    yield len(x)

g = foo(list(range(5)))
print((next(g)))
len = lambda y: 8
print((next(g)))
