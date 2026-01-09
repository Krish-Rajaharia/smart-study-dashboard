let plannerData = JSON.parse(localStorage.getItem("plannerData")) || { planned: [], completed: [] };
let plans = plannerData.planned || [];
let completedPlans = plannerData.completed || [];

function savePlans() {
    localStorage.setItem("plannerData", JSON.stringify({ planned: plans, completed: completedPlans }));
}

function addPlan() {
    let time = document.getElementById("time").value;
    let activity = document.getElementById("activity").value;

    if (!time || !activity) return;

    plans.push({ time, activity });
    savePlans();
    displayPlans();
    displayCompletedPlans();

    // Clear input fields
    document.getElementById("time").value = "";
    document.getElementById("activity").value = "";

    alert("Activity added successfully!");
}

function displayPlans() {
    let list = document.getElementById("planList");
    list.innerHTML = "";

    plans.forEach((p, i) => {
        let li = document.createElement("li");
        li.innerHTML = `
            <span>${p.time} - ${p.activity}</span>
            <button onclick="completePlan(${i})" class="complete-btn">✅</button>
            <button onclick="removePlan(${i})" class="remove-btn">❌</button>
        `;
        list.appendChild(li);
    });
}

function displayCompletedPlans() {
    let list = document.getElementById("completedList");
    list.innerHTML = "";

    completedPlans.forEach((p, i) => {
        let li = document.createElement("li");
        li.classList.add("completed");
        li.innerHTML = `
            <span>${p.time} - ${p.activity}</span>
            <button onclick="uncompletePlan(${i})" class="uncomplete-btn">↩️</button>
            <button onclick="removeCompletedPlan(${i})" class="remove-btn">❌</button>
        `;
        list.appendChild(li);
    });
}

function completePlan(index) {
    let plan = plans.splice(index, 1)[0];
    completedPlans.push(plan);
    savePlans();
    displayPlans();
    displayCompletedPlans();
}

function uncompletePlan(index) {
    let plan = completedPlans.splice(index, 1)[0];
    plans.push(plan);
    savePlans();
    displayPlans();
    displayCompletedPlans();
}

function removePlan(index) {
    plans.splice(index, 1);
    savePlans();
    displayPlans();
}

function removeCompletedPlan(index) {
    completedPlans.splice(index, 1);
    savePlans();
    displayCompletedPlans();
}

function clearAllPlans() {
    if (confirm("Are you sure you want to clear all plans? This action cannot be undone.")) {
        plans = [];
        completedPlans = [];
        savePlans();
        displayPlans();
        displayCompletedPlans();
        alert("All plans have been cleared.");
    }
}

displayPlans();
displayCompletedPlans();
