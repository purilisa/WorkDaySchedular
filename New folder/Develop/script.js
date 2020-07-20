var event = "";
var saveButton = "";
var eventTextArea = "";
$(document).ready(function() {

    //on page load show current date and time
    function displayDateTime() {
        $("#currentDay").text("Today is: " + moment().format("dddd, MMMM Do YYYY"));
        $("#currentTime").text("Time is now: " + moment().format("h:mm:ss A"));
    }

    //update time every sec
    setInterval(displayDateTime, 1000);

    //create rows and format
    var rowContainer = $(".container");
    creatTimeBlockRows();

    function creatTimeBlockRows() {
        for (var i = 18; i < 24; i++) {
            var timeBlockRow = $("<div>");
            timeBlockRow.attr("class", "row time-block");
            rowContainer.append(timeBlockRow);
            var timeDisplay = $("<div>").attr("class", "col-md-2 col-lg-2 col-sm-2 hour");
            eventTextArea = $("<input>").attr({
                "class": "col-md-9 col-lg-9 col-sm-9 description textarea",
                type: "text",
                "data-eventId": [i]
            });

            saveButton = $("<button>").attr({
                type: "submit",
                "class": "col-md-1 col-lg-1 col-sm-1 saveBtn",
                "data-saveid": [i]
            });
            saveButton.text("+Save");

            //format and display hour area on schedular
            var amOrpm = "";
            if (i <= 12) {
                amOrpm = "AM";
            }
            if (i > 12) {
                amOrpm = "PM";
            }

            //future
            if (moment().format("HH") < i) {
                eventTextArea.addClass("future");
            }
            //past
            if (moment().format("HH") > i) {
                eventTextArea.addClass("past");
            }
            //present
            if (moment().format("HH") == i) {
                eventTextArea.addClass("present");
            }

            //to display time in non military
            var timeDisplayText = i;
            if (i > 12) {
                timeDisplayText = i - 12;
            } else timeDisplayText = i;
            timeDisplay.text(timeDisplayText + amOrpm); //Append Am/Pm to timeDisplay on schedule
            timeDisplay.css({
                fontSize: "15px",
                color: "yellow"
            });

            //adding elements to timebloc row
            timeBlockRow.append(timeDisplay, eventTextArea, saveButton);

            //save Event
            $(saveButton).on("click", function(event) {
                event.preventDefault();
                var getEventTextFromDescription = $("[data-eventid~=" + $(this).attr("data-saveid") + "]").val();
                var getEventTime = $(this).attr("data-saveid");

                var timeObj = {
                    eventData: getEventTextFromDescription,
                    eventTime: getEventTime
                }
                var a = localStorageGet();
                a.push(timeObj);
                localStorage.setItem("event", JSON.stringify(a));
            });

            //render Event from local storage
            renderDataFromLocalStorageToDescription();

        }
    }
});

function localStorageGet() {
    var localst = JSON.parse(localStorage.getItem("event"));

    //if local storage is null return an empty array otherwise return local storage array. this is done, so current local storage 
    //contents are not overwritten
    if (localst === null) {
        localst = [];
    }
    return localst;

}


function renderDataFromLocalStorageToDescription() {
    var dataFromStorage = localStorageGet();
    for (var i = 0; i < dataFromStorage.length; i++) {
        var descrip = dataFromStorage[i].eventData;
        var timeID = dataFromStorage[i].eventTime;
        if ($(saveButton).attr("data-saveid") === timeID) {

            eventTextArea.val(descrip);
        }

    }

}