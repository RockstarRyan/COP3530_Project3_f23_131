import sys

def convert(parameter):
    if parameter == sys.maxsize or parameter == 0:
        return parameter
    else:
        return 1/parameter

def dijkstra(graph, start, parameter):
    table = dict()
    s = set()
    table[start] = [0, None]
    vs = set()
    vs.add(start)
    for vertex in graph:
        if vertex != start:
            vs.add(vertex)
            hasEdge = False
            for i in graph[start]:
                if i.destinationIp == vertex:
                    val = 0
                    if parameter == "speed":
                        val = i.speed
                    elif parameter == "latency":
                        val = i.latency
                    elif parameter == "bandwidth":
                        val = i.bandwidth
                    hasEdge = True
                    table[vertex] = [val, start]
            if not hasEdge:
                table[vertex] = [sys.maxsize, start]

    while vs:
        minVert = ""
        minVal = sys.maxsize
        for vertex in vs:
            if table.get(vertex)[0] < minVal:
                minVert = vertex
                minVal = table.get(vertex)[0]
        vs.remove(minVert)
        s.add(minVert)
        for dest in graph[minVert]:
            val = 0
            invert = False
            if parameter == "speed":
                val = dest.speed
                invert = True
            elif parameter == "latency":
                val = dest.latency
            elif parameter == "bandwidth":
                val = dest.bandwidth
                invert = True
            if invert:
                if convert(table.get(minVert)[0]) + convert(val) < convert(table.get(dest.destinationIp)[0]):
                    table.get(dest.destinationIp)[0] = table.get(minVert)[0] + val
                    table.get(dest.destinationIp)[1] = minVert
            else:
                if table.get(minVert)[0] + val < table.get(dest.destinationIp)[0]:
                    table.get(dest.destinationIp)[0] = table.get(minVert)[0] + val
                    table.get(dest.destinationIp)[1] = minVert
    return table
