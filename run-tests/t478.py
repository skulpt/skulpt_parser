from functools import reduce

# map
seq = list(range(8))
newseq = [x * x for x in seq]
print(newseq)

# reduce
rseq = list(range(16))
rnewseq = reduce(lambda x, y: x + y, rseq)
print(rnewseq)
rnewseq2 = reduce(lambda x, y: x + y, [], 8)
print(rnewseq2)

# filter
fseq = list(range(16))
fnewseq = [x for x in fseq if x % 2 == 0]
print(fnewseq)

# mapoverstring


def f(x):
    return ord(x)


print(list(map(f, "abcdef")))

# filter over string returns string
string = [c for c in "abc" if c != "a"]
print(type(string))
print(string)

# filter over tuple returns tuple
tup = [t for t in (1, 2, 3, 4, 5, 6, 7, 8, 9, 10) if t % 2 == 0]
print(type(tup))
print(tup)

# filter with default identity func
print([_f for _f in [0, 1, "", "hello", False, True] if _f])

# map with two iterables
b = list(range(8))
c = list(range(10))


def mapy(x, y):
    if x is None:
        x = 0
    if y is None:
        y = 0
    return x + y


print(list(map(mapy, b, c)))

# map with default identity func
print(list([0, 1, {}, "", "hello", False, True]))
