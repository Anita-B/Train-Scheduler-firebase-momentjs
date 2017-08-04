// 1. Initialize Firebase

var config = {
    apiKey: "AIzaSyBhLEAuer8PYqODJjzTmiaSzITzfbfTVuM",
    authDomain: "awesome-project-1-f8c7c.firebaseapp.com",
    databaseURL: "https://awesome-project-1-f8c7c.firebaseio.com",
    projectId: "awesome-project-1-f8c7c",
    storageBucket: "awesome-project-1-f8c7c.appspot.com",
    messagingSenderId: "712547808331"
};

firebase.initializeApp(config);


// 2. Create a variable to reference the database
var database = firebase.database();

// 3. submit button for adding a train schedule to the database
$("#add-train-btn").on("click", function(event){

	// 3a. prevent page from reloading when clicking on submit button
	event.preventDefault();

	// 3b. get user input
	// val() method returns or sets the value attribute of the selected elements
	var train_name = $("#train-name-input").val().trim();
	var train_destination = $("#destination-input").val().trim();
	var first_train_time = $("#first-train-time-input").val().trim();
	var train_frequency = $("#frequency-input").val().trim();

	// 3c. Create a local "temporary" object for holding employee data
  	var newTrainSchedule = {

		name: train_name,
		destination: train_destination,
		time: first_train_time,
		frequency: train_frequency

 	};

 	// 3d. Upload train data to the database
 	// ref() represents a specific location in your database and can be used for reading/writing 
 	// data to that Database location. () are empty so it's going to main root
 	database.ref().push(newTrainSchedule);

 	// 3e. clear all of the text boxes after submit
 	$("#train-name-input").val("");
 	$("#destination-input").val("");
 	$("#first-train-time-input").val("");
 	$("#frequency-input").val("");

});

// 4. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
// on("value",... tracks any value change
// on("child_added",... tracks any child that was added during program run and when the page first loads
// prevChildKey gives access to the previous child in case you need to compare current and previous child
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  //firebase gives a snapshot of the child, which allows val to return values from it
  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().time;
  var trainFrequency = childSnapshot.val().frequency;


  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTrainTimeConverted = moment(trainTime, "hh:mm").subtract(1, "years");
  console.log("firstTrainTimeConverted", firstTrainTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % trainFrequency;
  console.log("tRemainder", tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = trainFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Prettify the employee start
  //var empStartPretty = moment.unix(empStart).format("MM/DD/YY");

  // Calculate the months worked using hardcore math
  // To calculate the months worked
  //var empMonths = moment().diff(moment.unix(empStart, "X"), "months");
  //var empMonths = moment().diff(moment.unix(empStart), "months");

  //console.log(empMonths);

  // Calculate the total billed rate
  //var empBilled = empMonths * empRate;
 // console.log(empBilled);

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  trainFrequency + "</td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});


