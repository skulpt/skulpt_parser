from fucntools import cmp_to_key

a = sorted([2, 1, -4, 3, 0, 6])
print(a)
b = "rksdubtheynjmpwqzlfiovxgac"
print(sorted(b, key=lambda x: ord(x)))
c = [2, 1, -4, 3, 0, 6]
print(sorted(c))
print(sorted(c, key=cmp_to_key(lambda x, y: y - x)))


class Test:
    def __init__(self, id, value):
        self.id = id
        self.value = value

    def __repr__(self):
        return "id: " + str(self.id) + " value: " + self.value


d = [
    Test(4, "test"),
    Test(3, "test"),
    Test(6, "test"),
    Test(1, "test"),
    Test(2, "test"),
    Test(9, "test"),
    Test(0, "test"),
]
print(sorted(d, key=lambda x: x.id, reverse=True))

print(c)
print(sorted(c))

c.sort(reverse=True)
print(c)
c.sort()
print(c)
c.sort(key=lambda x: pow(x, 2), reverse=True)
print(c)

L = [7, 3, -2, 4]
d = {"a": 5, "b": 9}


def g(k):
    return d[k]


print((g("a")))
print((sorted(list(d.keys()), key=g)))

print((sorted(list(d.keys()))))

print((sorted(list(d.keys()), key=lambda x: d[x])))


def myabs(x):
    return abs(x)


print((sorted(L, key=myabs)))
print((sorted(L, key=lambda x: myabs(x))))

print((sorted(L, key=lambda x: abs(x))))

print((sorted(L, key=abs)))

print((sorted(L, key=lambda x: -x, reverse=True)))

print((sorted(L, key=lambda x: -x)))
