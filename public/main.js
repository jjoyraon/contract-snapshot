var socket = io.connect('http://localhost:3000');

socket.on('contracts', function (data) {
    console.log(data);
    const nodes = initNode();
    const edges = makeEdgeDataFromJson(data);
    drawDashboard(nodes, edges);
});
// const data = [
//   {'from' : 'i', 'to': 'c', 'result': 'fail'},
//   {'from' : 'i', 'to': 's', 'result': 'pass'},
//   {'from' : 'c', 'to': 'i', 'result': 'fail'},
//   {'from' : 't', 'to': 'h', 'result': 'pass'}
// ]
// const nodes = initNode();
// const edges = makeEdgeDataFromJson(data);
// drawDashboard(nodes, edges);


const initNode = () => {
  return [
      { data: { id: 'i', name: 'IronMan', weight: 200, faveColor: '#AF76FC', faveShape: 'ellipse', faveImage: '/images/ironman.png' } },
      { data: { id: 'c', name: 'Cpt.America', weight: 200, faveColor: '#6FB1FC', faveShape: 'ellipse', faveImage: '/images/captain-america.png' } },
      { data: { id: 's', name: 'SpiderMan', weight: 200, faveColor: '#EDA1ED', faveShape: 'triangle', faveImage: '/images/spider-man.png' } },
      { data: { id: 'h', name: 'Hulk', weight: 200, faveColor: '#b5d84a', faveShape: 'rectangle    ', faveImage: '/images/hulk.png' } },
      { data: { id: 't', name: 'Groot', weight: 200, faveColor: '#F5A45D', faveShape: 'rectangle', faveImage: '/images/groot.png' } }
  ];
}

const makeEdgeDataFromJson = (json) => {
    let edges = [];
    for (const data of json) {
        edges.push({
            data: {
                source: data.from.toString().charAt(0),
                target: data.to.toString().charAt(0),
                faveColor: getColor(data.result.toString())
            }
        });
    }
    return edges;
};

const getColor = (result) => {
    switch (result) {
        case 'pass':
            return 'green';
        case 'fail':
            return 'red';
        case 'none':
            return 'lightgrey';
    }
}

const drawDashboard = (nodes, edges) => {
    cytoscape({
        container: document.getElementById('cy'),

        layout: {
            name: 'circle',
            padding: 10
        },

        style: cytoscape.stylesheet()
            .selector('node')
            .css({
                'width': '200px',
                'height': '200px',
                'shape': 'data(faveShape)',
                'content': 'data(name)',
                'text-valign': 'bottom',
                'text-margin-y': '-30px',
                'font-size': '70px',
                'font-weight': 'bold',
                'text-outline-width': 10,
                'text-outline-color': 'data(faveColor)',
                'color': '#fff',
                'background-color': '#fff',
                'background-image': 'data(faveImage)',
                'background-image-opacity': 0.9,
                'background-fit': 'cover'
            })
            .selector(':selected')
            .css({
                'border-width': 3,
                'border-color': '#333'
            })
            .selector('edge')
            .css({
                'curve-style': 'bezier',
                'opacity': 0.666,
                'width': '15px',
                'target-arrow-shape': 'triangle',
                'source-arrow-shape': 'circle',
                'line-color': 'data(faveColor)',
                'source-arrow-color': 'data(faveColor)',
                'target-arrow-color': 'data(faveColor)'
            })
            .selector('edge.questionable')
            .css({
                'line-style': 'dotted',
                'line-color': 'red'
            })
            .selector('.faded')
            .css({
                'opacity': 0.25,
                'text-opacity': 0
            }),

        elements: {
            nodes: nodes,
            edges: edges
        }
    });
}
