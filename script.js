const dogProfileForm = document.getElementById("dog-profile-form");

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

dogProfileForm.addEventListener("submit", saveDogProfile);
loadDogProfile();