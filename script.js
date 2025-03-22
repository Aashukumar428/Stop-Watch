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
        <button class="start-btn" onclick="startStopwatch(${stopwatchId})">Start</button>
        <button class="pause-btn" onclick="pauseStopwatch(${stopwatchId})">Pause</button>
        <button class="stop-btn" onclick="resetStopwatch(${stopwatchId})">Reset</button>
        <button class="reset-btn" onclick="lapStopwatch(${stopwatchId})">Lap</button>
        <ul id="laps-${stopwatchId}"></ul>
    `;

    document.getElementById("stopwatch-container").appendChild(stopwatchDiv);
    stopwatches.push({ running: false, time: 0, interval: null });
}

function deleteStopwatch(id) {
    let stopwatchElement = document.getElementById(`stopwatch-${id}`);
    if (stopwatchElement) {
        stopwatchElement.remove();
    }
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
    let formattedTime = new Date(time).toISOString().substr(11, 12);
    let lapList = document.getElementById(`laps-${id}`);
    let lapItem = document.createElement("li");
    lapItem.innerText = formattedTime;
    lapList.appendChild(lapItem);
}

function updateDisplay(id) {
    let formattedTime = new Date(stopwatches[id].time).toISOString().substr(11, 12);
    document.getElementById(`display-${id}`).innerText = formattedTime;
}

