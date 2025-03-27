
document.getElementById("toggleDarkMode").addEventListener("change", toggleDarkMode);

// typeWriter effect for the title //
document.addEventListener('DOMContentLoaded', function() {
    const titleElement = document.getElementById('animated-title');
    const words = [
        { text: "Stopwatch", color: "color-teal" },
        { text: "Fitness", color: "color-amber" },
        { text: "Health", color: "color-rose" },
        { text: "Tracker", color: "color-indigo" },
        { text: "Timer", color: "color-emerald" },
        { text: "Wellness", color: "color-violet" }
    ];
    
    // Timing controls (in milliseconds)
    const typingSpeed = 150;    // Time between letters appearing
    const deletingSpeed = 200;   // Time between letters disappearing
    const pauseBeforeDelete = 200; // Time showing complete word before deleting
    const pauseBeforeType = 20;   // Time between words
    
    let currentIndex = 0;
    
    function typeWriter(wordObj, callback) {
      // Remove all color classes and add the new one
      titleElement.className = 'typewriter ' + wordObj.color;
      
      let i = 0;
      function type() {
        if (i < wordObj.text.length) {
          titleElement.textContent = wordObj.text.substring(0, i+1);
          i++;
          setTimeout(type, typingSpeed);
        } else if (callback) {
          setTimeout(callback, pauseBeforeDelete);
        }
      }
      type();
    }
    
    function deleteText(callback) {
      let text = titleElement.textContent;
      let i = text.length;
      
      function del() {
        if (i > 0) {
          titleElement.textContent = text.substring(0, i-1);
          i--;
          setTimeout(del, deletingSpeed);
        } else if (callback) {
          setTimeout(callback, pauseBeforeType);
        }
      }
      del();
    }
    
    function cycleWords() {
      currentIndex = (currentIndex + 1) % words.length;
      typeWriter(words[currentIndex], function() {
        deleteText(cycleWords);
      });
    }
    
    // Initialize with first word
    typeWriter(words[0], function() {
      setTimeout(function() {
        deleteText(cycleWords);
      }, pauseBeforeDelete);
    });
  });

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
            closePopup();
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



// Removed duplicate declaration of stopwatches

function addStopwatch(taskName) {
    let stopwatchId = Date.now(); // Unique ID for each stopwatch

    let stopwatchDiv = document.createElement("div");
    stopwatchDiv.classList.add("stopwatch");
    stopwatchDiv.setAttribute("id", `stopwatch-${stopwatchId}`);

    // Apply theme (your existing theme code remains unchanged)
    if (document.body.classList.contains("image-theme")) {
        stopwatchDiv.classList.add("glassmorphism");
        stopwatchDiv.style.backdropFilter = "blur(10px)";

        if (document.body.classList.contains("dark-mode")) {
            stopwatchDiv.style.background = "rgba(0, 0, 0, 0.2)";
            stopwatchDiv.style.border = "1px solid rgba(0, 0, 0, 0.3)";
            stopwatchDiv.style.color = "white";
        } else {
            stopwatchDiv.style.background = "rgba(255, 255, 255, 0.2)";
            stopwatchDiv.style.border = "1px solid rgba(255, 255, 255, 0.3)";
            stopwatchDiv.style.color = "#333";
        }
    } else if (document.body.classList.contains("dark-mode")) {
        stopwatchDiv.style.backgroundColor = "#222";
        stopwatchDiv.style.color = "white";
    } else {
        stopwatchDiv.style.backgroundColor = currentTheme.colors.stopwatch || selectedStopwatchColor;
        stopwatchDiv.style.color = "#333";
    }

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
    
    // Initialize the stopwatch object with the ID
    stopwatches.push({
        id: stopwatchId,
        name: taskName,
        time: 0,
        interval: null,
        laps: []
    });
}

// Function to Delete Stopwatch
function deleteStopwatch(id) {
    let stopwatchElement = document.getElementById(`stopwatch-${id}`);
    if (stopwatchElement) {
        stopwatchElement.remove();
    }
    
    // Find and clear the interval before removing
    const index = stopwatches.findIndex(sw => sw.id === id);
    if (index !== -1) {
        clearInterval(stopwatches[index].interval);
        stopwatches.splice(index, 1);
    }
}

