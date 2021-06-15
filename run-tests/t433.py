print("formatting with just %d argument" % 1)

print("%d %i %o %x %X %e %E %f %F" % (12, -12, -0o7, 0x4A, -0x4A, 2.3e10, 2.3e-10, 1.23, -1.23))

print("%g %G %g %G" % (0.00000123, 0.00000123, 1.4, -1.4))

print("%r is a repr and %s is a string" % ("this", "this"))

print("I can also use a %(structure)s to format." % {"structure": "dictionary"})
