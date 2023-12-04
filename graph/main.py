from graph import graph
import sys
sys.path.append( '.' )
from algorithms.bellmanFord import *
from algorithms.dijkstra import *

network = graph()

def generate():
    for i in range(2100):
        network.generateIP()
        print('Generating node '+str(i)+' of 2000...')
    
    j = 0
    for i in network.ips:
        network.connect(i)
        print('Connecting node '+str(j)+' of 2000...')
        j+=1
    network.saveToFile()
    print('Done.')
def readToFile():
    file = open("nodes.csv", "r")
    for row in file:
       info = row.split(",")
       network.insert(info[0], info[1], info[2], info[3], info[4][:-1])
def dijkstraRun(sourceIp, destinationIp, parameter):
    if sourceIp not in network.graph or destinationIp not in network.graph:
        return [0,0]
    table = dijkstra(network.graph, sourceIp, parameter)
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
    if sourceIp not in network.graph or destinationIp not in network.graph:
        return [0,0]
    table =  Bellman_Ford(network.graph, sourceIp, parameter)
    count = 1
    index = table.get(destinationIp)[1]
    totalParameter = 0
    while index != sourceIp:
        if table.get(index)[1] != None:
            totalParameter += table.get(index)[0]
            index = table.get(index)[1]
            count += 1
    return [count, totalParameter]

if __name__ == '__main__':
    generate()