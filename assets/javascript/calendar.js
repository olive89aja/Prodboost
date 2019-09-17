$(document).ready(function() {
  let eventsArray = [];
  let timeMin = "2019-07-01T10:00:00-07:00";
  let eventObject = {};
  let firebaseConfig = {
    apiKey: "AIzaSyCDY46Uu2NAop4mIfjz9qM8S7PEztGvkxA",
    authDomain: "prodboost-558af.firebaseapp.com",
    databaseURL: "https://prodboost-558af.firebaseio.com",
    projectId: "prodboost-558af",
    storageBucket: "",
    messagingSenderId: "393017213746",
    appId: "1:393017213746:web:c379d873839bc14d078d2b"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  // if (!localStorage.getItem("key")) {
  //   localStorage.setItem("key", Math.ceil(Math.random() * 9000));
  // } else {
  // }
  $.ajax(
    (query =
      "https://cors-anywhere.herokuapp.com/https://us-central1-prodboost-558af.cloudfunctions.net/authorize")
  ).then(function(response) {
    window.open(response);
  });

  //snapshot
  database.ref().on("value", function(childSnapshot) {
    const updatedToken = childSnapshot.val();
    const scope = "https://www.googleapis.com/auth/calendar.readonly";
    console.log(updatedToken);
    const apiKey = "AIzaSyCDY46Uu2NAop4mIfjz9qM8S7PEztGvkxA";
    const query = `https://cors-anywhere.herokuapp.com/https://www.googleapis.com/calendar/v3/users/me/calendarList?key=${apiKey}`;
    $.ajax({
      url: query,
      dataType: "json",
      type: "GET",
      headers: {
        Authorization: `Bearer ${updatedToken}`
      }
    }).then(function(response) {
      console.log(response);
      let calendarId = response.items[0].id;
      $.ajax({
        url: `https://cors-anywhere.herokuapp.com/https://www.googleapis.com/calendar/v3/users/me/calendarList/${calendarId}?key=${apiKey}`,
        dataType: "json",
        type: "GET",
        headers: {
          Authorization: `Bearer ${updatedToken}`
        }
      })
        .then(function(response) {
          console.log(response);
          $.ajax({
            url: `https://cors-anywhere.herokuapp.com/https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${timeMin}`,
            dataType: "json",
            type: "GET",
            headers: {
              Authorization: `Bearer ${updatedToken}`
            }
          }).then(function(response) {
            eventsArray = response.items;
            $("#calendar-section").html("");
            for (let event = 0; event < eventsArray.length; event++) {
              eventObject = {
                subject: eventsArray[event].summary,
                location: eventsArray[event].location,
                date: eventsArray[event].start.dateTime,
                link: eventsArray[event].htmlLink
              };
              console.log(eventObject.link);
              $("#calendar-section").append(
                `<a href = ${eventObject.link} target="_blank">${eventObject.subject}</a></br>`
              );
            }
          });
        })

        .catch(err => console.log(err));
    });
  });
});
// https://us-central1-prodboost-558af.cloudfunctions.net
// https://us-central1-prodboost-558af.cloudfunctions.net/token

// {"web":{"client_id":"458461954801-ak1cbs7opinlpvdais69h3h9o8tv3clv.apps.googleusercontent.com","project_id":"awesome-habitat-252822","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"2Cly-X5HHTI4L-JKN1X1u-O0"}}
