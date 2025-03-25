document.getElementById("toggleDarkMode").addEventListener("change", toggleDarkMode);

// Load Dark Mode preference on page load
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    document.getElementById("toggleDarkMode").checked = true;
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    // Save preference
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
}

// Stopwatch Logic
let stopwatches = [];
let currentEditingId = null;  // To track which stopwatch is being named/edited
document.addEventListener("DOMContentLoaded", function () {
    const addStopwatchBtn = document.getElementById("addStopwatch");

    if (addStopwatchBtn) {
        addStopwatchBtn.addEventListener("click", function () {
            openPopup(); // Open the popup to enter the task name
        });
    }
});
const charLimit = 20; // Set your desired character limit
function openPopup(id = null) {
    
    currentEditingId = id;

    if (id !== null && stopwatches[id]) {
        document.getElementById("taskInput").value = stopwatches[id].name;
    } else {
        document.getElementById("taskInput").value = "";
    }

    document.getElementById("error-message").innerText = "";
    document.getElementById("taskPopup").style.display = "block"; // Show popup
    document.getElementById("taskInput").addEventListener("input", enforceCharLimit);
   
    // Automatically focus on the input field
    document.getElementById("taskInput").focus();

     // Listen for "Enter" key press
     taskInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            saveTaskName();
        }
    });
}

function enforceCharLimit() {
    let inputField = document.getElementById("taskInput");
    
    if (inputField.value.length > charLimit) {
        inputField.value = inputField.value.substring(0, charLimit); // Trim extra characters
        document.getElementById("error-message").innerText = `Max ${charLimit} characters allowed!`;
    } else {
        document.getElementById("error-message").innerText = ""; // Clear error when valid
    }
}

function closePopup() {
    document.getElementById("taskPopup").style.display = "none"; // ✅ Hide popup
}


function saveTaskName() {
    let taskName = document.getElementById("taskInput").value.trim();
    
    if (taskName === "") {
        document.getElementById("error-message").innerText = "Task name cannot be empty!";
        return;
    }

    // Check for duplicate task names
    let isDuplicate = stopwatches.some((sw, index) => sw.name === taskName && index !== currentEditingId);
    if (isDuplicate) {
        document.getElementById("error-message").innerText = "Task name already exists. Choose a unique name.";
        return;
    }

    if (currentEditingId === null) {
        // Creating a new stopwatch
        addStopwatch(taskName);
    } else {
        // Updating an existing stopwatch
        document.getElementById(`taskname-${currentEditingId}`).innerText = taskName;
        stopwatches[currentEditingId].name = taskName;
    }

    closePopup();
}


function addStopwatch(taskName) {
    let stopwatchId = stopwatches.length;
    
    let stopwatchDiv = document.createElement("div");
    stopwatchDiv.classList.add("stopwatch");
    stopwatchDiv.setAttribute("id", "stopwatch-" + stopwatchId);
    
    stopwatchDiv.innerHTML = `
    <span class="edit-btn" onclick="openPopup(${stopwatchId})">✏️</span>
    <button class="delete-btn" onclick="deleteStopwatch(${stopwatchId})">❌</button>
    <div class="task-header">
        <h2 id="taskname-${stopwatchId}">${taskName}</h2>
    </div>
    <p id="display-${stopwatchId}" class="stopwatch-timer">00:00:00:00</p>
    <button class="start-btn" onclick="startStopwatch(${stopwatchId})">Start</button>
    <button class="pause-btn" onclick="pauseStopwatch(${stopwatchId})">Pause</button>
    <button class="reset-btn" onclick="resetStopwatch(${stopwatchId})">Reset</button>
    <button class="lap-btn" onclick="lapStopwatch(${stopwatchId})">Lap</button>
    <ul id="laps-${stopwatchId}"></ul>
`;

    document.getElementById("stopwatches").appendChild(stopwatchDiv);
    stopwatches.push({ name: taskName, time: 0, interval: null, laps: [] });
}


// Function to Delete Stopwatch
function deleteStopwatch(id) {
    let stopwatchElement = document.getElementById(`stopwatch-${id}`);
    if (stopwatchElement) {
        stopwatchElement.remove();
    }

    // Remove from the stopwatches array
    stopwatches = stopwatches.filter((_, index) => index !== id);
}


function startStopwatch(id) {
    if (!stopwatches[id].interval) {
        stopwatches[id].interval = setInterval(() => {
            stopwatches[id].time += 10; // Increment time in milliseconds
            updateDisplay(id);
        }, 10);
    }
}

function pauseStopwatch(id) {
    clearInterval(stopwatches[id].interval);
    stopwatches[id].interval = null;
}

function resetStopwatch(id) {
    clearInterval(stopwatches[id].interval);
    stopwatches[id].interval = null;
    stopwatches[id].time = 0;
    stopwatches[id].laps = [];
    updateDisplay(id);
    document.getElementById(`laps-${id}`).innerHTML = "";
}

function lapStopwatch(id) {
    let time = stopwatches[id].time;
    let hours = Math.floor(time / 3600000);
    let minutes = Math.floor((time % 3600000) / 60000);
    let seconds = Math.floor((time % 60000) / 1000);
    let milliseconds = Math.floor((time % 1000) / 10);

    let lapTime = 
        (hours < 10 ? "0" : "") + hours + ":" +
        (minutes < 10 ? "0" : "") + minutes + ":" +
        (seconds < 10 ? "0" : "") + seconds + ":" +
        (milliseconds < 10 ? "0" : "") + milliseconds;

    stopwatches[id].laps.push(lapTime);

    let lapList = document.getElementById(`laps-${id}`);
    let lapItem = document.createElement("li");
    lapItem.innerText = lapTime;
    lapList.appendChild(lapItem);
}

function updateDisplay(id) {
    let time = stopwatches[id].time;
    let hours = Math.floor(time / 3600000);
    let minutes = Math.floor((time % 3600000) / 60000);
    let seconds = Math.floor((time % 60000) / 1000);
    let milliseconds = Math.floor((time % 1000) / 10);

    document.getElementById(`display-${id}`).innerText =
        (hours < 10 ? "0" : "") + hours + ":" +
        (minutes < 10 ? "0" : "") + minutes + ":" +
        (seconds < 10 ? "0" : "") + seconds + ":" +
        (milliseconds < 10 ? "0" : "") + milliseconds;
}

function toggleThemePanel() {
    document.getElementById("themePanel").classList.toggle("active");
}
// Function to Apply Theme
function applyTheme(pageColor, stopwatchColor) {
    document.body.style.backgroundColor = pageColor;
    document.querySelectorAll('.stopwatch').forEach(function (element) {
        element.style.backgroundColor = stopwatchColor;
    });
}
