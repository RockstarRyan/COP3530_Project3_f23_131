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
        connections = set()
        # makes sure connection hasn't already been made
        if self.graph.get(_sourceIP):
            for j in self.graph[_sourceIP]:
                connections.add(j)
        for i in range(numConnect):
            # picks destination, checks that it isn't source or existing connection
            dest = random.choice(tuple(self.ips))
            if dest != _sourceIP and dest not in connections:
                _speed = float(random.randint(200, 2000)) / 10
                _latency = float(random.randint(100, 400)) / 10
                _bandwidth = float(random.randint(30, 300)) / 10

                self.insert(_sourceIP, dest, _speed, _latency, _bandwidth)
                self.insert(dest, _sourceIP, _speed, _latency, _bandwidth)
                connections.add(dest)
