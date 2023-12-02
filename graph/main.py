from graph import graph
if __name__ == "__main__":
    network = graph()
    nodesFile = open("graph/nodes.txt", 'r')
    for line in nodesFile:
        currentLine = line.split(" ")
        source = currentLine[0]
        destination = currentLine[1]
        speed = float(currentLine[2])
        latency = float(currentLine[3])
        bandwidth = float(currentLine[4].replace("\n",""))
        network.insert(source, destination, speed, latency, bandwidth)
    network.traverse()