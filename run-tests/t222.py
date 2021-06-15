def foo(x):
    yield len(x)
    yield len(x)


g = foo(list(range(5)))
print((next(g)))


def len(y):
    return 8


print((next(g)))
