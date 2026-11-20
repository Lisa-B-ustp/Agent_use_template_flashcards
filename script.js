const wordPairs = [];
const pairForm = document.getElementById("word-pair-form");
const englishInput = document.getElementById("english-word");
const germanInput = document.getElementById("german-word");

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
}

pairForm.addEventListener("submit", handleWordPairSubmit);