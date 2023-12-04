#!/usr/bin/python3

"""
Project:    COP 3530 Project #3
Developers: Jackson Kelly, Adam Benali, Ryan Gross
"""

import sys
sys.stderr = open("err.log",'w')

print('Content-type: text/html \n\n')

def main():
    print("Testing..1..2..3!")
    print(sys.argv)

if __name__ == '__main__':
    main()