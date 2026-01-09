const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");
const subjectSelect = document.getElementById("subjectSelect");

let data = JSON.parse(localStorage.getItem("performanceData")) || [];

function save() {
    localStorage.setItem("performanceData", JSON.stringify(data));
}

function addPerformance() {
    const subject = document.getElementById("subjectInput").value.trim();
    const scored = Number(document.getElementById("scoredInput").value);
    const max = Number(document.getElementById("maxInput").value);
    const date = document.getElementById("dateInput").value || new Date().toISOString().split('T')[0];

    if (!subject) {
        alert("Please enter a subject");
        return;
    }
    if (!scored || scored <= 0) {
        alert("Please enter a valid scored marks");
        return;
    }
    if (!max || max <= 0) {
        alert("Please enter a valid max marks");
        return;
    }
    if (scored > max) {
        alert("Scored marks cannot be greater than max marks");
        return;
    }

    data.push({ subject, scored, max, date });
    save();
    updateSubjectSelect();
    subjectSelect.value = subject; // Auto-select the newly added subject
    drawChart();
    updateTrendAnalysis();

    // Clear inputs
    document.getElementById("subjectInput").value = "";
    document.getElementById("scoredInput").value = "";
    document.getElementById("maxInput").value = "";
    document.getElementById("dateInput").value = "";

    alert("Performance added successfully!");
}

function updateSubjectSelect() {
    const subjects = [...new Set(data.map(item => item.subject))];
    subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    subjects.forEach(sub => {
        const option = document.createElement("option");
        option.value = sub;
        option.textContent = sub;
        subjectSelect.appendChild(option);
    });
}

function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const selectedSubject = subjectSelect ? subjectSelect.value : "";
    if (!selectedSubject) {
        ctx.font = "18px Arial";
        ctx.fillStyle = isDark ? "#fff" : "#000";
        ctx.textAlign = "center";
        ctx.fillText("Select a subject to view performance", canvas.width / 2, canvas.height / 2);
        return;
    }

    const subjectData = data.filter(item => item.subject === selectedSubject).sort((a, b) => new Date(a.date) - new Date(b.date));

    if (subjectData.length === 0) return;

    const isDark = document.body.classList.contains("dark");
    const lineColor = isDark ? "#fff" : "#118ab2";
    const textColor = isDark ? "#fff" : "#000";
    const gridColor = isDark ? "#555" : "#ddd";

    ctx.font = "14px Arial";
    ctx.textAlign = "center";

    const padding = 60; // Increased padding for labels
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    // Draw axes
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Y-axis label
    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = textColor;
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Percentage (%)", 0, 0);
    ctx.restore();

    // X-axis label
    ctx.fillStyle = textColor;
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Date", canvas.width / 2, canvas.height - 10);

    // Draw grid lines for percentages
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 100; i += 20) {
        const y = canvas.height - padding - (i / 100) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
        ctx.fillStyle = textColor;
        ctx.font = "12px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`${i}%`, padding - 5, y + 3);
    }

    // Draw data points and line
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    subjectData.forEach((item, i) => {
        const percent = (item.scored / item.max) * 100;
        const x = padding + (i / Math.max(subjectData.length - 1, 1)) * chartWidth;
        const y = canvas.height - padding - (percent / 100) * chartHeight;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        // Draw point
        ctx.fillStyle = lineColor;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI); // Slightly larger points
        ctx.fill();

        // Draw percentage label above point
        ctx.fillStyle = textColor;
        ctx.font = "12px Arial";
        ctx.fillText(`${Math.round(percent)}%`, x, y - 10);

        // Draw date label below x-axis
        ctx.fillText(item.date, x, canvas.height - padding + 18);
    });

    ctx.stroke();

    // Title
    ctx.fillStyle = textColor;
    ctx.font = "18px Arial";
    ctx.fillText(`Performance in ${selectedSubject}`, canvas.width / 2, 35);
}

function clearAllData() {
    if (confirm("Are you sure you want to clear all performance data? This action cannot be undone.")) {
        data = [];
        save();
        updateSubjectSelect();
        drawChart();
        updateTrendAnalysis();
        alert("All performance data has been cleared.");
    }
}

function updateTrendAnalysis() {
    const trendDiv = document.getElementById("trendAnalysis");
    const selectedSubject = subjectSelect ? subjectSelect.value : "";
    if (!selectedSubject) {
        trendDiv.innerHTML = "<p>Select a subject to view trend analysis.</p>";
        return;
    }

    const subjectData = data.filter(item => item.subject === selectedSubject).sort((a, b) => new Date(a.date) - new Date(b.date));

    if (subjectData.length < 2) {
        trendDiv.innerHTML = "<p>Not enough data for trend analysis. Add more performance entries.</p>";
        return;
    }

    // Calculate percentages
    const percentages = subjectData.map(item => (item.scored / item.max) * 100);

    // Get latest and previous
    const latest = percentages[percentages.length - 1];
    const previous = percentages[percentages.length - 2];

    const difference = latest - previous;

    let trendMessage = "";
    let trendClass = "";

    if (difference > 5) {
        trendMessage = `🎉 Great improvement! Your latest score (${Math.round(latest)}%) is ${Math.round(difference)}% higher than the previous one (${Math.round(previous)}%).`;
        trendClass = "improvement";
    } else if (difference > 0) {
        trendMessage = `👍 Slight improvement! Your latest score (${Math.round(latest)}%) is ${Math.round(difference)}% higher than the previous one (${Math.round(previous)}%).`;
        trendClass = "improvement";
    } else if (difference < -5) {
        trendMessage = `📉 Significant downfall! Your latest score (${Math.round(latest)}%) is ${Math.round(Math.abs(difference))}% lower than the previous one (${Math.round(previous)}%). Consider reviewing your study methods.`;
        trendClass = "downfall";
    } else if (difference < 0) {
        trendMessage = `👎 Slight decline! Your latest score (${Math.round(latest)}%) is ${Math.round(Math.abs(difference))}% lower than the previous one (${Math.round(previous)}%).`;
        trendClass = "downfall";
    } else {
        trendMessage = `➡️ Steady performance! Your latest score (${Math.round(latest)}%) is the same as the previous one (${Math.round(previous)}%).`;
        trendClass = "steady";
    }

    trendDiv.innerHTML = `<p class="${trendClass}">${trendMessage}</p>`;

    // Add some CSS for the classes
    const style = document.createElement('style');
    style.textContent = `
        .improvement { color: #4CAF50; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3); }
        .downfall { color: #F44336; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3); }
        .steady { color: #FF9800; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3); }
        body.dark .improvement { color: #81C784; text-shadow: 1px 1px 2px rgba(255,255,255,0.3); }
        body.dark .downfall { color: #EF5350; text-shadow: 1px 1px 2px rgba(255,255,255,0.3); }
        body.dark .steady { color: #FFB74D; text-shadow: 1px 1px 2px rgba(255,255,255,0.3); }
    `;
    document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", () => {
    subjectSelect.addEventListener("change", () => {
        drawChart();
        updateTrendAnalysis();
    });
    updateSubjectSelect();
    drawChart();
    updateTrendAnalysis();

    // Set default date to today
    document.getElementById("dateInput").value = new Date().toISOString().split('T')[0];
});
