import unittest
import os

# refer: https://blog.csdn.net/weixin_40569991/article/details/81155145git
def allTests():
    suite = unittest.TestLoader().discover(
        start_dir=os.path.dirname(__file__),
        pattern='test_*.py',
        top_level_dir=None)
    return suite


def run():
    unittest.TextTestRunner(verbosity=2).run(allTests())  # test report


if __name__ == '__main__':
    run()
