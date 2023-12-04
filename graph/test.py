from graph import graph
import sys
sys.path.append( '.' )
from main import *
from algorithms import *

if __name__ == "__main__":
    main()
    sourceIp = input("SourceIp: ")
    destinationIp = input("DestinationIp: ")
    parameter = "speed"
    print(dijkstraRun(sourceIp, destinationIp, parameter))
    print(bellmanFordRun(sourceIp, destinationIp, parameter))
