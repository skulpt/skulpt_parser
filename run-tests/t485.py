try:
    assert 1 > 10
except AssertionError:
    print("Caught AssertionError")
except BaseException:
    print("Did not catch AssertionError")

try:
    print(None.notAnAttribute)
except AttributeError:
    print("Caught AttributeError")
except BaseException:
    print("Did not catch AttributeError")

try:
    import notAModule
except ImportError:
    print("Caught ImportError")
except BaseException:
    print("Did not catch ImportError")

try:
    print([0, 1, 2, 3, 4][5])
except IndexError:
    print("Caught IndexError")
except BaseException:
    print("Did not catch IndexError")

try:
    print({1: 2, 3: 4}[5])
except KeyError:
    print("Caught KeyError")
except BaseException:
    print("Did not catch KeyError")

try:
    print(x)
except NameError:
    print("Caught NameError")
except BaseException:
    print("Did not catch NameError")

try:
    print(0.0000000000000000000000000000000000000000000000000000000000000001 ** -30)
except OverflowError:
    print("Caught OverflowError")
except BaseException:
    print("Did not catch OverflowError")

try:
    "10" / "1"
except TypeError:
    print("Caught TypeError")
except BaseException:
    print("Did not catch TypeError")

try:
    print("hello".index("S"))
except ValueError:
    print("Caught ValueError")
except BaseException:
    print("Did not catch ValueError")

try:
    print(1 / 0)
except ZeroDivisionError:
    print("Caught ZeroDivisionError")
except BaseException:
    print("Did not catch ZeroDivisionError")
