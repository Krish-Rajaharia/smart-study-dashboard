function signup() {
    const email = document.getElementById("emailInput").value.trim();
    const pass = document.getElementById("passwordInput").value.trim();

    if (!email || !pass) {
        alert("Please fill all fields");
        return;
    }

    localStorage.setItem("user", JSON.stringify({ email, pass }));
    alert("Account created successfully!");
    window.location.href = "login.html";
}
