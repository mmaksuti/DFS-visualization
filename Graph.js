// Graph implementation using adjacency list

class Graph {
    constructor() {
        this.adjList = new Map();
        this.addEdgeCallback = null;
        this.removeEdgeCallback = null;
        this.addVertexCallback = null;
        this.removeVertexCallback = null;
    }
  
    setAddEdgeCallback(callback) {
        this.addEdgeCallback = callback;
    }
    
    setRemoveEdgeCallback(callback) {
        this.removeEdgeCallback = callback;
    }
    
    setAddVertexCallback(callback) {
        this.addVertexCallback = callback;
    }
    
    setRemoveVertexCallback(callback) {
        this.removeVertexCallback = callback;
    }

    addVertex(vertex) {
        let v = this.adjList.get(vertex);
        if (v == null) {
            this.adjList.set(vertex, []);
            if (this.addVertexCallback) {
                this.addVertexCallback(vertex);
            }
        }
    }
  
    removeVertex(vertex) {
        this.adjList.delete(vertex);
        
        for (let [key, value] of this.adjList) {
            let index = value.indexOf(vertex);
            if (index !== -1) {
                value.splice(index, 1);
            }
        }

        if (this.removeVertexCallback) {
            this.removeVertexCallback(vertex);
        }
    }

    addEdge(fromVertex, toVertex) {
        if (!this.adjList.has(fromVertex)) {
            this.addVertex(fromVertex);
        }

        if (!this.adjList.has(toVertex)) {
            this.addVertex(toVertex);
        }

        let edges = this.adjList.get(fromVertex);
        let index = edges.indexOf(toVertex);
        if (index === -1) {
            edges.push(toVertex);

            if (this.addEdgeCallback) {
                this.addEdgeCallback(fromVertex, toVertex);
            }
        }
    }
  
    removeEdge(fromVertex, toVertex) {
        let edges = this.adjList.get(fromVertex);
        if (edges == null) return;

        let index = edges.indexOf(toVertex);
        if (index !== -1) {
            edges.splice(index, 1);

            if (this.removeEdgeCallback) {
                this.removeEdgeCallback(fromVertex, toVertex);
            }
        }
    }

    depthFirstTraversal(startingVertex, callback) {
        let visited = new Set();

        this._dfs(startingVertex, visited, null, callback);
    }

    /**
     * Arguments:
     * - vertex: vertex we're currently visiting
     * - visited: set of visited vertices
     * - previous: vertex we visited before the current one
     * - callback: function to call when we visit a vertex
     */
    async _dfs(vertex, visited, previous, callback) {
        // tell the caller we're visiting this vertex for the first time (visited = false)
        // callback can return true if a condition was met, e.g. we found the vertex we were looking for
        // if so stop the traversal
        if (await callback(vertex, previous, false)) {
            return true;
        }

        // mark the vertex as visited
        visited.add(vertex);

        let neighbors = this.adjList.get(vertex);
        let prev = vertex;
        for (let neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                // for every unvisited neighbor, call dfs recursively
                if (await this._dfs(neighbor, visited, prev, callback)) {
                    return true;
                }

                // after we traversed the neighbors, tell the caller we're back at the parent vertex
                // but this time visited = true
                await callback(vertex, neighbor, true);
            }
        }

        // after DFS is done, call the callback with null as the vertex being visited
        // this is done in case we didn't find the vertex we were looking for
        callback(null, vertex, true);
        return false;
    }

    getVertices() {
        return Array.from(this.adjList.keys());
    }

    getEdgeList() {
        let edges = [];

        for (let vertex of this.getVertices()) {
            let neighbors = this.adjList.get(vertex);

            for (let neighbor of neighbors) {
                edges.push([vertex, neighbor]);
            }
        }

        return edges;
    }
}