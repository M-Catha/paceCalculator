/***NOTE***
/* All distances are converted to miles 
/* and times are converted to seconds
/***


/***************************************
/* GENERAL FUNCTIONS & GLOBAL VARIABLES
****************************************/

var secondsInMinutes = 60;
var minutesInHours = 60;
var secondsInHours = 3600;

// Convert input to numbers 
function formatUnit(unit) {
	
	var isInt = parseInt(unit);

	return isInt ? isInt : 0;
}

// Time formatting function (for time and pace)
function getTimeObject(time) {
	
	var hours = Math.floor(time / secondsInHours);
	var totalTime = ((time / secondsInHours) - hours) * secondsInHours;

	var minutes = 0;
	while (totalTime >= 60) {
		
		totalTime -= 60;
		minutes++;
	}

	var seconds = totalTime;

	var timeObj = {
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds
	}
	return timeObj;
}

/****************
/* TIME HANDLING
*****************/

// Handling time button clicks
$("#timeButton").on("click", function() {

	$(".errorMessage").hide("fast");
	var getDistance = distanceFunction();
	var getPaceTime = timeFunction("#paceHours", "#paceMinutes", "#paceSeconds");
	var getPaceUnit = paceFunction();

	if (getPaceTime === "") {
		error("noPace");
		abort();
	} else {

	// Get time based on distance and pace
	var totalTime = (getPaceTime / getPaceUnit) * getDistance;

	var time = getTimeObject(totalTime);

	$("#timeHours").val(time.hours);
	$("#timeMinutes").val(time.minutes);
	$("#timeSeconds").val(time.seconds.toFixed(0));
	}

});

// Used for time or pace
var timeFunction = function(hours, minutes, seconds) {
	
	var timeInHours = $(hours).val();
	var timeInMinutes = $(minutes).val();
	var timeInSeconds = $(seconds).val();

	var formatHours = formatUnit(timeInHours);
	var formatMinutes = formatUnit(timeInMinutes);
	var formatSeconds = formatUnit(timeInSeconds);

	if (timeInHours > 24 || timeInHours < 0) {
		error("hours");
		abort();
	} else if (timeInMinutes >= 60 || timeInMinutes < 0) {
		error("minutes");
		abort();
	} else if (timeInSeconds >= 60 || timeInSeconds < 0) {
		error("seconds");
		abort();
	} else if (formatHours === 0 && formatMinutes === 0 && formatSeconds === 0) {
		return "";
	} else {
		var time = convTimeToSeconds(formatHours, formatMinutes, formatSeconds);
		return time;
	}

};

// Convert total time to seconds
function convTimeToSeconds(hours, minutes, seconds) {

	var totalTime;

	totalTime = (hours * minutesInHours * secondsInMinutes) +
				(minutes * secondsInMinutes) +
				seconds;

	return totalTime;
};

/********************
/* DISTANCE HANDLING
*********************/

// Handling distance button clicks

$("#distanceButton").on("click", function() {

	$(".errorMessage").hide("fast");
	var getTime = timeFunction("#timeHours", "#timeMinutes", "#timeSeconds");
	var getPaceTime = timeFunction("#paceHours", "#paceMinutes", "#paceSeconds");

	var getPaceUnit = paceFunction();
	var pace = (getPaceUnit / getPaceTime);

	var distanceUnit = $("#distanceSelect").val();
	var getDistanceUnit = distanceToMiles(distanceUnit);
	var distance = (pace * getTime) / getDistanceUnit;

	if (getTime === "") {
		error("noTime");
		abort();
	} else if(getPaceTime === "") {
		error("noPace");
		abort();
	} else if (distanceUnit === "") {
		error("chooseDistanceUnit");
		abort();
	} else {
		$("#distance").val(distance.toFixed(2));
	}
});


