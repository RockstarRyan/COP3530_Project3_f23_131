from graph import graph
import sys
sys.path.append( '.' )
from algorithms.bellmanFord import *
from algorithms.dijkstra import *

network = graph()

def generate():
    for i in range(100000):
        network.generateIP()
        print('Generating node '+str(i)+' of 100000...')
    
    j = 0
    for i in network.ips:
        network.connect(i)
        print('Connecting node '+str(j)+' of 100000...')
        j+=1
    network.saveToFile()
    print('Done.')

def dijkstraRun(sourceIp, destinationIp, parameter):
    table = dijkstra(network.graph, sourceIp, parameter)
    print(table)
    count = 1
    index = table.get(destinationIp)[1]
    totalParamter = 0
    while index != sourceIp:
        if table.get(index)[1] != None:
            totalParamter += table.get(index)[0]
            index = table.get(index)[1]
            count += 1
    return [count, totalParamter]

def bellmanFordRun(sourceIp, destinationIp, parameter):
    table =  Bellman_Ford(network.graph, sourceIp, parameter)
    print(table)
    count = 1
    index = table.get(destinationIp)[1]
    totalParameter = 0
    while index != sourceIp:
        if table.get(index)[1] != None:
            totalParameter += table.get(index)[0]
            index = table.get(index)[1]
            count += 1
    return [count, totalParameter]

generate()