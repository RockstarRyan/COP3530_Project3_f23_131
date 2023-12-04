#!/usr/bin/python3

"""
Project:    COP 3530 Project #3
Developers: Jackson Kelly, Adam Benali, Ryan Gross
"""

import sys
sys.stderr = open("err.log",'w')

import graph
import algorithms

print('Content-type: text/html \n\n')

def main():
    # Don't worry about these for now...
    router1 = "1.1.1.1"
    router2 = "2.2.2.2"
    if router1 == router2:
        print("{error:'"+"Router addresses cannot be the same!"+"'}")
        
    else:
        # Call graph algorithms
        resultsB = algorithms.bellmanFord(router1,router2)
        resultsD = algorithms.dijkstras(router1,router2)
        
        # Print algorithm results in JSON format (to be read by JS program)
        print("{bellmanFord:{speed:'"+resultsB.speed+"', latency:'"+resultsB.latency+"', bandwidth:'"+resultsB.bandwidth+"'}, dijkstras:{speed:'"+resultsD.speed+"', latency:'"+resultsD.latency+"', bandwidth:'"+resultsD.bandwidth+"'}")

if __name__ == '__main__':
    main()