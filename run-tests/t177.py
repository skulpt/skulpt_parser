def f():
    yield 1
    yield 2


g = f()
print((next(g)))
print((next(g)))
for i in f():
    print(i)
