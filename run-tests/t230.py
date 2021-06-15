def f(n):
    for i in range(n):
        yield i
g = f(5)
print((next(g)))
print((next(g)))
print((next(g)))
print((next(g)))
