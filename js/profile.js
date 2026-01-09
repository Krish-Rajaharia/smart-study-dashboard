const usernameInput = document.getElementById("username");
const goalInput = document.getElementById("goal");

usernameInput.value = localStorage.getItem("username") || "";
goalInput.value = localStorage.getItem("dailyGoal") || 120;

document.getElementById("streak").innerText =
    localStorage.getItem("streak") || 0;

document.getElementById("today").innerText =
    localStorage.getItem("todayMinutes") || 0;

function saveProfile() {
    localStorage.setItem("username", usernameInput.value);
    localStorage.setItem("dailyGoal", goalInput.value);
    alert("Profile Saved ✅");
}
function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}