// Returns distance amount
var distanceFunction = function(){

	var distance = $("#distance").val();
	var distanceUnit = $("#distanceSelect").val();
	var eventSelect = $("#eventSelect").val();

	if (distance === "" && distanceUnit !== "") {
		error("noDistance");
		abort();
	} else if (distance === "" && eventSelect === "") {
		error("chooseEvent");
		abort();
	} else if (distance === "" && distanceUnit !== "") {
		error("noDistance");
		abort();
	} else if (distance !== "" && eventSelect !== "") {
		error("chooseOneEvent");
		abort();
	} else if (distance !== "" && distanceUnit === "") {
		error("chooseDistanceUnit");
		abort();
	} 
	else {
		var formatDistance = formatUnit(distance)
		var distanceInMiles = 0;

		if (eventSelect !== "") {
			distanceInMiles = eventsToMiles(eventSelect)
			return distanceInMiles;
		} else {
			var customDistance = distanceToMiles(distanceUnit);
			distanceInMiles = distance * customDistance;
			return distanceInMiles;
		}
	}
};

// Convert custom distances to miles
function distanceToMiles(distance) {
	switch(distance) {
		case "miles":
			return 1.00;
		case "km":
			return 0.621371;
		case "m":
			return 0.00621371;
		case "yds":
			return 0.000568182;
		default:
			return "";
	}
};

// Convert event distances to miles
function eventsToMiles(distance) {
	switch(distance) {
		case "marathon":
			return 26.2188;
		case "halfMarathon":
			return 13.1094;
		case "5k":
			return 3.10686;
		case "8k":
			return 4.97097;
		case "10k":
			return 6.21371;
		case "15k":
			return 9.32057;
		case "20k":
			return 12.4274;
		case "25k":
			return 15.5343;
		case "50k":
			return 31.0686;
		case "100k":
			return 62.1371;
		case "5m":
			return 5.00;
		case "10m":
			return 10.00;
		case "15m":
			return 15.00;
		case "20m":
			return 20.00;
		case "50m":
			return 50.00;
		case "100m":
			return 100.00;
		default:
			return;
	}
};

/****************
/* PACE HANDLING
*****************/

// Handling pace button clicks
$("#paceButton").on("click", function() {

	$(".errorMessage").hide("fast");
	var getTime = timeFunction("#timeHours", "#timeMinutes", "#timeSeconds");
	var getDistance = distanceFunction();
	var getPaceUnit = paceFunction();

	if (getTime === "") {
		error("noTime");
		abort();
	} else {

	var pace = getDistance / getTime;
	var totalTime = getPaceUnit / pace;

	var time = getTimeObject(totalTime);

	$("#paceHours").val(time.hours);
	$("#paceMinutes").val(time.minutes);
	$("#paceSeconds").val(time.seconds.toFixed(0));
	}
});

// Return pace unit converted to miles
var paceFunction = function() {

	var paceSelect = $("#paceSelect").val();
	var formatPace = paceToMiles(paceSelect);
	return formatPace;
};

// Convert pace unit to miles
function paceToMiles(distance) {
	switch(distance) {
		case "mile":
			return 1.00;
		case "220":
			return 0.125;
		case "440":
			return 0.25;
		case "880":
			return 0.50;
		case "200":
			return 0.124274;
		case "400":
			return 0.248548;
		case "800":
			return 0.497097;
		case "1500":
			return 0.932057;
		default:
			return "";
	}
};

/*************************
/* ERROR HANDLER FUNCTION
**************************/
function error(code){
	
	var errorText = "";

	switch(code) {
		case "chooseEvent":
			errorText = "Please enter a custom distance or select an event!"
			break;
		case "chooseOneEvent":
			errorText = "Can only have ONE custom distance or event!";
			break;
		case "chooseDistanceUnit":
			errorText = "No distance unit selected!";
			break;
		case "noPace":
			errorText = "Please fill out pace parameters (hh:mm:ss)!";
			break;
		case "noTime":
			errorText = "Please fill out time parameters (hh:mm:ss)!";
			break;
		case "noDistance":
			errorText = "Please fill out a distance amount!";
			break;
		case "seconds":
			errorText = "Seconds must be < 60 and non-negative!";
			break;
		case "minutes":
			errorText = "Minutes must be < 60 and non-negative!";
			break;
		case "hours":
			errorText = "Hours must be < 25 and non-negative!";
			break;
		case "nonInt":
			errorText = "No special characters allowed!";
			break;
		default:
			break;
	}
	$(".errorText").text(errorText);
	$(".errorMessage").show("fast");
};

function abort() {
	throw new Error();
}

/****************
/* RESET FUNCTION
*****************/

$("#resetButton").on("click", function() {
	
	$("input").val("");
	$("#distanceSelect").val("");
	$("#eventSelect").val("");
});