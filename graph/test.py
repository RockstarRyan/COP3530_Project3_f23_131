from graph import graph
if __name__ == "__main__":
    network = graph()
    for i in range(10):
        network.generateIP()
    for i in network.ips:
        network.connect(i)
    print()
    network.traverse()
