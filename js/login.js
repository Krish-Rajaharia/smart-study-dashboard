function login() {
    const email = document.getElementById("emailInput").value.trim();
    const pass = document.getElementById("passwordInput").value.trim();

    const saved = JSON.parse(localStorage.getItem("user"));
    if (!saved) {
        alert("No account found. Please sign up first.");
        return;
    }

    if (email === saved.email && pass === saved.pass) {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "index.html";
    } else {
        alert("Invalid credentials");
    }
}
