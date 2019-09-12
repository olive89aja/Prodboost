$(document).ready(function() {
  //declare variables for time chart
  let totalDuration; //time units = days
  let idealHours; //per day
  let totalHours;
  let actualHours;
  let idealHoursArray = [];
  let actualHoursArray = [];
  let daysLeft;
  let adjustedRate;
  let burndown;
  let forecastBurndown;

  $("#model-data").on("click", function(event) {
    event.preventDefault();
    totalDuration = $("#total-duration")
      .val()
      .trim();
    console.log(totalDuration);
    idealHours = $("#ideal-hours")
      .val()
      .trim();
    //console.log(idealHours);
    totalHours = totalDuration * idealHours;
    for (let day = 0; day < 6; day++) {
      let diff = totalHours - day * idealHours;

      idealHoursArray.push(diff);
    }
    console.log(idealHoursArray);

    let ctxInitial = $("#initial-chart");
    var stackedLine = new Chart(ctxInitial, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Ideal",
            data: idealHoursArray
          }
        ],
        labels: [0, 1, 2, 3, 4, 5]
      },
      options: {
        scales: {
          yAxes: [
            {
              stacked: true
            }
          ]
        }
      }
    });
  });
  $("#progress-data").on("click", function(event) {
    event.preventDefault();
    $("#initial-chart").hide();
    actualHours = $("#day1-input")
      .val()
      .trim();
    totalHours = totalDuration * idealHours;
    console.log(totalDuration);
    console.log(idealHours);
    console.log(totalHours);
    daysLeft = 4;
    burndown = totalHours - actualHours;
    adjustedRate = burndown / daysLeft;
    //forecastBurndown = burndown - adjustedRate;
    actualHoursArray = [totalHours, 34, 25.5, 17, 8.5, 0];
    console.log(actualHoursArray);

    let ctxActual = $("#progress-chart");
    var stackedLine = new Chart(ctxActual, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Ideal",
            data: idealHoursArray
          },
          {
            label: "Actual",
            data: actualHoursArray
          }
        ],
        labels: [0, 1, 2, 3, 4, 5]
      },
      options: {
        scales: {
          yAxes: []
        }
      }
    });
  });
});
