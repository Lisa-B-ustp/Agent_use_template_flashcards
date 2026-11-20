const storageKey = "augenzeit-data";
const notice = document.querySelector("#notice");
const profileForm = document.querySelector("#profile-form");
const manualForm = document.querySelector("#manual-form");
const timerButton = document.querySelector("#timer-button");
const eyeButtons = document.querySelectorAll(".eye-button");
const rangeButtons = document.querySelectorAll(".range-button");

// Reads saved profile and session data from this device.
function loadData() {
  const savedData = localStorage.getItem(storageKey);
  if (!savedData) {
    return { profile: null, sessions: [], timerStart: null };
  }

  try {
    return JSON.parse(savedData);
  } catch {
    showNotice("Gespeicherte Daten konnten nicht gelesen werden. Bitte prüfe den Browserspeicher.");
    return { profile: null, sessions: [], timerStart: null };
  }
}

let appData = loadData();
let selectedEye = appData.profile ? appData.profile.eye : "left";
let chartDays = 7;
let timerInterval = null;

// Shows an error or confirmation message above the dashboard.
function showNotice(message) {
  notice.textContent = message;
  notice.classList.add("is-visible");
}

// Saves the current profile, timer, and therapy sessions locally.
function saveData() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(appData));
    return true;
  } catch {
    showNotice("Daten konnten nicht gespeichert werden. Prüfe bitte den Browserspeicher.");
    return false;
  }
}

// Returns today's date in the local YYYY-MM-DD format.
function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// Displays a date in a friendly German format.
function formatDate(dateKey, options) {
  return new Intl.DateTimeFormat("de-DE", options).format(new Date(dateKey + "T12:00:00"));
}

// Converts seconds into hours and minutes for the dashboard.
function formatDuration(seconds) {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (totalMinutes === 0 && seconds > 0) return Math.floor(seconds) + " Sek.";
  if (hours === 0) return minutes + " Min.";
  if (minutes === 0) return hours + " Std.";
  return hours + " Std. " + minutes + " Min.";
}

// Converts seconds into the timer's HH:MM:SS display.
function formatClock(seconds) {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const remainingSeconds = String(seconds % 60).padStart(2, "0");
  return hours + ":" + minutes + ":" + remainingSeconds;
}

// Totals all sessions recorded on a particular date.
function getDailySeconds(dateKey) {
  return appData.sessions.reduce(function (total, session) {
    return session.date === dateKey ? total + session.durationSeconds : total;
  }, 0);
}

// Updates the greeting and all saved profile fields.
function renderProfile() {
  const profile = appData.profile;
  if (!profile) return;
  document.querySelector("#welcome-title").textContent = "Hallo, " + profile.name + "!";
  document.querySelector("#child-name").value = profile.name;
  document.querySelector("#start-date").value = profile.startDate;
  document.querySelector("#goal-hours").value = profile.goalHours;
  renderEyeChoice();
}

