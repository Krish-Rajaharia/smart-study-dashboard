// Timer Constants
const POMODORO_STUDY = 25 * 60;
const POMODORO_BREAK = 5 * 60;
const EXTENDED_STUDY = 60 * 60;
const EXTENDED_BREAK = 10 * 60;

// Pomodoro Timer Variables
let pomodoroTimeLeft = Number(localStorage.getItem("pomodoroTimeLeft")) || POMODORO_STUDY;
let pomodoroIsStudy = JSON.parse(localStorage.getItem("pomodoroIsStudy")) ?? true;
let pomodoroRunning = JSON.parse(localStorage.getItem("pomodoroRunning")) || false;
let pomodoroLastTimestamp = Number(localStorage.getItem("pomodoroLastTimestamp")) || null;
let pomodoroInterval = null;

// Extended Timer Variables
let extendedTimeLeft = Number(localStorage.getItem("extendedTimeLeft")) || EXTENDED_STUDY;
let extendedIsStudy = JSON.parse(localStorage.getItem("extendedIsStudy")) ?? true;
let extendedRunning = JSON.parse(localStorage.getItem("extendedRunning")) || false;
let extendedLastTimestamp = Number(localStorage.getItem("extendedLastTimestamp")) || null;
let extendedInterval = null;

// Custom Timer Variables
let customTimeLeft = Number(localStorage.getItem("customTimeLeft")) || (25 * 60);
let customRunning = JSON.parse(localStorage.getItem("customRunning")) || false;
let customLastTimestamp = Number(localStorage.getItem("customLastTimestamp")) || null;
let customInterval = null;
let customHours = Number(localStorage.getItem("customHours")) || 0;
let customMinutes = Number(localStorage.getItem("customMinutes")) || 25;

// DOM Elements
const pomodoroTimerEl = document.getElementById("pomodoroTimer");
const pomodoroSessionType = document.getElementById("pomodoroSessionType");
const extendedTimerEl = document.getElementById("extendedTimer");
const extendedSessionType = document.getElementById("extendedSessionType");
const customTimerEl = document.getElementById("customTimer");
const customSessionType = document.getElementById("customSessionType");

// Save Functions
function savePomodoroTimer() {
    localStorage.setItem("pomodoroTimeLeft", pomodoroTimeLeft);
    localStorage.setItem("pomodoroIsStudy", JSON.stringify(pomodoroIsStudy));
    localStorage.setItem("pomodoroRunning", JSON.stringify(pomodoroRunning));
    localStorage.setItem("pomodoroLastTimestamp", Date.now());
}

function saveExtendedTimer() {
    localStorage.setItem("extendedTimeLeft", extendedTimeLeft);
    localStorage.setItem("extendedIsStudy", JSON.stringify(extendedIsStudy));
    localStorage.setItem("extendedRunning", JSON.stringify(extendedRunning));
    localStorage.setItem("extendedLastTimestamp", Date.now());
}

function saveCustomTimer() {
    localStorage.setItem("customTimeLeft", customTimeLeft);
    localStorage.setItem("customRunning", JSON.stringify(customRunning));
    localStorage.setItem("customLastTimestamp", Date.now());
    localStorage.setItem("customHours", customHours);
    localStorage.setItem("customMinutes", customMinutes);
}

// Restore Functions
function restorePomodoroTimer() {
    if (pomodoroRunning && pomodoroLastTimestamp) {
        const diff = Math.floor((Date.now() - pomodoroLastTimestamp) / 1000);
        pomodoroTimeLeft -= diff;
        if (pomodoroTimeLeft < 0) pomodoroTimeLeft = 0;
    }
}

function restoreExtendedTimer() {
    if (extendedRunning && extendedLastTimestamp) {
        const diff = Math.floor((Date.now() - extendedLastTimestamp) / 1000);
        extendedTimeLeft -= diff;
        if (extendedTimeLeft < 0) extendedTimeLeft = 0;
    }
}

function restoreCustomTimer() {
    if (customRunning && customLastTimestamp) {
        const diff = Math.floor((Date.now() - customLastTimestamp) / 1000);
        customTimeLeft -= diff;
        if (customTimeLeft < 0) customTimeLeft = 0;
    }
}

// Display Functions
function updatePomodoroDisplay() {
    const m = Math.floor(pomodoroTimeLeft / 60);
    const s = pomodoroTimeLeft % 60;
    pomodoroTimerEl.innerText = `${m}:${s.toString().padStart(2, "0")}`;
    pomodoroSessionType.innerText = pomodoroIsStudy ? "Study Time 📖" : "Break ☕";
}

function updateExtendedDisplay() {
    const m = Math.floor(extendedTimeLeft / 60);
    const s = extendedTimeLeft % 60;
    extendedTimerEl.innerText = `${m}:${s.toString().padStart(2, "0")}`;
    extendedSessionType.innerText = extendedIsStudy ? "Extended Study 📖" : "Break ☕";
}

