def f(l):
    for i in 1, 2, 3, 4, 5:
        yield l, i


a, b = f("a"), f("b")
print((next(a)))
print((next(a)))
print((next(b)))
print((next(b)))
print((next(b)))
print((next(a)))
print((next(b)))
print((next(a)))
