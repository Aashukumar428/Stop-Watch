document.getElementById("addStopwatch").addEventListener("click", addStopwatch);

function addStopwatch() {
    let container = document.getElementById("stopwatches");

    let stopwatch = document.createElement("div");
    stopwatch.classList.add("stopwatch");
    stopwatch.innerHTML = `
        <h2>00:00:00</h2>
        <button class="start">Start</button>
        <button class="pause">Pause</button>
        <button class="reset">Reset</button>
        <button class="lap">Lap</button>
        <ul class="laps"></ul>
    `;

    container.appendChild(stopwatch);

    let timer;
    let seconds = 0, minutes = 0, hours = 0;
    let running = false;

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
            (seconds < 10 ? "0" : "") + seconds;
        display.innerText = formattedTime;
    }

    function startTimer() {
        if (!running) {
            running = true;
            timer = setInterval(() => {
                seconds++;
                if (seconds === 60) {
                    seconds = 0;
                    minutes++;
                }
                if (minutes === 60) {
                    minutes = 0;
                    hours++;
                }
                updateDisplay();
            }, 1000);
        }
    }

    function pauseTimer() {
        running = false;
        clearInterval(timer);
    }

    function resetTimer() {
        running = false;
        clearInterval(timer);
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
