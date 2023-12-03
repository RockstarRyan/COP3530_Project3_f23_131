import sys

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
                if parameter == "speed":
                    value = dest.speed
                elif parameter == "latency":
                    value = dest.latency
                elif parameter == "bandwidth":
                    value = dest.bandwidth
                if value + table.get(vertices)[0] < table.get(dest.destinationIp)[0]:
                    table.get(dest.destinationIp)[0] = table.get(vertices)[0] + value
                    table.get(dest.destinationIp)[1] = vertices
    return table
                
