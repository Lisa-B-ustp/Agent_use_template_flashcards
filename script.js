const wordPairs = [];
const pairForm = document.getElementById("word-pair-form");
const englishInput = document.getElementById("english-word");
const germanInput = document.getElementById("german-word");
const wordPairList = document.getElementById("word-pairs");

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
  renderWordPairs();
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