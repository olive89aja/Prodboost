var canvas = new fabric.Canvas('c');
canvas.setBackgroundColor("white",canvas.renderAll.bind(canvas));
let arrowMode = false;

function drawRect () {
    var rect = new fabric.Rect({
        left: 10,
        top: 10,
        fill: 'green',
        width: 100,
        height: 60
    });
    canvas.add(rect);
}

const projects = [];
function Graph () {
    this.AdjList = new Map();
    this.addVertex = function (v) {
        this.AdjList.set(v,[]);
    }
    this.addEdge = function (v,w) {
        this.AdjList.get(v).push(w);
    }
    this.printGraph = function () {
        let get_vertices = this.AdjList.keys();
        for ( let vertex of get_vertices) {
            let values = this.AdjList.get(vertex);
            let adjacencies = "";
            for(let edge of values) {
                adjacencies += `${edge}`;
            }
            console.log(`${vertex} -> ${adjacencies}`);
        }
    }
}


$(document).ready(() => {
    $("#box").on("click", (event) => {
        drawRect();
    })
    $("#arrow").on("click", () => {
        arrowMode = true;
        fabric.Image.fromURL("assets/javascript/arrow.png", (img) => {
            img.scaleToHeight(100);
            img.scaleToWidth(100);
            canvas.add(img);
        });
    });
});
