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
    stopwatchDiv.setAttribute("id", "stopwatch-" + stopwatchId);
    
    stopwatchDiv.innerHTML = `
        <h2>Stopwatch ${stopwatchId + 1}</h2>
        <p id="display-${stopwatchId}">00:00:00</p>
        <button onclick="startStopwatch(${stopwatchId})">Start</button>
        <button onclick="pauseStopwatch(${stopwatchId})">Pause</button>
        <button onclick="resetStopwatch(${stopwatchId})">Reset</button>
    `;

    document.getElementById("stopwatches").appendChild(stopwatchDiv);
    stopwatches.push({ time: 0, interval: null });
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
    updateDisplay(id);
}

function updateDisplay(id) {
    let time = stopwatches[id].time;
    let minutes = Math.floor(time / 60000);
    let seconds = Math.floor((time % 60000) / 1000);
    let milliseconds = Math.floor((time % 1000) / 10);

    document.getElementById(`display-${id}`).innerText =
        (minutes < 10 ? "0" : "") + minutes + ":" +
        (seconds < 10 ? "0" : "") + seconds + ":" +
        (milliseconds < 10 ? "0" : "") + milliseconds;
}
