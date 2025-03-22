document.getElementById("addStopwatch").addEventListener("click", addStopwatch);

function addStopwatch() {
    let container = document.getElementById("stopwatches");

    let stopwatch = document.createElement("div");
    stopwatch.classList.add("stopwatch");
    stopwatch.innerHTML = `
        <input type="text" class="task-name" placeholder="Enter Task Name" />
        <h2>00:00:00.00</h2> <!-- Two-digit milliseconds -->
        <button class="start">Start</button>
        <button class="pause">Pause</button>
        <button class="reset">Reset</button>
        <button class="lap">Lap</button>
        <ul class="laps"></ul>
    `;

    container.appendChild(stopwatch);

    let timer;
    let milliseconds = 0, seconds = 0, minutes = 0, hours = 0;
    let running = false;
    let lastTime = 0;

    let taskInput = stopwatch.querySelector(".task-name");
    let display = stopwatch.querySelector("h2");
    let startButton = stopwatch.querySelector(".start");
    let pauseButton = stopwatch.querySelector(".pause");
    let resetButton = stopwatch.querySelector(".reset");
    let lapButton = stopwatch.querySelector(".lap");
    let lapsContainer = stopwatch.querySelector(".laps");

    function updateDisplay() {
        let formattedMilliseconds = Math.floor(milliseconds / 10); // Convert to 2-digit

        let formattedTime =
            (hours < 10 ? "0" : "") + hours + ":" +
            (minutes < 10 ? "0" : "") + minutes + ":" +
            (seconds < 10 ? "0" : "") + seconds + "." +
            (formattedMilliseconds < 10 ? "0" : "") + formattedMilliseconds;

        display.innerText = formattedTime;
    }

    function startTimer() {
        if (!running) {
            running = true;
            lastTime = Date.now();
            timer = setInterval(() => {
                let now = Date.now();
                let elapsed = now - lastTime;
                lastTime = now;

                milliseconds += elapsed;
                while (milliseconds >= 1000) {
                    milliseconds -= 1000;
                    seconds++;
                }
                while (seconds >= 60) {
                    seconds -= 60;
                    minutes++;
                }
                while (minutes >= 60) {
                    minutes -= 60;
                    hours++;
                }

                updateDisplay();
            }, 10);
        }
    }

    function pauseTimer() {
        running = false;
        clearInterval(timer);
    }

    function resetTimer() {
        running = false;
        clearInterval(timer);
        milliseconds = 0;
        seconds = 0;
        minutes = 0;
        hours = 0;
        updateDisplay();
        lapsContainer.innerHTML = "";
    }

    function addLap() {
        let lapItem = document.createElement("li");
        lapItem.innerText = `${taskInput.value || "Task"} - ${display.innerText}`;
        lapsContainer.appendChild(lapItem);
    }

    startButton.addEventListener("click", startTimer);
    pauseButton.addEventListener("click", pauseTimer);
    resetButton.addEventListener("click", resetTimer);
    lapButton.addEventListener("click", addLap);
}
