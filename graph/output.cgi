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
    # Get inputs
    file = open("input.csv", "r")
    for row in file:
        inputData = row.split(",")
        router1 = inputData[0]
        router2 = inputData[1]

    if router1 == router2:
        print("{error:'"+"Router addresses cannot be the same!"+"'}")
        
    else:
        # Call graph algorithms
        readToFile()
        resultsB = bellmanFordRun(router1,router2,inputData[2])
        resultsD = dijkstraRun(router1,router2,inputData[2])

        # Print algorithm results in JSON format (to be read by JS program)
        print("Bellman-Ford: {count:"+ str(resultsB[0]) +", "+inputData[2]+":"+ str(resultsB[1])+"}, Dijkstra's: {count:" + str(resultsD[0]) +", "+inputData[2]+":"+ str(resultsD[1]) +"}")

if __name__ == '__main__':
    main()