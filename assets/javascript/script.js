var canvas = new fabric.Canvas('c');
canvas.setBackgroundColor("white",canvas.renderAll.bind(canvas));

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

//Constructor for project objects. Projects are modeled as directed graphs of task objects.
//This is done by instantiating a map, in which keys are tasks and values are arrays of adjacent tasks.
function Project (name) {
    this.name = name;
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
    //Renders a representation of the graph to the canvas
    this.render = function() {
        
    }
}

function Task (name, description, timeExpected) {
    this.name = name;
    this.description = description;
    this.timeExpected = timeExpected;
    this.timesLogged = [];
    this.logTime = function(time) {
        this.timesLogged.push(time);
    }
}

$(document).ready(() => {
    const project = new Project("1");
    $("#box").on("click", () => {
        $("#taskInput").removeClass("hidden");
    });
    $("#taskSubmit").on("click", (event) => {
        event.preventDefault();
        const task = new Task($("#taskName").val(), $("#description").val(), $("#timeExpected").val());
        project.addVertex(task);
        $("#taskName").val("");
        $("#description").val("");
        $("#timeExpected").val("")
        $("#taskInput").addClass("hidden");
    })
    $("#arrow").on("click", () => {
        $("#firstTaskHolder").empty();
        $("#secondTaskHolder").empty();
        for(const [key, value] of project.AdjList) {
            const option = $("<option>");
            option.val(key.name);
            option.text(key.name);
            $("#firstTaskHolder").append(option);
        }
        for(const [key, value] of project.AdjList) {
            const option = $("<option>");
            option.val(key.name);
            option.text(key.name);
            $("#secondTaskHolder").append(option);
        }
        $("#flowInput").removeClass("hidden");
    });

    $("#flowSubmit").on("click", (event) => {
        event.preventDefault();
        let first;
        let second;
        for(const [key,value] of project.AdjList) {
            if($("#firstTaskHolder").children().filter(":selected").val() === key.name) {
                first = key;
            }
            if($("#secondTaskHolder").children().filter(":selected").val() === key.name) {
                second = key;
            }
        }
        project.addEdge(first,second);
        $("#flowInput").addClass("hidden");
    })
});
