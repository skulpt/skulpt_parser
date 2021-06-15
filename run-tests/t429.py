def helper(x, y, expect):
    l = [0] * 6
    if expect < 0:  # x < y
        l[0] = x < y
        l[1] = x <= y
        l[2] = (x > y) == False
        l[3] = (x >= y) == False
        l[4] = (x == y) == False
        l[5] = x != y
        if isinstance(x, (int, float, str)) or isinstance(y, (int, float, str)):
            l.append((x is y) == False)
            l.append((x is not y))
    elif expect == 0:  # x == y
        l[0] = (x < y) == False
        l[1] = x <= y
        l[2] = (x > y) == False
        l[3] = x >= y
        l[4] = x == y
        l[5] = (x != y) == False
        if isinstance(x, (int, float, str)) or isinstance(y, (int, float, str)):
            l.append((x is y))
            l.append((x is not y) == False)
    elif expect > 0:  # x > y
        l[0] = (x < y) == False
        l[1] = (x <= y) == False
        l[2] = x > y
        l[3] = x >= y
        l[4] = (x == y) == False
        l[5] = x != y
        if isinstance(x, (int, float, str)) or isinstance(y, (int, float, str)):
            l.append((x is y) == False)
            l.append((x is not y))
    if not isinstance(x, (int, float, str)) and not isinstance(y, (int, float, str)):
        l.append((x is y) == False)
        l.append((x is not y))
    if all(l):
        print(True)
    else:
        print(False, x, y, l)


print("\nINTEGERS")
helper(1, 2, -1)
helper(1, 1, 0)
helper(2, 1, 1)
helper(-2, -1, -1)
helper(-2, -2, 0)
helper(-1, -2, 1)
helper(-1, 1, -1)
helper(1, -1, 1)

print("\nLONG INTEGERS")
helper(1, 2, -1)
helper(2, 1, 1)
helper(-1, 1, -1)
helper(1, -1, 1)

print("\nFLOATING POINT")
helper(1.0, 2.0, -1)
helper(1.0, 1.0, 0)
helper(2.0, 1.0, 1)
helper(-2.0, -1.0, -1)
helper(-2.0, -2.0, 0)
helper(-1.0, -2.0, 1)
helper(-1.0, 1.0, -1)
helper(1.0, -1.0, 1)

print("\nLISTS")
helper([], [1], -1)
helper([1, 2], [1, 2], 0)
helper([1, 2, 3], [1, 2], 1)
helper([1, 2], [2, 1], -1)
helper([1, 2, 3], [1, 2, 1, 5], 1)

print("\nTUPLES")
helper(tuple(), (1,), -1)
# helper((1,2),(1,2),0)
helper((1, 2, 3), (1, 2), 1)
helper((1, 2), (2, 1), -1)
helper((1, 2, 3), (1, 2, 1, 5), 1)

print("\nSTRINGS")
helper("", "a", -1)
helper("a", "a", 0)
helper("ab", "a", 1)
helper("ABCD", "abcd", -1)
helper("ABCD", "ABCD", 0)
helper("aBCD", "Abcd", 1)
