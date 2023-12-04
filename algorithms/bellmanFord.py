import sys
sys.path.append( '.' )
from algorithms.dijkstra import *

def Bellman_Ford(graph, sourceIp, parameter):
    table = dict()
    table[sourceIp] = [0, None]
    for vertex in graph:
        if vertex != sourceIp:
            table[vertex] = [sys.maxsize, ""]
    for i in range(len(graph)-1):
        for vertices in graph:
            for dest in graph.get(vertices):
                value = 0
                invert = False
                if parameter == "speed":
                    value = dest.speed
                    invert = True
                elif parameter == "latency":
                    value = dest.latency
                elif parameter == "bandwidth":
                    value = dest.bandwidth
                    invert = True
                if invert:
                    if convert(value) + convert(table.get(vertices)[0]) < convert(table.get(dest.destinationIp)[0]):
                        table.get(dest.destinationIp)[0] = table.get(vertices)[0] + value
                        table.get(dest.destinationIp)[1] = vertices
                else:
                    if value + table.get(vertices)[0] < table.get(dest.destinationIp)[0]:
                        table.get(dest.destinationIp)[0] = table.get(vertices)[0] + value
                        table.get(dest.destinationIp)[1] = vertices
    return table