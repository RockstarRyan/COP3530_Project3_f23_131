from graph import graph
import sys
sys.path.append( '.' )
from algorithms.bellmanFord import *
from algorithms.dijkstra import *

network = graph()

def main():
    for i in range(10):
        network.generateIP()
    for i in network.ips:
        network.connect(i)
    network.saveToFile()

def dijkstraRun(sourceIp, destinationIp, parameter):
    table = dijkstra(network.graph, sourceIp, parameter)
    count = 1
    index = table.get(destinationIp)[1]
    while index != sourceIp:
        index = table.get(index)[1]
        count += 1
    return count

def bellmanFordRun(sourceIp, destinationIp, parameter):
    table =  Bellman_Ford(network.graph, sourceIp, parameter)
    count = 1
    index = table.get(destinationIp)[1]
    while index != sourceIp:
        index = table.get(index)[1]
        count += 1
    return count