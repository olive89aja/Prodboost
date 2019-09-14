var canvas = new fabric.Canvas('c');
canvas.setBackgroundColor("white",canvas.renderAll.bind(canvas));

//Had to do some math for this one
function makeArrow(coords) {
    const line = new fabric.Line(coords, {
      fill: 'black',
      stroke: 'black',
      strokeWidth: 5,
    });
    //The following draws the head of the arrow in the appropriate position and orientation
    const x1=coords[0];
    const y1=coords[1];
    const x2=coords[2];
    const y2=coords[3];
    const x3=(x1-x2)/10;
    const y3 = (y1-y2)/10;
    const x4 = x3*Math.cos(Math.PI/4)-y3*Math.sin(Math.PI/4);
    const y4= x3*Math.sin(Math.PI/4)+y3*Math.cos(Math.PI/4);
    const x5 = x3*Math.cos(7*Math.PI/4)-y3*Math.sin(7*Math.PI/4);
    const y5= x3*Math.sin(7*Math.PI/4)+y3*Math.cos(7*Math.PI/4);
    const line2 = new fabric.Line([x2,y2,x4+x2,y4+y2],{
        fill: "black",
        stroke:"black",
        strokeWidth: 5,
    });
    const line3 = new fabric.Line([x2,y2,x5+x2,y5+y2],{
        fill: "black",
        stroke:"black",
        strokeWidth: 5,
    });
    const group = new fabric.Group([line,line2,line3]);
    canvas.add(group);
  }

//Constructor for project objects. Projects are modeled as directed graphs of task objects.
//This is done by instantiating a map, in which keys are tasks and values are arrays of adjacent tasks.
function Project () {
    this.name = "Untitled";
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

    this.findActiveTasks = function() {
        const visited = [];
        const uncompleted = new Map;
        for(const [key,values] of this.AdjList) {
            if(!key.completed) {
                uncompleted.set(key,values);
            }
        }
        for(const [key,values] of uncompleted) {
            for(const value of values) {
                if(!visited.includes(value)) {
                    visited.push(value);
                }
            }
        }
        const unvisited = [];
        for(const [key,values] of uncompleted) {
            if(!visited.includes(key)) {
                unvisited.push(key);
            }
        }
        return unvisited;
    }

    //Uses fabric to render a representation of the graph to the canvas
    this.render = function() {
        canvas.clear();
        let index = 0;
        const keyIndices = [];
        const theta = 2*Math.PI/this.AdjList.size;
        if($("#projectsList").children().filter("[data = "+projectList.indexOf(this)+"]").length === 0) {
            const button = $("<button class = projectButton id ="+this.name+">");
            button.val("selected")
            button.attr("data",projectList.indexOf(this));
            button.text(this.name);
            $("#projectsList").append(button);
        }
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
        $("#active-tasks").empty();
        for(const task of this.findActiveTasks()) {
            const taskHolder = $("<li class=list-group-item>");
            taskHolder.text(task.name);
            const genBurndown = $("<button class = burndownBtn>");
            genBurndown.attr("data",task.name)
            genBurndown.text("Show burndown");
            taskHolder.append(genBurndown);
            $("#active-tasks").append(taskHolder);
        }
    }
}

function Task (name, description, timeExpected, deadline) {
    this.name = name;
    this.description = description;
    this.timeExpected = timeExpected;
    this.deadline = deadline;
    this.completed = false;
    this.logTime = function(time) {
        this.timesLogged.push(time);
    }
    this.markComplete = function() {
        console.log("done");
        this.completed = true;
    }
    this.generateBurndown = function() {
        
    }
}

function makeBurndown () {
    for(const task of projectList[currentProject].AdjList.keys()) {
        if(task.name === $(this).attr("data")) {
            task.generateBurndown();
        }
    }
}

function setProjectIndex () {
    currentProject = $(this).attr("data");
    for(const child of $(".projectButton")) {
        child.value = "unselected";
    }
    $(this).val("selected");
    projectList[currentProject].render();
}

const projectList = [];
let currentProject = 0;

$(document).ready(() => {
    for(i = 0; i < projectList.length; i++) {
        projectList[i].render();
    }
    $("#box").on("click", () => {
        $("#taskInput").removeClass("hidden");
    });
    $("#taskSubmit").on("click", (event) => {
        event.preventDefault();
        const task = new Task($("#taskName").val(), $("#description").val(), $("#timeExpected").val(), $("#deadline").val());
        projectList[currentProject].addVertex(task);
        $("#taskName").val("");
        $("#description").val("");
        $("#timeExpected").val("");
        $("#deadline").val("");
        projectList[currentProject].render();
        $("#taskInput").addClass("hidden");
    })

    //Allows the user to create a flow between tasks. Populates the "select" html elements with all available tasks
    $("#arrow").on("click", () => {
        $("#firstTaskHolder").empty();
        $("#secondTaskHolder").empty();
        for(const [key, value] of projectList[currentProject].AdjList) {
            const option = $("<option>");
            option.val(key.name);
            option.text(key.name);
            $("#firstTaskHolder").append(option);
        }
        for(const [key, value] of projectList[currentProject].AdjList) {
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
        for(const [key,value] of projectList[currentProject].AdjList) {
            if($("#firstTaskHolder").children().filter(":selected").val() === key.name) {
                first = key;
            }
            if($("#secondTaskHolder").children().filter(":selected").val() === key.name) {
                second = key;
            }
        }
        if(first && second) {
            projectList[currentProject].addEdge(first,second);
        }
        projectList[currentProject].render();
        $("#flowInput").addClass("hidden");
    })

    $(document).on("click",".burndownBtn",makeBurndown);
    $(document).on("click",".projectButton",setProjectIndex);
    $("#addProject").on("click", () => {
        const newProject = new Project;
        newProject.name=$("#rename").val();
        projectList.push(newProject);
        currentProject = projectList.length-1;
        for(const child of $(".projectButton")) {
            child.value = "unselected";
        }
        projectList[currentProject].render();
    });
    $("#submitRename").on("click", () => {
        if(projectList.length>0){
            projectList[currentProject].name = $("#rename").val();
            $(".projectButton")[currentProject].textContent = $("#rename").val();
            $("rename").val("");
        }      
    });
    $("#markComplete").on("click", () => {
        $("#completeList").empty();
        $("#submitComplete").removeClass("hidden");
        for(const task of projectList[currentProject].AdjList.keys()) {
            const option = $("<option>");
            option.text(task.name);
            option.val(task.name);
            $("#completeList").append(option);
        }
    });
    $("#completeSubmit").on("click",(event) => {
        event.preventDefault();
        for(const [key,value] of projectList[currentProject].AdjList) {
            if($("#completeList").children().filter(":selected").val() === key.name) {
                key.markComplete();
            }
        }
        projectList[currentProject].render();
        $("#submitComplete").addClass("hidden");
    })
});
