import graph
import algorithms

def main():
    # Don't worry about these for now...
    router1 = "1.1.1.1"
    router2 = "2.2.2.2"
    if router1 == router2:
        print("{error:'"+"Router addresses cannot be the same!"+"'}")
        
    else:
        # Call graph algorithms
        resultsB = algorithms.bellmanFord(router1,router2)
        resultsD = algorithms.dijkstras(router1,router2)
        
        # Print algorithm results in JSON format (to be read by JS program)
        print("{bellmanFord:{speed:'"+resultsB.speed+"', latency:'"+resultsB.latency+"', bandwidth:'"+resultsB.bandwidth+"'}, dijkstras:{speed:'"+resultsD.speed+"', latency:'"+resultsD.latency+"', bandwidth:'"+resultsD.bandwidth+"'}")

if __name__ == '__main__':
    main()