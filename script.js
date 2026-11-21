const dogProfileForm = document.getElementById("dog-profile-form");
const exerciseForm = document.getElementById("exercise-form");
let exerciseRecords = {};

// Zeigt die gespeicherten Angaben unter dem Formular an.
function showDogProfile(profile) {
    const summary = document.getElementById("dog-profile-summary");
    summary.textContent = profile.name + ": " + profile.breed + ", "
        + profile.weight + " kg, " + profile.age + " Jahre alt.";
}

// Speichert die Formularwerte im Browser.
function saveDogProfile(event) {
    event.preventDefault();

    const profile = {
        name: document.getElementById("dog-name").value.trim(),
        weight: document.getElementById("dog-weight").value,
        breed: document.getElementById("dog-breed").value.trim(),
        age: document.getElementById("dog-age").value
    };

    localStorage.setItem("dogProfile", JSON.stringify(profile));
    showDogProfile(profile);
}

// Lädt ein bereits gespeichertes Profil beim Öffnen der Seite.
function loadDogProfile() {
    const savedProfile = localStorage.getItem("dogProfile");
    if (savedProfile === null) {
        return;
    }

    const profile = JSON.parse(savedProfile);
    document.getElementById("dog-name").value = profile.name;
    document.getElementById("dog-weight").value = profile.weight;
    document.getElementById("dog-breed").value = profile.breed;
    document.getElementById("dog-age").value = profile.age;
    showDogProfile(profile);
}

// Gibt das heutige Datum im Format des Datumsfeldes zurück.
function getLocalDate() {
    const currentDate = new Date();
    return formatLocalDate(currentDate);
}

// Formatiert ein Datum als Jahr-Monat-Tag.
function formatLocalDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
}

// Zeigt die gespeicherte Bewegungszeit von heute an.
function showTodayExercise() {
    const todayMinutes = exerciseRecords[getLocalDate()] || 0;
    document.getElementById("today-exercise").textContent = todayMinutes + " Minuten";
}

// Speichert die Bewegungszeit für das ausgewählte Datum.
function saveExercise(event) {
    event.preventDefault();

    const date = document.getElementById("exercise-date").value;
    const minutes = Number(document.getElementById("exercise-time").value);
    exerciseRecords[date] = minutes;
    localStorage.setItem("exerciseRecords", JSON.stringify(exerciseRecords));

    document.getElementById("exercise-save-message").textContent =
        "Bewegungszeit für " + date + " gespeichert.";
    showTodayExercise();
    drawExerciseChart();
}

// Lädt gespeicherte Bewegungseinträge und setzt das Datumsfeld auf heute.
function loadExerciseRecords() {
    const savedRecords = localStorage.getItem("exerciseRecords");
    if (savedRecords !== null) {
        exerciseRecords = JSON.parse(savedRecords);
    }

    document.getElementById("exercise-date").value = getLocalDate();
    showTodayExercise();
    drawExerciseChart();
}

// Fügt einen Balken mit Datum und Bewegungszeit zur Grafik hinzu.
function addChartBar(chartBars, date, minutes, maximumMinutes) {
    const dayColumn = document.createElement("div");
    const bar = document.createElement("div");
    const dayLabel = document.createElement("span");
    const dateLabel = date.toLocaleDateString("de-DE");

    dayColumn.className = "chart-day";
    dayColumn.setAttribute("role", "img");
    dayColumn.setAttribute("aria-label", dateLabel + ": " + minutes + " Minuten");
    bar.className = "chart-bar";
    bar.style.height = minutes === 0 ? "2%" : (minutes / maximumMinutes * 80) + "%";
    bar.title = dateLabel + ": " + minutes + " Minuten";
    dayLabel.textContent = date.getDate();

    dayColumn.appendChild(bar);
    dayColumn.appendChild(dayLabel);
    chartBars.appendChild(dayColumn);
}

// Findet den größten Bewegungswert der letzten 30 Tage.
function findMaximumMinutes() {
    let maximumMinutes = 0;

    for (let dayOffset = -29; dayOffset <= 0; dayOffset++) {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        const minutes = exerciseRecords[formatLocalDate(date)] || 0;
        if (minutes > maximumMinutes) {
            maximumMinutes = minutes;
        }
    }

    if (maximumMinutes === 0) {
        return 1;
    }
    return maximumMinutes;
}

// Erstellt die Balken für jeden der letzten 30 Tage.
function addLast30Days(chartBars, maximumMinutes) {
    for (let dayOffset = -29; dayOffset <= 0; dayOffset++) {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        const minutes = exerciseRecords[formatLocalDate(date)] || 0;
        addChartBar(chartBars, date, minutes, maximumMinutes);
    }
}

// Zeichnet die Bewegungswerte der letzten 30 Tage als Balken.
function drawExerciseChart() {
    const chart = document.getElementById("exercise-chart");
    const chartBars = document.createElement("div");

    chart.textContent = "";
    chartBars.className = "chart-bars";
    addLast30Days(chartBars, findMaximumMinutes());
    chart.appendChild(chartBars);
}

dogProfileForm.addEventListener("submit", saveDogProfile);
loadDogProfile();
exerciseForm.addEventListener("submit", saveExercise);
loadExerciseRecords();