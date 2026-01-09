const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("priority");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const text = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (!text) return;

    tasks.push({ text, priority, done: false });

    taskInput.value = "";
    saveTasks();
    displayTasks();
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    saveTasks();
    displayTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
}

function setFilter(filter) {
    currentFilter = filter;
    displayTasks();
}

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, i) => {
        if (
            currentFilter === "completed" && !task.done ||
            currentFilter === "pending" && task.done
        ) return;

        const li = document.createElement("li");
        li.className = `task ${task.priority.toLowerCase()} ${task.done ? "done" : ""}`;

        li.innerHTML = `
            
            <span>${task.text}</span>
            <button class="tick-btn ${task.done ? "ticked" : ""}" onclick="toggleTask(${i})">✓</button>           
            <button onclick="deleteTask(${i})">❌</button>
        `;

        taskList.appendChild(li);
    });
}

displayTasks();
