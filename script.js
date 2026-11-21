const dogProfileForm = document.getElementById("dog-profile-form");
const exerciseForm = document.getElementById("exercise-form");
const weightForm = document.getElementById("weight-form");
const dogProfileSelect = document.getElementById("dog-profile-select");
const newDogProfileButton = document.getElementById("new-dog-profile-button");
let dogProfiles = [];
let activeDogProfileId = "";
let creatingNewProfile = false;
let exerciseRecords = {};
let weightRecords = {};

// Zeigt die gespeicherten Angaben unter dem Formular an.
function showDogProfile(profile) {
    const summary = document.getElementById("dog-profile-summary");
    summary.textContent = profile.name + ": " + profile.breed + ", "
        + profile.age + " Jahre alt.";
}

// Findet ein Profil anhand seiner eindeutigen Kennung.
function findDogProfile(profileId) {
    for (let index = 0; index < dogProfiles.length; index++) {
        if (dogProfiles[index].id === profileId) {
            return dogProfiles[index];
        }
    }
    return null;
}

// Lädt alte gespeicherte Daten oder gibt ein leeres Objekt zurück.
function loadLegacyData(key) {
    const savedData = localStorage.getItem(key);
    if (savedData === null) {
        return {};
    }
    return JSON.parse(savedData);
}

// Prüft, ob noch Daten aus der bisherigen Einzelprofil-Version vorhanden sind.
function hasLegacyData() {
    return localStorage.getItem("dogProfile") !== null
        || localStorage.getItem("exerciseRecords") !== null
        || localStorage.getItem("weightRecords") !== null;
}

// Fasst das bisherige Profil und seine Messwerte zu einem Profil zusammen.
function createMigratedProfile() {
    const savedProfile = loadLegacyData("dogProfile");
    return {
        id: "dog-1",
        name: savedProfile.name || "Mein Hund",
        breed: savedProfile.breed || "",
        age: savedProfile.age || "",
        exerciseRecords: loadLegacyData("exerciseRecords"),
        weightRecords: loadLegacyData("weightRecords")
    };
}

// Übernimmt vorhandene Einzelprofil-Daten einmalig in die neue Struktur.
function migrateExistingData() {
    if (localStorage.getItem("dogProfiles") !== null || !hasLegacyData()) {
        return;
    }

    const firstProfile = createMigratedProfile();
    dogProfiles.push(firstProfile);
    activeDogProfileId = firstProfile.id;
    saveDogProfiles();
}

// Speichert alle Profile und das aktuell ausgewählte Profil.
function saveDogProfiles() {
    localStorage.setItem("dogProfiles", JSON.stringify(dogProfiles));
    if (activeDogProfileId !== "") {
        localStorage.setItem("activeDogProfileId", activeDogProfileId);
    }
}

// Füllt die Profilauswahl mit den gespeicherten Hunden.
function populateDogProfileSelect() {
    dogProfileSelect.options.length = 1;
    for (let index = 0; index < dogProfiles.length; index++) {
        const option = document.createElement("option");
        option.value = dogProfiles[index].id;
        option.textContent = dogProfiles[index].name || "Neues Profil";
        dogProfileSelect.appendChild(option);
    }
    dogProfileSelect.value = activeDogProfileId;
}

// Aktiviert oder deaktiviert die Messformulare.
function setMeasurementFormsDisabled(isDisabled) {
    for (let index = 0; index < exerciseForm.elements.length; index++) {
        exerciseForm.elements[index].disabled = isDisabled;
    }
    for (let index = 0; index < weightForm.elements.length; index++) {
        weightForm.elements[index].disabled = isDisabled;
    }
}

// Bereitet die Seite für das Erstellen eines neuen Profils vor.
function startNewProfile() {
    creatingNewProfile = true;
    activeDogProfileId = "";
    dogProfileSelect.value = "";
    dogProfileForm.reset();
    exerciseForm.reset();
    weightForm.reset();
    exerciseRecords = {};
    weightRecords = {};
    setMeasurementFormsDisabled(true);
    document.getElementById("dog-profile-summary").textContent =
        "Neues Profil ausfüllen und speichern.";
    document.getElementById("today-exercise").textContent = "0 Minuten";
    document.getElementById("exercise-chart").textContent =
        "Speichere zuerst das neue Profil, um Messwerte einzutragen.";
}

// Füllt das Profilformular mit den Angaben eines Hundes.
function fillDogProfileForm(profile) {
    document.getElementById("dog-name").value = profile.name;
    document.getElementById("dog-breed").value = profile.breed;
    document.getElementById("dog-age").value = profile.age;
    showDogProfile(profile);
}