function startStopwatch(id) {
    const stopwatch = stopwatches.find(sw => sw.id === id);
    if (stopwatch && !stopwatch.interval) {
        const startTime = Date.now() - stopwatch.time;
        stopwatch.interval = setInterval(() => {
            stopwatch.time = Date.now() - startTime;
            updateDisplay(id);
        }, 10);
    }
}

function pauseStopwatch(id) {
    const stopwatch = stopwatches.find(sw => sw.id === id);
    if (stopwatch && stopwatch.interval) {
        clearInterval(stopwatch.interval);
        stopwatch.interval = null;
    }
}

function resetStopwatch(id) {
    const stopwatch = stopwatches.find(sw => sw.id === id);
    if (stopwatch) {
        clearInterval(stopwatch.interval);
        stopwatch.interval = null;
        stopwatch.time = 0;
        stopwatch.laps = [];
        updateDisplay(id);
        document.getElementById(`laps-${id}`).innerHTML = "";
    }
}

function lapStopwatch(id) {
    const stopwatch = stopwatches.find(sw => sw.id === id);
    if (stopwatch) {
        const time = stopwatch.time;
        const hours = Math.floor(time / 3600000);
        const minutes = Math.floor((time % 3600000) / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        const milliseconds = Math.floor((time % 1000) / 10);

        const lapTime =
            (hours < 10 ? "0" : "") + hours + ":" +
            (minutes < 10 ? "0" : "") + minutes + ":" +
            (seconds < 10 ? "0" : "") + seconds + ":" +
            (milliseconds < 10 ? "0" : "") + milliseconds;

        stopwatch.laps.push(lapTime);

        const lapList = document.getElementById(`laps-${id}`);
        const lapItem = document.createElement("li");
        lapItem.innerText = `Lap ${stopwatch.laps.length}: ${lapTime}`;
        lapList.prepend(lapItem); // Add new laps at the top
    }
}

function updateDisplay(id) {
    const stopwatch = stopwatches.find(sw => sw.id === id);
    if (stopwatch) {
        const time = stopwatch.time;
        const hours = Math.floor(time / 3600000);
        const minutes = Math.floor((time % 3600000) / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        const milliseconds = Math.floor((time % 1000) / 10);

        document.getElementById(`display-${id}`).innerText =
            (hours < 10 ? "0" : "") + hours + ":" +
            (minutes < 10 ? "0" : "") + minutes + ":" +
            (seconds < 10 ? "0" : "") + seconds + ":" +
            (milliseconds < 10 ? "0" : "") + milliseconds;
    }
}

// Theme Panel Logic
function toggleThemePanel() {
    let themePanel = document.getElementById("themePanel");
    themePanel.classList.toggle("active");

    if (themePanel.classList.contains("active")) {
        // Add event listener to detect clicks outside
        document.addEventListener("click", closeThemePanelOnClickOutside);

        // Add event listeners for image theme selection
        document.querySelectorAll(".image-theme-option").forEach(option => {
            option.addEventListener("click", function () {
                const imagePath = this.getAttribute("data-image-path");
                applyThemeImage(imagePath);
            });
        });
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

// Replace all theme-related functions with this:

let currentTheme = {
    type: 'solid', // 'solid' or 'image'
    colors: { page: '#f5f8f4', stopwatch: '#d4d7cc' },
    image: null
};

function applyTheme(pageColor, stopwatchColor) {
    // Set current theme
    currentTheme.type = 'solid';
    currentTheme.colors = { page: pageColor, stopwatch: stopwatchColor };
    
    // Remove image theme if present
    document.body.classList.remove("image-theme");
    document.body.style.backgroundImage = 'none';
    
    // Apply solid colors
    document.body.style.backgroundColor = pageColor;
    document.querySelectorAll(".stopwatch").forEach(el => {
        el.style.backgroundColor = stopwatchColor;
        el.classList.remove("glassmorphism");
    });
    
    // Update dark mode if active
    if (document.body.classList.contains("dark-mode")) {
        applyDarkModeStyles(true);
    }
    
    // Save to localStorage
    localStorage.setItem('theme', JSON.stringify(currentTheme));
}

function applyThemeImage(imagePath) {
    // Set current theme
    currentTheme.type = 'image';
    currentTheme.image = imagePath;
    
    // Apply image theme
    document.body.classList.add("image-theme");
    document.body.style.background = `url('${imagePath}') no-repeat center center/cover fixed`;
    
    // Apply glassmorphism
    document.querySelectorAll(".stopwatch, .popup, .theme-panel").forEach(el => {
        el.classList.add("glassmorphism");
    });
    
    // Save to localStorage
    localStorage.setItem('theme', JSON.stringify(currentTheme));
}

// Ensure newly added stopwatches follow glassmorphism if image theme is active
// Replace the glassmorphism line in applyThemeImage()
document.querySelectorAll(".stopwatch").forEach(el => {
    el.style.backdropFilter = "blur(10px)";
    if (document.body.classList.contains("dark-mode")) {
        el.style.background = "rgba(0, 0, 0, 0.2)";
        el.style.border = "1px solid rgba(0, 0, 0, 0.3)";
    } else {
        el.style.background = "rgba(255, 255, 255, 0.2)";
        el.style.border = "1px solid rgba(255, 255, 255, 0.3)";
    }
});

// Hook into the addStopwatch function to ensure new stopwatches follow the current theme
// Theme application for new stopwatches
const originalAddStopwatch = addStopwatch;
addStopwatch = function(taskName) {
    originalAddStopwatch(taskName);
    
    // No need for separate image theme check since we handle it in addStopwatch now
};

// Add to your DOMContentLoaded event handler
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    const theme = JSON.parse(savedTheme);
    if (theme.type === 'image') {
        applyThemeImage(theme.image);
    } else {
        applyTheme(theme.colors.page, theme.colors.stopwatch);
    }
}

function applyDarkModeStyles(isDarkMode) {
    const elements = document.querySelectorAll(".stopwatch");
    const popups = document.querySelectorAll(".popup");
    const themePanel = document.querySelector(".theme-panel");
    
    if (isDarkMode) {
        document.body.style.backgroundColor = "#121212";
        document.body.style.color = "white";
        
        // Apply glassmorphism to popups and panel regardless of theme
        popups.forEach(popup => {
            popup.style.background = "rgba(0, 0, 0, 0.3)";
            popup.style.backdropFilter = "blur(10px)";
            popup.style.border = "1px solid rgba(0, 0, 0, 0.4)";
            popup.style.color = "white";
        });
        
        if (themePanel) {
            themePanel.style.background = "rgba(0, 0, 0, 0.3)";
            themePanel.style.backdropFilter = "blur(10px)";
            themePanel.style.border = "1px solid rgba(0, 0, 0, 0.4)";
            themePanel.style.color = "white";
        }
        
        // Handle stopwatches based on theme
        elements.forEach(el => {
            el.style.backgroundColor = currentTheme.type === 'image' ? "rgba(0,0,0,0.2)" : "#222";
            el.style.color = "white";
        });
        
    } else {
        document.body.style.backgroundColor = currentTheme.type === 'solid' ? currentTheme.colors.page : selectedPageColor;
        document.body.style.color = "#333";
        
        // Apply light glassmorphism to popups and panel
        popups.forEach(popup => {
            popup.style.background = "rgba(255, 255, 255, 0.2)";
            popup.style.backdropFilter = "blur(10px)";
            popup.style.border = "1px solid rgba(255, 255, 255, 0.3)";
            popup.style.color = "#333";
        });
        
        if (themePanel) {
            themePanel.style.background = "rgba(255, 255, 255, 0.2)";
            themePanel.style.backdropFilter = "blur(10px)";
            themePanel.style.border = "1px solid rgba(255, 255, 255, 0.3)";
            themePanel.style.color = "#333";
        }
        
        // Handle stopwatches based on theme
        elements.forEach(el => {
            el.style.backgroundColor = currentTheme.type === 'solid' ? currentTheme.colors.stopwatch : selectedStopwatchColor;
            el.style.color = "#333";
        });
    }
}

/* magnet button effect */

// Add to all buttons
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'translateY(3px)';
    });
    btn.addEventListener('mouseup', () => {
      btn.style.transform = 'translateY(0)';
    });
  });

  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      btn.style.setProperty('--x', `${x}px`);
      btn.style.setProperty('--y', `${y}px`);
    });
  });

