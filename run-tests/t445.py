def square(x):
    return x ** 2


def test1(f, x):
    return f(x)


def test2(f, x, y):
    return f(x, y)


print(square(2), test1(square, 2))

print((lambda x: x + 5)(4), test1(lambda x: x + 5, 4))

print((lambda x, y: x - y)(5, 4), test2(lambda x, y: x - y, 5, 4))

print((lambda x, y: x[y] * 2)([0, 1, 2, 3, 4], 4), test2(lambda x, y: x[y] * 2, [0, 1, 2, 3, 4], 4))


def test3(f, g, x, y):
    return f(x), f(y), g(x, y), g(f(x), f(y)), f(g(x, y)), f(g(y, x))


def f(x):
    return x * 27


def g(x, y):
    return y + 12 * x


def h(x):
    return f(x)


def i(x, y):
    return g(x, y)


print((f(3), f(4), g(3, 4), g(f(3), f(4)), f(g(3, 4)), f(g(4, 3))))
print(test3(f, g, 3, 4))
print(test3(h, i, 3, 4))


def j(lst, num, func):
    return lst[func(lst, num)] * (lambda y: 10 * y)(num)


def k(x, y):
    return len(x) - y


def test4(f, x, y, z):
    return f(x, y, z)


print(j([1, 2, 3, 4, 5, 6], 2, k))
print(test4(j, [1, 2, 3, 4, 5, 6], 2, k))
