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
function makeProject (projectName) {
    const project = {
        name: projectName,
        tasks: [],
        addTask(taskName) {
            const task = {
                dependents: [],
                name: taskName,
                addDependent(child) {
                    this.dependents.push(child);
                }
            }
            this.tasks.push(task);
        },
        render() {

        }
    }
    projects.push(project);
}

$(document).ready(() => {
    $("#box").on("click", (event) => {
        drawRect();
    })
    $("#arrow").on("click", () => {
        arrowMode = true;
        fabric.Image.fromURL("arrow.png", (img) => {
            img.scaleToHeight(100);
            img.scaleToWidth(100);
            canvas.add(img);
        });
    });
    makeProject("blah");
    projects[0].addTask("woo");
    projects[0].addTask("wah");
    projects[0].tasks[0].addDependent(projects[0].tasks[1]);
    console.log(projects);
});
