var canvas = new fabric.Canvas('c');
canvas.setBackgroundColor("white",canvas.renderAll.bind(canvas));

//TODO: head of arrow is currently a circle. I couldn't figure out how to get a triangle in the correct orientation.
function makeArrow(coords) {
    const line = new fabric.Line(coords, {
      fill: 'black',
      stroke: 'black',
      strokeWidth: 5,
    });
    const circle = new fabric.Circle({
        fill: "black",
        radius: 10,
        left: coords[2]-10,
        top: coords[3]-10,
    })
    const group = new fabric.Group([line,circle]);
    canvas.add(group);
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
                adjacencies += edge.name;
            }
            console.log(vertex.name+` -> ${adjacencies}`);
        }
    }

    //Called upon clicking a task object in rectangle. Opens a popup to show description of task.
    this.showDescription = function(keyName) {
        for(const task of this.AdjList.keys()) {
            if(task.name === keyName) {
                console.log(task.description);
            }
        }  
    }
    //Uses fabric to render a representation of the graph to the canvas
    this.render = function() {
        canvas.clear();
        let index = 0;
        const keyIndices = [];
        const theta = 2*Math.PI/this.AdjList.size;
        for(const task of this.AdjList.keys()){           
            const rect = new fabric.Rect({
                fill: 'green',
                width: 100,
                height: 60,
                originX: "center",
                originY: "center"
            });
            const text = new fabric.Text(task.name, {
                originX: "center",
                originY: "center"
            });
            const group = new fabric.Group([rect,text], {
                left: 350-200*Math.sin(theta*index),
                top: 270-200*Math.cos(theta*index)
            });
            group.on("mousedown", (options) => {
                this.showDescription(options.target._objects[1].text);
            });
            canvas.add(group);
            keyIndices.push(task);
            index++;
        }
        index = 0;
        for(const [key,value] of this.AdjList){
            for(i = 0; i < value.length; i++) {
                makeArrow([400-160*Math.sin(theta*index),300-160*Math.cos(theta*index),
                    400-160*Math.sin(theta*keyIndices.indexOf(value[i])), 300-160*Math.cos(theta*keyIndices.indexOf(value[i]))]);
            }
            index++
        }
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
        project.printGraph();
        project.render();
        $("#taskInput").addClass("hidden");
    })

    //Allows the user to create a flow between tasks. Populates the "select" html elements with all available tasks
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
        if(first && second) {
            project.addEdge(first,second);
        }
        project.printGraph();
        project.render();
        $("#flowInput").addClass("hidden");
    })
});
