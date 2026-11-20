const pairForm = document.getElementById("word-pair-form");
const englishInput = document.getElementById("english-word");
const germanInput = document.getElementById("german-word");
const wordPairList = document.getElementById("word-pairs");
const practiceWord = document.getElementById("practice-word");
const practiceAnswer = document.getElementById("practice-answer");
const revealAnswerButton = document.getElementById("reveal-answer");
const nextCardButton = document.getElementById("next-card");
const knewItButton = document.getElementById("knew-it");
const knewItCount = document.getElementById("knew-it-count");
const wordPairs = loadWordPairs();
let practiceIndex = 0;
let knewItTotal = 0;

// Loads saved word pairs from browser storage.
function loadWordPairs() {
  const savedPairs = localStorage.getItem("wordPairs");

  if (savedPairs === null) {
    return [];
  }

  return JSON.parse(savedPairs);
}

// Saves all word pairs in browser storage.
function saveWordPairs() {
  localStorage.setItem("wordPairs", JSON.stringify(wordPairs));
}

// Shows all saved word pairs in the list.
function renderWordPairs() {
  wordPairList.innerHTML = "";

  for (let index = 0; index < wordPairs.length; index++) {
    const pair = wordPairs[index];
    const listItem = document.createElement("li");
    const pairText = document.createElement("span");
    const deleteButton = document.createElement("button");

    pairText.textContent = pair.english + " - " + pair.german;
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", function () {
      deleteWordPair(index);
    });

    listItem.appendChild(pairText);
    listItem.appendChild(deleteButton);
    wordPairList.appendChild(listItem);
  }
}

// Removes one word pair and redraws the list.
function deleteWordPair(index) {
  wordPairs.splice(index, 1);

  if (practiceIndex >= wordPairs.length) {
    practiceIndex = 0;
  }

  saveWordPairs();
  renderWordPairs();
  showPracticeCard();
}

// Shows the English word and hides the German answer.
function showPracticeCard() {
  practiceAnswer.textContent = "";
  revealAnswerButton.textContent = "Antwort zeigen";

  if (wordPairs.length === 0) {
    practiceWord.textContent = "Keine Karte vorhanden.";
    revealAnswerButton.disabled = true;
    nextCardButton.disabled = true;
    knewItButton.disabled = true;
    return;
  }

  practiceWord.textContent = wordPairs[practiceIndex].english;
  revealAnswerButton.disabled = false;
  nextCardButton.disabled = wordPairs.length < 2;
  knewItButton.disabled = false;
}

// Toggles the German translation for the current card.
function revealPracticeAnswer() {
  if (wordPairs.length === 0) {
    return;
  }

  if (practiceAnswer.textContent === "") {
    practiceAnswer.textContent = wordPairs[practiceIndex].german;
    revealAnswerButton.textContent = "Antwort verbergen";
  } else {
    practiceAnswer.textContent = "";
    revealAnswerButton.textContent = "Antwort zeigen";
  }
}

// Shows a random card that is different from the current card.
function showNextCard() {
  if (wordPairs.length < 2) {
    return;
  }

  let nextIndex = practiceIndex;

  while (nextIndex === practiceIndex) {
    nextIndex = Math.floor(Math.random() * wordPairs.length);
  }

  practiceIndex = nextIndex;
  showPracticeCard();
}

// Counts one card as known for this session.
function countKnownCard() {
  if (wordPairs.length === 0) {
    return;
  }

  knewItTotal = knewItTotal + 1;
  knewItCount.textContent = "Gewusst: " + knewItTotal;
}

// Adds a valid word pair to memory and clears the form.
function handleWordPairSubmit(event) {
  event.preventDefault();
  const englishWord = englishInput.value.trim();
  const germanWord = germanInput.value.trim();

  if (englishWord === "") {
    englishInput.value = "";
    englishInput.reportValidity();
    return;
  }
  if (germanWord === "") {
    germanInput.value = "";
    germanInput.reportValidity();
    return;
  }

  wordPairs.push({ english: englishWord, german: germanWord });
  pairForm.reset();
  saveWordPairs();
  renderWordPairs();
  showPracticeCard();
}

pairForm.addEventListener("submit", handleWordPairSubmit);
revealAnswerButton.addEventListener("click", revealPracticeAnswer);
nextCardButton.addEventListener("click", showNextCard);
knewItButton.addEventListener("click", countKnownCard);
renderWordPairs();
showPracticeCard();