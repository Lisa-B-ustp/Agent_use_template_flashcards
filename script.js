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
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return currentDate.getFullYear() + "-" + month + "-" + day;
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
}

// Lädt gespeicherte Bewegungseinträge und setzt das Datumsfeld auf heute.
function loadExerciseRecords() {
    const savedRecords = localStorage.getItem("exerciseRecords");
    if (savedRecords !== null) {
        exerciseRecords = JSON.parse(savedRecords);
    }

    document.getElementById("exercise-date").value = getLocalDate();
    showTodayExercise();
}

dogProfileForm.addEventListener("submit", saveDogProfile);
loadDogProfile();
exerciseForm.addEventListener("submit", saveExercise);
loadExerciseRecords();