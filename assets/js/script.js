// sets the date at the top of the page
var today = moment();
$("#currentDay").text(today.format("dddd, MMMM Do"));

// tasks array to store in localStorage.
var tasks = {
    "9": [],
    "10": [],
    "11": [],
    "12": [],
    "13": [],
    "14": [],
    "15": [],
    "16": [],
    "17": []
};

var setTasks = function() {
    /* adds tasks to localStorage */
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var getTasks = function() {
    /* load the tasks from localStorage and create tasks in the desired row */

    var loadedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (loadedTasks) {
        tasks = loadedTasks

        // for each key/value pair in tasks, create a task
        $.each(tasks, function(hour, task) {
            var hourDiv = $("#" + hour);
            createTask(task, hourDiv);
        })
    }

    // make sure the past/current/future time is represented correctly
    auditTasks()
}

var createTask = function(taskText, hourDiv) {
    /* creates a task in the row that corresponds to the desired hour */

    var taskDiv = hourDiv.find(".task");
    var taskP = $("<p>")
        .addClass("description")
        .text(taskText)
    taskDiv.html(taskP);
}

var auditTasks = function() {
    /* updates the background of each row based on time of day */

    var currentHour = moment().hour();
    $(".task-info").each( function() {
        var elementHour = parseInt($(this).attr("id"));

        // handles the past, present, and future backgrounds
        if ( elementHour < currentHour ) {
            $(this).removeClass(["present", "future"]).addClass("past");
        }
        else if ( elementHour === currentHour ) {
            $(this).removeClass(["past", "future"]).addClass("present");
        }
        else {
            $(this).removeClass(["past", "present"]).addClass("future");
        }
    })
};

var replaceTextarea = function(textareaElement) {
    /* replaces the provided textarea element with a p element and persists the data in localStorage */

    // gets the necessary elements
    var taskInfo = textareaElement.closest(".task-info");
    var textArea = taskInfo.find("textarea");

    // gets the time and task
    var time = taskInfo.attr("id");
    var text = textArea.val().trim();

    // persists the data
    tasks[time] = [text];  // setting to a one item list since there's only one task for now
    setTasks();

    // replaces the textarea element with a p element
    createTask(text, taskInfo);
}

// tasks
$(".task").click(function() {

    // saves tasks if they've already been clicked
    $("textarea").each(function() {
        replaceTextarea($(this));
    })

    // convert to a textarea element if the time is current/in the future.
    var time = $(this).closest(".task-info").attr("id");
    if (parseInt(time) >= moment().hour()) {

        // creates a textInput element that includes the current task
        var text = $(this).text();
        var textInput = $("<textarea>")
            .addClass("form-control")
            .val(text);

        // add the textInput element to the parent div
        $(this).html(textInput);
        textInput.trigger("focus");
    }
})

// save button click handler
$(".saveBtn").click(function() {
    replaceTextarea($(this));
})

// updates task backgrounds on the hour
timeToHour = 3600000 - today.milliseconds();  // this checks how much time is left until the next hour
setTimeout(function() {
    setInterval(auditTasks, 3600000)
}, timeToHour);

// gets the tasks from localStorage on page load.
getTasks();