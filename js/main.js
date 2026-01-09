/* =========================
   GLOBAL NAVIGATION
========================= */
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "index.html";
    }
}

/* =========================
   DASHBOARD CALCULATIONS
========================= */
document.addEventListener("DOMContentLoaded", () => {
    const studyMinutes = Number(localStorage.getItem("studyMinutes")) || 0;
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const plans = JSON.parse(localStorage.getItem("plannerData")) || [];

    // Study Score (180 min = 100%)
    const studyScore = Math.min((studyMinutes / 180) * 100, 100);

    // Task Score
    const completedTasks = tasks.filter(t => t.done).length;
    const taskScore = tasks.length ? (completedTasks / tasks.length) * 100 : 0;

    // Planner Score
    const plannerScore = plans.length > 0 ? 100 : 0;

    // Final Productivity Score
    let productivity =
        (studyScore * 0.5) +
        (taskScore * 0.4) +
        (plannerScore * 0.1);

    productivity = Math.round(productivity);

    // Update UI safely
    const prodEl = document.getElementById("productivityScore");
    if (prodEl) prodEl.innerText = productivity + "%";

    const studyBar = document.getElementById("studyProgress");
    const studyText = document.getElementById("studyPercent");
    if (studyBar && studyText) {
        studyBar.style.width = studyScore + "%";
        studyText.innerText = Math.round(studyScore) + "%";
    }

    const taskBar = document.getElementById("taskProgress");
    const taskText = document.getElementById("taskPercent");
    if (taskBar && taskText) {
        taskBar.style.width = taskScore + "%";
        taskText.innerText = Math.round(taskScore) + "%";
    }

    /* =========================
       MASCOT LOGIC
    ========================= */
    const mascot = document.getElementById("mascot");
    const motivation = document.getElementById("motivation");

    if (mascot && motivation) {
        if (productivity >= 75) {
            mascot.src = "assets/images/mascot-happy.png";
            motivation.innerText = "You're on fire today! 🔥";
        } else if (productivity >= 40) {
            mascot.src = "assets/images/mascot-neutral.png";
            motivation.innerText = "Solid progress, keep pushing 💪";
        } else {
            mascot.src = "assets/images/mascot-sleepy.png";
            motivation.innerText = "Let’s focus a bit more 😴";
        }
    }
});
/* =========================
   DAILY QUOTE LOGIC
========================= */
const quotes = [
    "Consistency beats intensity 💪",
    "One focused hour is better than ten distracted ones 📚",
    "Small progress every day adds up 🔥",
    "Discipline will take you where motivation can't 🚀",
    "Study now, thank yourself later 🧠",
    "Don’t break the streak ✨"
];

const quoteEl = document.getElementById("quoteStrip");
if (quoteEl) {
    const todayIndex = new Date().getDate() % quotes.length;
    quoteEl.innerText = "💬 " + quotes[todayIndex];
}
/* =========================
   WEEKLY SUMMARY LOGIC
========================= */
const weekStudyEl = document.getElementById("weekStudy");
const weekTasksEl = document.getElementById("weekTasks");
const weekDaysEl = document.getElementById("weekDays");

if (weekStudyEl && weekTasksEl && weekDaysEl) {
    const studyMinutes = Number(localStorage.getItem("studyMinutes")) || 0;
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    weekStudyEl.innerText = studyMinutes;
    weekTasksEl.innerText = tasks.filter(t => t.done).length;
    weekDaysEl.innerText = Math.min(Math.ceil(studyMinutes / 60), 7);
}
/* =========================
   GOAL PROGRESS RING
========================= */
const goalCircle = document.getElementById("goalCircle");
const goalText = document.getElementById("goalPercent");

if (goalCircle && goalText) {
    const today = Number(localStorage.getItem("todayMinutes")) || 0;
    const goal = Number(localStorage.getItem("dailyGoal")) || 120;

    const percent = Math.min(Math.round((today / goal) * 100), 100);
    const offset = 314 - (314 * percent) / 100;

    goalCircle.style.strokeDashoffset = offset;
    goalText.innerText = percent + "%";
}
/* =========================
   WEEKLY HEATMAP LOGIC
========================= */
const heatmap = document.getElementById("heatmap");

if (heatmap) {
    const data = JSON.parse(localStorage.getItem("weeklyStudy")) || [0,0,0,0,0,0,0];

    heatmap.innerHTML = "";
    data.forEach(min => {
        let level = 0;
        if (min >= 30) level = 1;
        if (min >= 60) level = 2;
        if (min >= 120) level = 3;

        const div = document.createElement("div");
        div.className = `heat-day heat-${level}`;
        heatmap.appendChild(div);
    });
}
/* =========================
   DARK MODE LOGIC
========================= */
const toggle = document.getElementById("themeToggle");
const tooltip = document.getElementById("themeTooltip");

if (toggle && tooltip) {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        toggle.textContent = "☀️";
        tooltip.textContent = "Switch to Light Mode";
    } else {
        toggle.textContent = "🌑";
        tooltip.textContent = "Switch to Dark Mode";
    }

    toggle.onclick = () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        toggle.textContent = isDark ? "☀️" : "🌑";
        tooltip.textContent = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
    };
}
/* =========================
   AUTH GUARD
========================= */
if (
    !localStorage.getItem("loggedIn") &&
    !location.pathname.includes("login") &&
    !location.pathname.includes("signup")
) {
    window.location.href = "login.html";
}
