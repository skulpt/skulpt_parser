print("\nintegers")
print(hash(int()) == hash(int()))
print(hash(332) == hash(332))
print(hash(-47) == hash(-47))

print("\nlong integers")
big = 123456789123456789123456789123456789123456789
print(hash(int()) == hash(int()))
print(hash(12) == hash(12))
print(hash(big) == hash(big))
print(hash(-big) == hash(-big))

print("\nfloating points")
print(hash(float()) == hash(float()))
print(hash(33.2) == hash(33.2))
print(hash(0.05) == hash(0.05))
print(hash(-11.85) == hash(-11.85))

print("\nstrings")
print(hash("") == hash(""))
print(hash("hello") == hash("hello"))

print("\ntuples")
print(hash(()) == hash(()))
print(
    hash((1, 2, 3))
    == hash(
        (
            1,
            2,
            3,
        )
    )
)

print("\nintegers and floating point")
print(hash(1) == hash(1.0))
print(hash(1) == hash(1))
print(hash(1.0) == hash(1))
print(hash(1) == hash(1) == hash(1.0))
print(hash(-5) == hash(-5) == hash(-5.0))

d = {1: 2, 3: 4, -5.0: 6}
print(d[1] == d[1.0] == d[1])
print(d[-5] == d[-5.0] == d[-5])
