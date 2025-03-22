document.getElementById("addStopwatch").addEventListener("click", addStopwatch);

function addStopwatch() {
    let container = document.getElementById("stopwatches");

    let stopwatch = document.createElement("div");
    stopwatch.classList.add("stopwatch");
    stopwatch.innerHTML = `
        <h2>00:00:00.000</h2> <!-- Added milliseconds display -->
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

    let display = stopwatch.querySelector("h2");
    let startButton = stopwatch.querySelector(".start");
    let pauseButton = stopwatch.querySelector(".pause");
    let resetButton = stopwatch.querySelector(".reset");
    let lapButton = stopwatch.querySelector(".lap");
    let lapsContainer = stopwatch.querySelector(".laps");

    function updateDisplay() {
        let formattedTime = 
            (hours < 10 ? "0" : "") + hours + ":" +
            (minutes < 10 ? "0" : "") + minutes + ":" +
            (seconds < 10 ? "0" : "") + seconds + "." +
            (milliseconds < 100 ? (milliseconds < 10 ? "00" : "0") : "") + milliseconds;

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
            }, 10); // Updates every 10ms for better accuracy
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
        lapItem.innerText = display.innerText;
        lapsContainer.appendChild(lapItem);
    }

    startButton.addEventListener("click", startTimer);
    pauseButton.addEventListener("click", pauseTimer);
    resetButton.addEventListener("click", resetTimer);
    lapButton.addEventListener("click", addLap);
}
