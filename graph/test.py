from graph import graph

from algorithms import *
if __name__ == "__main__":
    network = graph()
    for i in range(10):
        network.generateIP()
    for i in network.ips:
        network.connect(i)
    network.traverse()
