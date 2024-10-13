class GraphVisualizer {
    constructor(graph, container) {
        this.graph = graph;

        // Bind callbacks to update UI
        this.graph.setAddVertexCallback(this.addVertex.bind(this));
        this.graph.setRemoveVertexCallback(this.removeVertex.bind(this));
        this.graph.setAddEdgeCallback(this.addEdge.bind(this));
        this.graph.setRemoveEdgeCallback(this.removeEdge.bind(this));

        this.nodes = new vis.DataSet(this.graph.getVertices().map(function(vertex) {
            return { id: vertex, label: vertex, x:0, y:0};
        }));

        this.edges = new vis.DataSet(this.graph.getEdgeList().map(function(edge) {
            let edgeId = fromVertex + "->" + toVertex;
            return { id: edgeId, from: edge[0], to: edge[1], arrows: 'to' };
        }));

        this.data = { nodes: this.nodes, edges: this.edges };

        // Create options
        let options = {
            interaction: {
                hover: true,
            },
            physics: {
                solver: 'forceAtlas2Based',
            }
        };

        // Create a network
        this.network = new vis.Network(container, this.data, options);
    }

    // Add an edge to the graph
    addEdge(fromVertex, toVertex) {
        let edgeId = fromVertex + "->" + toVertex;
        if (this.edges.get(edgeId) == null) {
            this.edges.add({ id: edgeId, from: fromVertex, to: toVertex, arrows: 'to' });
        }
    }

    // Remove an edge from the graph
    removeEdge(fromVertex, toVertex) {
        let edgeId = fromVertex + "->" + toVertex;
        this.edges.remove(edgeId);
    }

    addVertex(vertex) {
        let v = this.nodes.get(vertex);
        if (v == null) {
            this.nodes.add({ id: vertex, label: vertex, x:0, y:0 });
        }
    }

    // Remove a vertex from the graph
    removeVertex(vertex) {
        this.nodes.remove(vertex);
        this.edges.forEach(function(edge) {
            if (edge.from == vertex || edge.to == vertex) {
                this.edges.remove(edge.id);
            }
        }.bind(this));
    }

    async depthFirstSearch(startVertex, searchVertex, outputText) {
        this.resetColors();

        this.searchVertex = searchVertex;
        this.outputText = outputText;
        this.graph.depthFirstTraversal(startVertex, this.visit.bind(this));
    }

    async visit(vertex, previous, visited) {
        if (!visited) {
            console.log("Visiting vertex " + vertex);
            this.outputText.innerText += " " + vertex;
        }

        if (previous !== null) {
            this.nodes.update({
                id: previous,
                color: {
                    background: '#ffbbbb'
                },
                font: {
                    color: '#000000'
                }
            });
        }

        if (vertex !== null) {
            this.nodes.update({
                id: vertex,
                color: {
                    background: '#ff5555'
                },
                font: {
                    color: '#ffffff'
                }
            });
        }

        if (this.searchVertex != '' && vertex == this.searchVertex) {
            console.log("Found vertex " + vertex);
            return true;
        }

        // sleep for some time so UI can get updated in steps
        await new Promise(r => setTimeout(r, 500));

        return false;
    }

    selectVertex(vertex) {
        this.network.selectNodes([vertex]);
    }

    resetColors() {
        // reset color of all nodes
        for (let vertex of graph.getVertices()) {
            visualizer.nodes.update({
                id: vertex,
                color: {
                    background: '#97C2FC'
                },
                font: {
                    color: '#000000'
                }
            });
            if (visualizer.outputText) {
                visualizer.outputText.innerText = '';
            }
        }
    }
}