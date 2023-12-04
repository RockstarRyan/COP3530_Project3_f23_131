from graph import graph
import sys
sys.path.append( '.' )
from algorithms.bellmanFord import *

from algorithms import *
if __name__ == "__main__":
    network = graph()
    for i in range(6):
        network.generateIP()
    for i in network.ips:
        network.connect(i)
    network.traverse()
    network.saveToFile()
    for x in network.ips:
        table = Bellman_Ford(network.graph, x, "speed")
        break
    for values in table:
        print(values, table.get(values)[0], table.get(values)[1])
