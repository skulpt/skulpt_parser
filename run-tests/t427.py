l = [1, 2, 3, 4]
t = (1, 2, 3, 4)
d = {1: 2, 3: 4}
s = "1234"

print(list(zip()))
print(list(zip(l)), list(zip(t)), list(zip(d)), list(zip(s)))

print(list(zip(l, t)), list(zip(l, d)), list(zip(l, s)))
print(list(zip(t, d)), list(zip(t, s)))
print(list(zip(d, s)))

print(list(zip(l, t, s)))
print(list(zip(l, t, s, d)))

z = list(zip(l, t, s))
print(list(zip(*z)))

z = list(zip(l, t, s, d))
print(list(zip(*z)))
