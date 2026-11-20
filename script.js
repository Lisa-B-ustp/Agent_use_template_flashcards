const wordPairs = [];
const pairForm = document.getElementById("word-pair-form");
const englishInput = document.getElementById("english-word");
const germanInput = document.getElementById("german-word");
const wordPairList = document.getElementById("word-pairs");

// Shows all saved word pairs in the list.
function renderWordPairs() {
  wordPairList.innerHTML = "";

  for (const pair of wordPairs) {
    const listItem = document.createElement("li");
    listItem.textContent = pair.english + " - " + pair.german;
    wordPairList.appendChild(listItem);
  }
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
  renderWordPairs();
}

pairForm.addEventListener("submit", handleWordPairSubmit);