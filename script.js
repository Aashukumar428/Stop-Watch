document.getElementById("toggleDarkMode").addEventListener("change", toggleDarkMode);

// Load Dark Mode preference on page load
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    document.getElementById("toggleDarkMode").checked = true;
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");

    // Save preference
    localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");

    // Apply dark mode to all elements
    applyDarkModeStyles(isDarkMode);
}

function applyDarkModeStyles(isDarkMode) {
    const stopwatches = document.querySelectorAll(".stopwatch");
    const popups = document.querySelectorAll(".popup");
    const themePanel = document.querySelector(".theme-panel");

    if (isDarkMode) {
        document.body.style.backgroundColor = "#121212"; // Dark mode background
        document.body.style.color = "white"; // Dark mode text color

        popups.forEach(popup => {
            popup.style.backgroundColor = "#333"; // Dark popup background
            popup.style.color = "white";
        });

        if (themePanel) {
            themePanel.style.backgroundColor = "#333"; // Dark theme panel
            themePanel.style.color = "white";
        }

        stopwatches.forEach(stopwatch => {
            stopwatch.style.backgroundColor = "#222"; // Dark Mode Background
            stopwatch.style.color = "white"; // Dark Mode Text Color
        });
    } else {
        // Restore theme colors
        document.body.style.backgroundColor = selectedPageColor;
        document.body.style.color = "#333";

        popups.forEach(popup => {
            popup.style.backgroundColor = "white"; // Default popup color
            popup.style.color = "#333";
        });

        if (themePanel) {
            themePanel.style.backgroundColor = "#f4f4f4"; // Default theme panel
            themePanel.style.color = "black";
        }

        stopwatches.forEach(stopwatch => {
            stopwatch.style.backgroundColor = selectedStopwatchColor; // Apply Theme Background
            stopwatch.style.color = "#333"; // Apply Theme Text Color
        });
    }
}

// Apply saved dark mode setting on page load
document.addEventListener("DOMContentLoaded", function () {
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";

    if (isDarkMode) {
        document.body.classList.add("dark-mode");
        document.getElementById("toggleDarkMode").checked = true;
    }

    applyDarkModeStyles(isDarkMode);
});

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

    if (document.body.classList.contains("dark-mode")) {
        document.getElementById("taskPopup").classList.add("dark-mode");
    } else {
        document.getElementById("taskPopup").classList.remove("dark-mode");
    }

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

    // Apply dark mode if enabled
    if (document.body.classList.contains("dark-mode")) {
        stopwatchDiv.classList.add("dark-mode");
        stopwatchDiv.style.color = "white"; // Ensure text color is white in dark mode
    } else {
        stopwatchDiv.style.backgroundColor = selectedStopwatchColor;
        stopwatchDiv.style.color = "#333"; // Ensure text color matches light mode
    }

    // Update theme dynamically when dark mode is toggled
    document.getElementById("toggleDarkMode").addEventListener("change", () => {
        if (document.body.classList.contains("dark-mode")) {
            stopwatchDiv.classList.add("dark-mode");
            stopwatchDiv.style.color = "white";
        } else {
            stopwatchDiv.classList.remove("dark-mode");
            stopwatchDiv.style.backgroundColor = selectedStopwatchColor;
            stopwatchDiv.style.color = "#333";
        }
    });

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
    let themePanel = document.getElementById("themePanel");
    themePanel.classList.toggle("active");

    if (themePanel.classList.contains("active")) {
        // Add event listener to detect clicks outside
        document.addEventListener("click", closeThemePanelOnClickOutside);
    } else {
        // Remove event listener when the panel is closed
        document.removeEventListener("click", closeThemePanelOnClickOutside);
    }
}

function closeThemePanelOnClickOutside(event) {
    let themePanel = document.getElementById("themePanel");
    let themeIcon = document.querySelector(".theme-icon");

    // Close the panel if the click is outside both the panel and the icon
    if (!themePanel.contains(event.target) && !themeIcon.contains(event.target)) {
        themePanel.classList.remove("active");
        document.removeEventListener("click", closeThemePanelOnClickOutside);
    }
}

// Function to Apply Theme
let selectedPageColor = "#f5f8f4";
let selectedStopwatchColor = "#d4d7cc";
let isDarkMode = false;

function applyTheme(pageColor, stopwatchColor) {
    selectedPageColor = pageColor;
    selectedStopwatchColor = stopwatchColor;

    if (!document.body.classList.contains("dark-mode")) {
        document.body.style.backgroundColor = pageColor;
        document.querySelectorAll(".stopwatch").forEach(stopwatch => {
            stopwatch.style.backgroundColor = stopwatchColor;
        });
    }
}


