$(document).ready(function() {
  //declare variables for time chart
  let totalDuration; //time units = days
  let idealHours; //per day
  let totalHours;
  let actualHours;
  let idealHoursArray = [];
  let actualHoursArray = [];
  let adjustedRate;
  let burndown;
  let forecastBurndown;
  let daySubmitted;
  let goalDate;
  let currentDay;
  let today;
  let daysLeft;

  $("#model-data").on("click", function(event) {
    event.preventDefault();
    totalDuration = $("#total-duration")
      .val()
      .trim();
    totalDuration = parseInt(totalDuration);
    console.log(typeof totalDuration);
    idealHours = $("#ideal-hours")
      .val()
      .trim();
    daySubmitted = $("#day-submitted")
      .val()
      .trim();
    daySumbitted = moment(daySubmitted, "MM-DD-YYYY");
    console.log(daySubmitted);
    //console.log(idealHours);
    //goalDate = daySubmitted.add(totalDuration, "days");
    totalHours = totalDuration * idealHours;
    // today = moment().format("MM-DD-YYYY");
    // currentDay = today.diff(daySubmitted, "days");
    // daysLeft = goalDate.diff(today, "days");
    // console.log(daySubmitted);
    // console.log(goalDate);
    // console.log(today);
    // console.log(currentDay);
    // console.log(daysLeft);
    for (let day = 0; day < totalDuration.length + 1; day++) {
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
    $("#function").text(`y = ${totalHours} - ${idealHours}x`);
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
    //daysLeft = 4;
    burndown = totalHours - actualHours;
    adjustedRate = burndown / daysLeft;
    //forecastBurndown = burndown - adjustedRate;
    actualHoursArray = [totalHours, 34, 25.5, 17, 8.5, 0];
    $("#function").text(`y = ${totalHours} - ${adjustedRate}x (adjusted rate)`);
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
            label: "Forecast",
            data: [, 34, 30, 20, 5, 0],
            borderDash: [5, 15]
          },
          {
            label: "Actual",
            data: [40, 34]
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
