class C:
    try:
        raise Exception("Oops")
    except BaseException:
        print("Caught")