// Lädt Bewegungs- und Gewichtswerte des ausgewählten Hundes.
function loadProfileMeasurements(profile) {
    exerciseRecords = profile.exerciseRecords || {};
    weightRecords = profile.weightRecords || {};
    profile.exerciseRecords = exerciseRecords;
    profile.weightRecords = weightRecords;
    setMeasurementFormsDisabled(false);
    document.getElementById("exercise-date").value = getLocalDate();
    document.getElementById("weight-date").value = getLocalDate();
    document.getElementById("exercise-time").value = "";
    document.getElementById("weight-value").value = "";
    document.getElementById("exercise-save-message").textContent = "";
    document.getElementById("weight-save-message").textContent = "";
    showTodayExercise();
    drawExerciseChart();
}

// Zeigt das Formular und die Messwerte eines Profils an.
function loadActiveDogProfile(profileId) {
    const profile = findDogProfile(profileId);
    if (profile === null) {
        startNewProfile();
        return;
    }

    activeDogProfileId = profile.id;
    creatingNewProfile = false;
    localStorage.setItem("activeDogProfileId", activeDogProfileId);
    populateDogProfileSelect();
    fillDogProfileForm(profile);
    loadProfileMeasurements(profile);
}

// Lädt gespeicherte Profile und wählt das zuletzt verwendete aus.
function loadDogProfiles() {
    const savedProfiles = localStorage.getItem("dogProfiles");
    if (savedProfiles !== null) {
        dogProfiles = JSON.parse(savedProfiles);
    }

    const savedProfileId = localStorage.getItem("activeDogProfileId");
    if (dogProfiles.length === 0) {
        startNewProfile();
    } else if (findDogProfile(savedProfileId) !== null) {
        loadActiveDogProfile(savedProfileId);
    } else {
        loadActiveDogProfile(dogProfiles[0].id);
    }
}

// Wechselt zum im Auswahlfeld ausgewählten Hund.
function changeDogProfile() {
    if (dogProfileSelect.value !== "") {
        loadActiveDogProfile(dogProfileSelect.value);
    }
}

// Gibt die Werte aus dem Profilformular zurück.
function getDogProfileFormValues() {
    return {
        name: document.getElementById("dog-name").value.trim(),
        breed: document.getElementById("dog-breed").value.trim(),
        age: document.getElementById("dog-age").value
    };
}

// Gibt ein bestehendes Profil zurück oder erstellt einen neuen Datensatz.
function getProfileToSave() {
    if (!creatingNewProfile) {
        return findDogProfile(activeDogProfileId);
    }

    const profile = {
        id: "dog-" + (dogProfiles.length + 1),
        name: "",
        breed: "",
        age: "",
        exerciseRecords: {},
        weightRecords: {}
    };
    dogProfiles.push(profile);
    return profile;
}

// Speichert ein neues oder geändertes Hundprofil.
function saveDogProfile(event) {
    event.preventDefault();

    const profile = getProfileToSave();
    if (profile === null) {
        document.getElementById("dog-profile-summary").textContent =
            "Bitte wähle ein Profil oder erstelle ein neues.";
        return;
    }

    const formValues = getDogProfileFormValues();
    profile.name = formValues.name;
    profile.breed = formValues.breed;
    profile.age = formValues.age;
    activeDogProfileId = profile.id;
    creatingNewProfile = false;
    saveDogProfiles();
    loadActiveDogProfile(profile.id);
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

    const profile = findDogProfile(activeDogProfileId);
    if (profile === null) {
        document.getElementById("exercise-save-message").textContent =
            "Bitte wähle zuerst ein Hundprofil aus.";
        return;
    }

    const date = document.getElementById("exercise-date").value;
    const minutes = Number(document.getElementById("exercise-time").value);
    exerciseRecords[date] = minutes;
    profile.exerciseRecords = exerciseRecords;
    saveDogProfiles();

    document.getElementById("exercise-save-message").textContent =
        "Bewegungszeit für " + date + " gespeichert.";
    showTodayExercise();
    drawExerciseChart();
}

