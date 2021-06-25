print("\nINTEGERS")
# binary
print(0b0101 | 0b1010 == 0b1111)
print(0b0110 ^ 0b0101 == 0b0011)
print(0b1111 & 0b0001 == 0b0001)
print(0b0110 << 2 == 0b11000)
print(0b0110 >> 2 == 0b0001)
print(~0b0011 == -0b0100)
# octal
print(0o0505 | 0o1000 == 0o1505)
print(0o1200 ^ 0o1034 == 0o0234)
print(0o7740 & 0o7400 == 0o7400)
print(0o2763 << 2 == 0o13714)
print(0o2763 >> 2 == 0o574)
print(~0o1234 == -0o1235)
# hexadecimal
print(0x0FF0 | 0x0000 == 0x0FF0)
print(0x10F0 ^ 0x01F0 == 0x1100)
print(0x0FF0 & 0xF00F == 0x0000)
print(0x5A01 << 2 == 0x16804)
print(0x5A01 >> 2 == 0x1680)
print(~0x4A30 == -0x4A31)
# decimal
print(124 | 37 == 125)
print(3847 ^ 4958 == 7257)
print(745 & 348 == 72)
print(1834 << 2 == 7336)
print(1834 >> 2 == 458)
print(~2398 == -2399)

print("\nLONG INTEGERS")
# binary        # skulpt doesn't accept binary longs
# print 0b0101L | 0b1010L == 0b1111L
# print 0b0110L ^ 0b0101L == 0b0011L
# print 0b1111L & 0b0001L == 0b0001L
# print 0b0110L << 2L == 0b11000L
# print 0b0110L >> 2L == 0b0001L
# print ~0b0011L == -0b0100L #skulpt doesn't accept the ~ operator with longs
# octal
print(0o0505 | 0o1000 == 0o1505)
print(0o1200 ^ 0o1034 == 0o0234)
print(0o7740 & 0o7400 == 0o7400)
print(0o2763 << 2 == 0o13714)
print(0o2763 >> 2 == 0o574)
# print ~0O1234L == -0O1235L #skulpt doesn't accept the ~ operator with longs

# hexadecimal
print(0x0FF0 | 0x0000 == 0x0FF0)
print(0x10F0 ^ 0x01F0 == 0x1100)
print(0x0FF0 & 0xF00F == 0x0000)
print(0x5A01 << 2 == 0x16804)
print(0x5A01 >> 2 == 0x1680)
# print ~0x4a30L == -0x4a31L #skulpt doesn't accept the ~ operator with longs

# decimal
print(124 | 37 == 125)
print(3847 ^ 4958 == 7257)
print(745 & 348 == 72)
print(1834 << 2 == 7336)
print(1834 >> 2 == 458)
# print ~2398L == -2399L #skulpt doesn't accept the ~ operator with longs

print(
    int("123456789" * 10) & int("987654321" * 10)
    == 95579309557357885362290225874030292317027763371981185445626785720401260273886076820525585
)

# print type(int('123456789'*10) & int('987654321'*10))
