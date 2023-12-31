from graph import graph
import sys
sys.path.append( '.' )
from main import *
from algorithms import *

if __name__ == "__main__": 
    readToFile()
    sourceIp = input("SourceIp: ")
    destinationIp = input("DestinationIp: ")
    parameter = "latency"
    print(dijkstraRun(sourceIp, destinationIp, parameter))
    print(bellmanFordRun(sourceIp, destinationIp, parameter))
