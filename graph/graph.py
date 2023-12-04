import random
class nodeInfo:
    def __init__(self, destinationIp : str, speed : float, latency : float, bandwidth : float):
        self.destinationIp = destinationIp
        self.speed = speed
        self.latency = latency
        self.bandwidth = bandwidth

class graph:
    def __init__(self):
        self.graph = dict()
        self.ips = set()
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
        if(sourceIp in self.graph):
            self.graph[sourceIp].append(linkInfo)
        else:
            self.graph[sourceIp] = [linkInfo]
    def traverse(self):
        for i in self.graph:
            index = self.graph[i]
            for j in index:
                print(i, end=": ")
                print(j.destinationIp, j.speed, j.latency, j.bandwidth)
    def saveToFile(self):
        file = open("graph/nodes.csv", "w")
        for i in self.graph:
            index = self.graph[i]
            for j in index:
                file.write(str(i) + "," + str(j.destinationIp) + "," + str(j.speed) + "," + str(j.latency) + "," + str(j.bandwidth) + "\n")
        file.close()
    def generateIP(self):
        ip = ""
        for i in range(4):
            num = random.randint(0, 255)
            ip += str(num)
            if i != 3:
                ip += "."
        self.ips.add(ip)
    def connect(self, _sourceIP : str):
        # randomly generates number of connections
        numConnect = random.randint(0, len(self.ips))
        
        for i in range(numConnect):
            # picks destination, checks that it isn't source or existing connection
            dest = random.choice(tuple(self.ips))
            # makes sure connection hasn't already been made
            if dest != _sourceIP and self.checkIsValid(_sourceIP, dest):
                _speed = float(random.randint(200, 5000)) / 10
                _latency = random.randint(10, 40) 
                _bandwidth = random.randint(50, 1000)
                self.insert(_sourceIP, dest, _speed, _latency, _bandwidth)
                self.insert(dest, _sourceIP, _speed, _latency, _bandwidth)
    # Checks if the edge is already in the graph
    def checkIsValid(self, sourceIp, destinationIp):
        if sourceIp in self.graph:
            for index in self.graph.get(sourceIp):
                if index.destinationIp == destinationIp:
                    return False
        if destinationIp in self.graph:
            for index in self.graph.get(destinationIp):
                if index.destinationIp == sourceIp:
                    return False
        return True
