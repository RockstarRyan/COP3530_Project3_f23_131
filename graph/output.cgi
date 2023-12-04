#!/usr/bin/python3

"""
Project:    COP 3530 Project #3
Developers: Jackson Kelly, Adam Benali, Ryan Gross
"""

import sys
sys.stderr = open("err.log",'w')

import graph
from main import *

print('Content-type: text/html \n\n')

def main():
    # Don't worry about these for now...
    router1 = "1.1.1.1"
    router2 = "2.2.2.2"
    if router1 == router2:
        print("{error:'"+"Router addresses cannot be the same!"+"'}")
        
    else:
        # Call graph algorithms
        main.main()
        resultsB = bellmanFordRun(router1,router2, "latency")
        resultsD = dijkstraRun(router1,router2, "latency")
        
        # Print algorithm results in JSON format (to be read by JS program)
        print("{bellmanFord:{count:'"+resultsB[0]+"', latency:'"+resultsB[1]+"'}, dijkstras:{count:'"+resultsD[0]+"', latency:'"+resultsD[1]+"','}")

if __name__ == '__main__':
    main()