class nodeInfo:
    def __init__(self, destinationIp : str, speed : float, latency : float, bandwidth : float):
        self.destinationIp = destinationIp
        self.speed = speed
        self.latency = latency
        self.bandwidth = bandwidth

class graph:
    def __init__(self):
        self.graph = dict()
    def insert(self, sourceIp : str, destinationIp : str, speed : float, latency : float, bandwidth : float):
        try:
            sourceIp = str(sourceIp)
            destinationIp = str(destinationIp)
            speed = float(speed)
            latency = float(latency)
            bandwidth = float(bandwidth)
        except:
            raise TypeError("Error: invalid inputs")
        linkInfo = nodeInfo(destinationIp, speed, latency, bandwidth)
        if(self.graph.get(sourceIp)):
            self.graph[sourceIp].append(linkInfo)
        else:
            self.graph[sourceIp] = [linkInfo]
    def traverse(self):
        for i in self.graph:
            index = self.graph[i]
            print(i, end=": ")
            for j in index:
                print(j.destinationIp, j.speed, j.latency, j.bandwidth)