function updateCustomDisplay() {
    const m = Math.floor(customTimeLeft / 60);
    const s = customTimeLeft % 60;
    customTimerEl.innerText = `${m}:${s.toString().padStart(2, "0")}`;
    customSessionType.innerText = "Custom Timer ⏰";
}

// Pomodoro Timer Functions
function startPomodoroTimer() {
    if (pomodoroInterval) return;

    pomodoroRunning = true;
    savePomodoroTimer();

    pomodoroInterval = setInterval(() => {
        pomodoroTimeLeft--;
        updatePomodoroDisplay();
        savePomodoroTimer();

        if (pomodoroTimeLeft <= 0) {
            clearInterval(pomodoroInterval);
            pomodoroInterval = null;
            pomodoroRunning = false;
            savePomodoroTimer();

            pomodoroIsStudy = !pomodoroIsStudy;
            pomodoroTimeLeft = pomodoroIsStudy ? POMODORO_STUDY : POMODORO_BREAK;
            alert(pomodoroIsStudy ? "Break time over! Back to studying." : "Study session complete! Take a break.");
            startPomodoroTimer();
        }
    }, 1000);
}

function pausePomodoroTimer() {
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
    pomodoroRunning = false;
    savePomodoroTimer();
}

function resetPomodoroTimer() {
    pausePomodoroTimer();
    pomodoroIsStudy = true;
    pomodoroTimeLeft = POMODORO_STUDY;
    savePomodoroTimer();
    updatePomodoroDisplay();
}

// Extended Timer Functions
function startExtendedTimer() {
    if (extendedInterval) return;

    extendedRunning = true;
    saveExtendedTimer();

    extendedInterval = setInterval(() => {
        extendedTimeLeft--;
        updateExtendedDisplay();
        saveExtendedTimer();

        if (extendedTimeLeft <= 0) {
            clearInterval(extendedInterval);
            extendedInterval = null;
            extendedRunning = false;
            saveExtendedTimer();

            if (extendedIsStudy) {
                extendedIsStudy = false;
                extendedTimeLeft = EXTENDED_BREAK;
                alert("Extended study session complete! Take a 10-minute break.");
                startExtendedTimer();
            } else {
                alert("Break time over! Session complete.");
                resetExtendedTimer();
            }
        }
    }, 1000);
}

function pauseExtendedTimer() {
    clearInterval(extendedInterval);
    extendedInterval = null;
    extendedRunning = false;
    saveExtendedTimer();
}

function resetExtendedTimer() {
    pauseExtendedTimer();
    extendedIsStudy = true;
    extendedTimeLeft = EXTENDED_STUDY;
    saveExtendedTimer();
    updateExtendedDisplay();
}

// Custom Timer Functions
function setCustomTimer() {
    customHours = Number(document.getElementById("customHours").value) || 0;
    customMinutes = Number(document.getElementById("customMinutes").value) || 0;

    const totalSeconds = customHours * 3600 + customMinutes * 60;

    if (totalSeconds <= 0) {
        alert("Please set a valid time greater than 0 minutes.");
        return;
    }

    if (totalSeconds > 24 * 3600) {
        alert("Timer cannot exceed 24 hours.");
        return;
    }

    pauseCustomTimer();
    customTimeLeft = totalSeconds;
    saveCustomTimer();
    updateCustomDisplay();
    alert(`Custom timer set to ${customHours}h ${customMinutes}m!`);
}

function startCustomTimer() {
    if (customInterval) return;

    customRunning = true;
    saveCustomTimer();

    customInterval = setInterval(() => {
        customTimeLeft--;
        updateCustomDisplay();
        saveCustomTimer();

        if (customTimeLeft <= 0) {
            clearInterval(customInterval);
            customInterval = null;
            customRunning = false;
            saveCustomTimer();
            alert("Custom timer complete!");
            resetCustomTimer();
        }
    }, 1000);
}

function pauseCustomTimer() {
    clearInterval(customInterval);
    customInterval = null;
    customRunning = false;
    saveCustomTimer();
}

function resetCustomTimer() {
    pauseCustomTimer();
    customTimeLeft = customHours * 3600 + customMinutes * 60;
    saveCustomTimer();
    updateCustomDisplay();
}

// Visibility Change Handler
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        pausePomodoroTimer();
        pauseExtendedTimer();
        pauseCustomTimer();
    }
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("customHours").value = customHours;
    document.getElementById("customMinutes").value = customMinutes;
});

restorePomodoroTimer();
restoreExtendedTimer();
restoreCustomTimer();
updatePomodoroDisplay();
updateExtendedDisplay();
updateCustomDisplay();