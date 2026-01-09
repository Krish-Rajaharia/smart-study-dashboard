const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// DEFAULT TIMES (used only first time)
const defaultTimes = [
  "09:30–10:20",
  "10:20–11:10",
  "11:10–12:00",
  "13:00–13:50",
  "13:50–14:40",
  "14:40–15:30",
  "15:30–16:20",
];

// Load from storage
let saved = JSON.parse(localStorage.getItem("timetable")) || {};
let times = saved.times || defaultTimes;
let tableData = saved.data || {};

function save() {
  localStorage.setItem("timetable", JSON.stringify({ times, data: tableData }));
}

function buildTimetable() {
  const headRow = document.getElementById("timeRow");
  const body = document.getElementById("timetableBody");

  /* ---------- HEADER (EDITABLE TIME SLOTS) ---------- */
  headRow.innerHTML = "<th>Day / Time</th>";

  times.forEach((time, index) => {
    const th = document.createElement("th");
    th.contentEditable = true;
    th.innerText = time;

    th.oninput = () => {
      times[index] = th.innerText.trim();
      save();
    };

    headRow.appendChild(th);
  });

  /* ---------- BODY ---------- */
  body.innerHTML = "";

  days.forEach((day) => {
    const row = document.createElement("tr");

    const dayCell = document.createElement("th");
    dayCell.innerText = day;
    row.appendChild(dayCell);

    times.forEach((time) => {
      const td = document.createElement("td");
      td.contentEditable = true;
      const value = tableData?.[day]?.[time] || "";
      td.innerText = value;
      if (!value) td.classList.add("empty-cell");

      td.oninput = () => {
        td.classList.remove("empty-cell");
        tableData[day] = tableData[day] || {};
        tableData[day][time] = td.innerText.trim();
        save();
      };

      row.appendChild(td);
    });

    body.appendChild(row);
  });
}

buildTimetable();

function clearTimetable() {
  if (!confirm("Are you sure you want to clear the entire timetable?")) return;

  tableData = {};
  save();
  buildTimetable();
}
