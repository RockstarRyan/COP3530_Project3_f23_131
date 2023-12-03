import sys

def dijkstra(graph, start):
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
                    hasEdge = True
                    table[vertex] = [i.speed, start]
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
            if table.get(minVert)[0] + dest.speed < table.get(dest.destinationIp)[0]:
                table.get(dest.destinationIp)[0] = table.get(minVert)[0] + dest.speed
                table.get(dest.destinationIp)[1] = minVert
    return table
