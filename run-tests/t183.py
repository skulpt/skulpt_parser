def yrange(n):
    for i in range(n):
        yield i


def creator():
    r = yrange(5)
    print(("creator", next(r)))
    return r


def caller():
    r = creator()
    for i in r:
        print(("caller", i))


caller()
