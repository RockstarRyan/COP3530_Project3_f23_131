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
                factor = 1
                if parameter == "speed":
                    value = dest.speed
                    factor = -1
                elif parameter == "latency":
                    value = dest.latency
                elif parameter == "bandwidth":
                    value = dest.bandwidth
                    factor = -1 
                if pow(value, factor) + (table.get(vertices)[0] if table.get(vertices)[0] == 0 or table.get(vertices)[0] == 0.0 else pow(table.get(vertices)[0], factor)) < (table.get(dest.destinationIp)[0] if table.get(dest.destinationIp)[0] == sys.maxsize or table.get(dest.destinationIp)[0] == 0.0 else pow(table.get(dest.destinationIp)[0], factor)):
                    table.get(dest.destinationIp)[0] = table.get(vertices)[0] + value
                    table.get(dest.destinationIp)[1] = vertices
    return table