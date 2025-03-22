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
document.getElementById("addStopwatch").addEventListener("click", addStopwatch);

function addStopwatch() {
    let stopwatchId = stopwatches.length;
    
    let stopwatchDiv = document.createElement("div");
    stopwatchDiv.classList.add("stopwatch");
    stopwatchDiv.setAttribute("id", `stopwatch-${stopwatchId}`);
    
    stopwatchDiv.innerHTML = `
        <button class="delete-btn" onclick="deleteStopwatch(${stopwatchId})">❌</button>
        <h2>Stopwatch ${stopwatchId + 1}</h2>
        <p id="display-${stopwatchId}">00:00:00:00</p>
        <div class="button-group">
            <button class="start-btn" onclick="startStopwatch(${stopwatchId})">Start</button>
            <button class="pause-btn" onclick="pauseStopwatch(${stopwatchId})">Pause</button>
            <button class="stop-btn" onclick="resetStopwatch(${stopwatchId})">Reset</button>
            <button class="reset-btn" onclick="lapStopwatch(${stopwatchId})">Lap</button>
        </div>
        <ul id="laps-${stopwatchId}"></ul>
    `;

    document.getElementById("stopwatch-container").appendChild(stopwatchDiv);
    stopwatches.push({ running: false, time: 0, interval: null });
}

// Function to Delete Stopwatch
function deleteStopwatch(id) {
    let stopwatchElement = document.getElementById(`stopwatch-${id}`);
    if (stopwatchElement) {
        stopwatchElement.remove();
    }
}

function startStopwatch(id) {
    if (!stopwatches[id].interval) {
        stopwatches[id].interval = setInterval(() => {
            stopwatches[id].time += 10;
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

    let lapTime = `${hours}:${minutes}:${seconds}:${milliseconds}`;
    
    let lapList = document.getElementById(`laps-${id}`);
    let lapItem = document.createElement("li");
    lapItem.innerText = lapTime;
    lapList.appendChild(lapItem);
}

function updateDisplay(id) {
    let time = stopwatches[id].time;
    document.getElementById(`display-${id}`).innerText = new Date(time).toISOString().substr(11, 11);
}
