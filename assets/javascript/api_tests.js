$(document).ready(function() {
  //declare variables for time chart
  const totalDuration = 5; //time units = days
  const taskNumber = 4;
  const hoursAvailable = 40; //total
  const idealSlope = hoursAvailable / totalDuration; //time unit = hours
  let diff = hoursAvailable - idealSlope;
  let idealTime = [hoursAvailable];
  let sumDay = 0;
  for (let day = 0; day < totalDuration + 1; day++) {
    let columnId = `<th>Day ${day}</th>`;
    $("#column-labels").append(columnId);
  }

  for (let task = 0; task < taskNumber; task++) {
    let rowId = `<tr id = "row${task}">
    </tr>`;
    $("#dataTable").append(rowId);
    let taskRow = `<th>${task + 1}</th>`;
    $(`#row${task}`).append(taskRow);
    let taskInput = `<div class="form-group">
 <label for="daily-input">Task: ${task + 1}</label>
  <input
    type="number"
   class="form-control"
     id="hours-task${task + 1}"
    placeholder="# of hours"
    />
   </div>`;
    $("#daily-input").append(taskInput);
  }
  $("#daily-input").append(
    `<button id = model-button type="submit" class="btn btn-primary">Model</button>`
  );
  $("#model-button").on("click", function(event) {});
  let dayValues = [1, 2, 3, 4];
  for (let dayIndex = 0; dayIndex < totalDuration - 1; dayIndex++) {
    $(`#row${dayIndex}`).append(`<th>${dayValues[dayIndex]}</th>`);
    sumDay = sumDay + dayValues[dayIndex];
    console.log(sumDay);
  }

  $("#dataTable").append(
    `<tr id = "total-row"><th>Total</th></tr><tr id = "actual"><th>Actual Effort</th></tr><tr id = "remaining"><th>Effort Remaining</th></tr>`
  );
  console.log(sumDay);
  $(`#total-row`).append(`<th>${sumDay}</th>`);

  $("#actual").append(`<th>${hoursAvailable}</th>`);
  for (let actualIndex = 0; actualIndex < totalDuration; actualIndex++) {
    $("#actual").append(`<th>${diff}</th>`);
    idealTime.push(diff);
    diff = diff - idealSlope;
  }

  $("#remaining").append(`<th>${hoursAvailable}</th>`);
  $("#remaining").append(`<th>${hoursAvailable - sumDay}</th>`);

  let ctx = $("#myChart");
  let chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Ideal",
          data: idealTime
        },
        {
          label: "Actual",
          data: [40, 30, 22, 15, 7, 0]
        }
      ],
      labels: [0, 1, 2, 3, 4, 5]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              suggestedMin: 0,
              suggestedMax: hoursAvailable
            }
          }
        ]
      }
    }
  });
});

//input uder data into table per day
// $("#row0").append(`<th>1</th>`);