// Speichert das Gewicht für das ausgewählte Datum.
function saveWeight(event) {
    event.preventDefault();

    const profile = findDogProfile(activeDogProfileId);
    if (profile === null) {
        document.getElementById("weight-save-message").textContent =
            "Bitte wähle zuerst ein Hundprofil aus.";
        return;
    }

    const date = document.getElementById("weight-date").value;
    const weight = Number(document.getElementById("weight-value").value);
    weightRecords[date] = weight;
    profile.weightRecords = weightRecords;
    saveDogProfiles();

    document.getElementById("weight-save-message").textContent =
        "Gewicht für " + date + " gespeichert.";
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

// Sammelt die Gewichtsmessungen innerhalb der letzten 30 Tage.
function getWeightMeasurements() {
    const measurements = [];
    for (let dayOffset = -29; dayOffset <= 0; dayOffset++) {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        const weight = weightRecords[formatLocalDate(date)];
        if (weight !== undefined) {
            measurements.push({
                date: date,
                dayIndex: dayOffset + 29,
                weight: Number(weight)
            });
        }
    }
    return measurements;
}

// Findet den kleinsten und größten erfassten Gewichtswert.
function findWeightRange(measurements) {
    let minimum = measurements[0].weight;
    let maximum = measurements[0].weight;
    for (let index = 1; index < measurements.length; index++) {
        const weight = measurements[index].weight;
        if (weight < minimum) {
            minimum = weight;
        }
        if (weight > maximum) {
            maximum = weight;
        }
    }
    return { minimum: minimum, maximum: maximum };
}

// Berechnet die Höhe eines Gewichtspunktes auf der eigenen Skala.
function getWeightPointY(weight, weightRange) {
    if (weightRange.maximum === weightRange.minimum) {
        return 50;
    }
    return 90 - (weight - weightRange.minimum)
        / (weightRange.maximum - weightRange.minimum) * 80;
}

// Berechnet die Positionen aller Gewichtsmessungen in der Grafik.
function getWeightLinePoints(measurements) {
    const weightRange = findWeightRange(measurements);
    const points = [];
    for (let index = 0; index < measurements.length; index++) {
        const measurement = measurements[index];
        points.push({
            x: measurement.dayIndex * 10 + 5,
            y: getWeightPointY(measurement.weight, weightRange),
            date: measurement.date,
            weight: measurement.weight
        });
    }
    return points;
}

// Erstellt ein SVG-Element für die Gewichtslinie.
function createSvgElement(elementName) {
    return document.createElementNS("http://www.w3.org/2000/svg", elementName);
}

// Fügt einen beschrifteten Gewichtspunkt zur Linie hinzu.
function addWeightPoint(weightLine, point) {
    const circle = createSvgElement("circle");
    const title = createSvgElement("title");
    const dateLabel = point.date.toLocaleDateString("de-DE");
    circle.setAttribute("cx", point.x);
    circle.setAttribute("cy", point.y);
    circle.setAttribute("r", "4");
    circle.setAttribute("aria-label", dateLabel + ": " + point.weight + " kg");
    title.textContent = dateLabel + ": " + point.weight + " kg";
    circle.appendChild(title);
    weightLine.appendChild(circle);
}

// Erstellt die Linie und ihre beschrifteten Messpunkte.
function createWeightLine(points) {
    const weightLine = createSvgElement("svg");
    const polyline = createSvgElement("polyline");
    const linePoints = [];
    weightLine.setAttribute("viewBox", "0 0 300 100");
    weightLine.setAttribute("class", "weight-line");
    weightLine.setAttribute("role", "img");
    weightLine.setAttribute("aria-label", "Gewicht in Kilogramm auf eigener Skala");
    weightLine.setAttribute("preserveAspectRatio", "none");
    for (let index = 0; index < points.length; index++) {
        linePoints.push(points[index].x + "," + points[index].y);
    }
    polyline.setAttribute("points", linePoints.join(" "));
    weightLine.appendChild(polyline);
    for (let index = 0; index < points.length; index++) {
        addWeightPoint(weightLine, points[index]);
    }
    return weightLine;
}

// Zeichnet die gespeicherten Gewichte als Linie über die Balken.
function drawWeightLine(chartBars) {
    const measurements = getWeightMeasurements();
    if (measurements.length === 0) {
        return;
    }
    const points = getWeightLinePoints(measurements);
    chartBars.appendChild(createWeightLine(points));
}

// Zeichnet die Bewegungswerte der letzten 30 Tage als Balken.
function drawExerciseChart() {
    const chart = document.getElementById("exercise-chart");
    const chartBars = document.createElement("div");

    chart.textContent = "";
    chartBars.className = "chart-bars";
    addLast30Days(chartBars, findMaximumMinutes());
    drawWeightLine(chartBars);
    chart.appendChild(chartBars);
}

migrateExistingData();
dogProfileForm.addEventListener("submit", saveDogProfile);
dogProfileSelect.addEventListener("change", changeDogProfile);
newDogProfileButton.addEventListener("click", startNewProfile);
exerciseForm.addEventListener("submit", saveExercise);
weightForm.addEventListener("submit", saveWeight);
loadDogProfiles();