// Highlights the chosen eye in the buttons and face illustration.
function renderEyeChoice() {
  eyeButtons.forEach(function (button) {
    const isSelected = button.dataset.eye === selectedEye;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
  document.querySelectorAll("[data-face-eye]").forEach(function (eye) {
    eye.classList.toggle("is-patched", eye.dataset.faceEye === selectedEye);
  });
}

// Refreshes the current timer display and its accessible labels.
function renderTimer() {
  const isRunning = Boolean(appData.timerStart);
  const elapsed = isRunning ? Math.floor((Date.now() - appData.timerStart) / 1000) : 0;
  document.querySelector("#timer-display").textContent = formatClock(elapsed);
  document.querySelector("#timer-status").textContent = isRunning ? "Therapie läuft" : "Timer bereit";
  document.querySelector("#timer-hint").textContent = isRunning ? "Der Timer läuft seit dem Start." : "Starte den Timer, wenn das Pflaster sitzt.";
  document.querySelector("#timer-indicator").classList.toggle("is-running", isRunning);
  timerButton.textContent = isRunning ? "Timer stoppen & speichern" : "Timer starten";
  timerButton.classList.toggle("is-stopping", isRunning);
}

// Updates today's completed time and the daily goal progress bar.
function renderProgress() {
  const goalHours = appData.profile ? Number(appData.profile.goalHours) : 2;
  const goalSeconds = goalHours * 3600;
  const completedSeconds = getDailySeconds(getDateKey(new Date()));
  const percentage = Math.min(100, Math.round((completedSeconds / goalSeconds) * 100));
  document.querySelector("#today-date").textContent = formatDate(getDateKey(new Date()), { day: "numeric", month: "long" });
  document.querySelector("#today-duration").textContent = formatDuration(completedSeconds);
  document.querySelector("#daily-goal").textContent = formatDuration(goalSeconds);
  document.querySelector("#progress-percent").textContent = percentage + " %";
  document.querySelector("#progress-fill").style.width = percentage + "%";
  document.querySelector("#progress-track").setAttribute("aria-valuenow", String(percentage));
  document.querySelector("#progress-caption").textContent = percentage >= 100 ? "Tagesziel geschafft – toll gemacht!" : "Noch ein Stück bis zum Tagesziel";
}

// Calculates the weekly average, achievement rate, and overall totals.
function renderStatistics() {
  const goalSeconds = appData.profile ? Number(appData.profile.goalHours) * 3600 : 7200;
  const weeklySummary = calculateWeeklySummary(goalSeconds);
  const successfulDays = getSuccessfulDayCount(goalSeconds);
  const totalSeconds = appData.sessions.reduce(function (sum, session) { return sum + session.durationSeconds; }, 0);
  document.querySelector("#weekly-average").textContent = formatDuration(weeklySummary.total / 7);
  document.querySelector("#weekly-rate").textContent = Math.round((weeklySummary.successes / 7) * 100) + " %";
  document.querySelector("#average-fill").style.width = Math.min(100, (weeklySummary.total / 7 / goalSeconds) * 100) + "%";
  document.querySelector("#rate-fill").style.width = (weeklySummary.successes / 7) * 100 + "%";
  document.querySelector("#total-hours").textContent = formatDuration(totalSeconds);
  document.querySelector("#successful-days").textContent = String(successfulDays);
  document.querySelector("#streak-days").textContent = String(calculateStreak(goalSeconds));
}

// Calculates recent therapy time and successful days for the weekly summary.
function calculateWeeklySummary(goalSeconds) {
  const today = new Date();
  const weeklyDates = [];
  for (let offset = 0; offset < 7; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    weeklyDates.push(getDateKey(date));
  }
  const weeklyTotal = weeklyDates.reduce(function (sum, date) { return sum + getDailySeconds(date); }, 0);
  const weeklySuccesses = weeklyDates.filter(function (date) { return getDailySeconds(date) >= goalSeconds; }).length;
  return { total: weeklyTotal, successes: weeklySuccesses };
}

// Counts the distinct dates on which the prescribed goal was reached.
function getSuccessfulDayCount(goalSeconds) {
  const successfulDays = new Set(appData.sessions.filter(function (session) {
    return getDailySeconds(session.date) >= goalSeconds;
  }).map(function (session) { return session.date; }));
  return successfulDays.size;
}

// Counts consecutive goal days ending today or yesterday.
function calculateStreak(goalSeconds) {
  let date = new Date();
  if (getDailySeconds(getDateKey(date)) < goalSeconds) date.setDate(date.getDate() - 1);
  let streak = 0;
  while (getDailySeconds(getDateKey(date)) >= goalSeconds) {
    streak += 1;
    date.setDate(date.getDate() - 1);
  }
  return streak;
}

// Builds a daily bar chart with the prescribed goal shown as a target line.
function renderChart() {
  const today = new Date();
  const dates = [];
  for (let offset = chartDays - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    dates.push(getDateKey(date));
  }
  const goalHours = appData.profile ? Number(appData.profile.goalHours) : 2;
  const values = dates.map(function (date) { return getDailySeconds(date) / 3600; });
  const scaleMax = Math.max(1, Math.ceil(Math.max(goalHours, ...values)));
  document.querySelector("#chart-container").innerHTML = buildChartSvg(dates, values, goalHours, scaleMax);
}

// Creates the responsive SVG chart and its date labels.
function buildChartSvg(dates, values, goalHours, scaleMax) {
  const chartBottom = 218;
  const chartHeight = 200;
  const step = 620 / dates.length;
  const barWidth = Math.min(40, step * 0.55);
  const targetY = chartBottom - (goalHours / scaleMax) * chartHeight;
  const chartMarks = buildChartMarks(dates, values, scaleMax, chartBottom, chartHeight, step, barWidth);
  return '<svg viewBox="0 0 700 265" aria-hidden="true">' +
    '<line x1="48" y1="' + chartBottom + '" x2="680" y2="' + chartBottom + '" stroke="#e9eef4"/>' +
    '<polyline points="' + chartMarks.points.trim() + '" fill="none" stroke="#4f8ef7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>' +
    chartMarks.bars +
    '<line x1="48" y1="' + targetY + '" x2="680" y2="' + targetY + '" stroke="#e8a24d" stroke-width="2" stroke-dasharray="6 5"/>' +
    '<text x="3" y="' + (targetY - 5) + '">' + goalHours + " Std.</text>" +
    chartMarks.labels + "</svg>";
}

// Creates the bar, line, and date-label SVG elements for the chart.
function buildChartMarks(dates, values, scaleMax, chartBottom, chartHeight, step, barWidth) {
  let bars = "";
  let points = "";
  let labels = "";
  dates.forEach(function (date, index) {
    const x = 56 + step * index + step / 2;
    const barHeight = (values[index] / scaleMax) * chartHeight;
    const y = chartBottom - barHeight;
    bars += '<rect x="' + (x - barWidth / 2) + '" y="' + y + '" width="' + barWidth + '" height="' + barHeight + '" rx="5" fill="#79aaf7"><title>' + formatDate(date, { day: "numeric", month: "short" }) + ": " + formatDuration(getDailySeconds(date)) + "</title></rect>";
    points += x + "," + y + " ";
    if (dates.length <= 7 || index % 5 === 0 || index === dates.length - 1) {
      labels += '<text x="' + x + '" y="247" text-anchor="middle">' + formatDate(date, { day: "numeric", month: "numeric" }) + "</text>";
    }
  });
  return { bars: bars, points: points, labels: labels };
}

// Displays every session from newest to oldest with its day's goal status.
function renderHistory() {
  const list = document.querySelector("#session-list");
  const emptyMessage = document.querySelector("#empty-history");
  const sessions = appData.sessions.slice().sort(function (first, second) {
    return second.start.localeCompare(first.start);
  });
  list.replaceChildren();
  document.querySelector("#session-count").textContent = sessions.length + (sessions.length === 1 ? " Eintrag" : " Einträge");
  emptyMessage.hidden = sessions.length > 0;
  sessions.forEach(function (session) {
    list.appendChild(createSessionItem(session));
  });
}

// Creates one safe-to-display therapy session row.
function createSessionItem(session) {
  const goalSeconds = appData.profile ? Number(appData.profile.goalHours) * 3600 : 7200;
  const item = document.createElement("li");
  const details = document.createElement("div");
  const date = document.createElement("p");
  const meta = document.createElement("p");
  const duration = document.createElement("span");
  const status = document.createElement("span");
  const isComplete = getDailySeconds(session.date) >= goalSeconds;
  item.className = "session-item";
  date.className = "session-date";
  date.textContent = formatDate(session.date, { weekday: "short", day: "numeric", month: "long" });
  meta.className = "session-meta";
  meta.textContent = session.source === "timer" ? "Timer" : "Manuell eingetragen";
  duration.className = "session-duration";
  duration.textContent = formatDuration(session.durationSeconds);
  status.className = "goal-status " + (isComplete ? "is-complete" : "is-incomplete");
  status.textContent = isComplete ? "✓ Ziel erreicht" : "Ziel nicht erreicht";
  details.append(date, meta);
  item.append(details, duration, status);
  return item;
}

// Renders all dashboard sections after profile or session data changes.
function renderDashboard() {
  renderProfile();
  renderEyeChoice();
  renderTimer();
  renderProgress();
  renderStatistics();
  renderHistory();
  renderChart();
}

// Selects an eye and saves the change when a profile already exists.
function selectEye(eye) {
  selectedEye = eye;
  renderEyeChoice();
  if (appData.profile) {
    appData.profile.eye = eye;
    saveData();
  }
}

// Starts the timer or saves its elapsed time as a new session.
function toggleTimer() {
  if (!appData.timerStart) {
    appData.timerStart = Date.now();
    saveData();
  } else {
    const endTime = Date.now();
    const startTime = Number(appData.timerStart);
    appData.sessions.push({
      start: new Date(startTime).toISOString(),
      end: new Date(endTime).toISOString(),
      date: getDateKey(new Date(startTime)),
      durationSeconds: Math.floor((endTime - startTime) / 1000),
      source: "timer"
    });
    appData.timerStart = null;
    saveData();
    renderDashboard();
  }
  renderTimer();
  renderProgress();
  if (appData.timerStart) timerInterval = setInterval(renderTimer, 1000);
  if (!appData.timerStart && timerInterval) clearInterval(timerInterval);
}

// Saves a manual therapy duration for the selected date.
function addManualSession(event) {
  event.preventDefault();
  const hours = Number(document.querySelector("#manual-hours").value);
  const minutes = Number(document.querySelector("#manual-minutes").value);
  const durationSeconds = (hours * 60 + minutes) * 60;
  const date = document.querySelector("#manual-date").value;
  if (durationSeconds <= 0 || !date) {
    showNotice("Bitte gib eine Dauer von mindestens einer Minute und ein Datum ein.");
    return;
  }
  appData.sessions.push({
    start: new Date(date + "T12:00:00").toISOString(),
    end: new Date(date + "T12:00:00").toISOString(),
    date: date,
    durationSeconds: durationSeconds,
    source: "manual"
  });
  const saved = saveData();
  manualForm.reset();
  document.querySelector("#manual-date").value = getDateKey(new Date());
  document.querySelector("#manual-hours").value = "0";
  document.querySelector("#manual-minutes").value = "30";
  if (saved) notice.classList.remove("is-visible");
  renderDashboard();
}

// Saves the child's name, therapy start date, goal, and patched eye.
function saveProfile(event) {
  event.preventDefault();
  appData.profile = {
    name: document.querySelector("#child-name").value.trim(),
    startDate: document.querySelector("#start-date").value,
    goalHours: Number(document.querySelector("#goal-hours").value),
    eye: selectedEye
  };
  const saved = saveData();
  if (saved) notice.classList.remove("is-visible");
  renderDashboard();
}

// Initializes saved values, date inputs, and dashboard event handlers.
function initializeDashboard() {
  document.querySelector("#manual-date").value = getDateKey(new Date());
  if (!appData.profile) document.querySelector("#start-date").value = getDateKey(new Date());
  profileForm.addEventListener("submit", saveProfile);
  manualForm.addEventListener("submit", addManualSession);
  timerButton.addEventListener("click", toggleTimer);
  eyeButtons.forEach(function (button) {
    button.addEventListener("click", function () { selectEye(button.dataset.eye); });
  });
  rangeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      chartDays = Number(button.dataset.days);
      rangeButtons.forEach(function (rangeButton) {
        const isSelected = rangeButton === button;
        rangeButton.classList.toggle("is-selected", isSelected);
        rangeButton.setAttribute("aria-pressed", String(isSelected));
      });
      renderChart();
    });
  });
  renderDashboard();
  if (appData.timerStart) timerInterval = setInterval(renderTimer, 1000);
}

initializeDashboard();
