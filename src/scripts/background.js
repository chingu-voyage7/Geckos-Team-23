// basic fetching of word
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.word) {
    const DICT_API = "d1a139c7-2cc9-4efb-99cd-5c339d14d200";
    const URL = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${
      request.word
    }?key=${DICT_API}`;

    fetch(URL)
      .then(response => response.json())
      .then(data => {
        let wordList = JSON.parse(localStorage.getItem("wordList")) || [];

        // check if word is in local-storage
        if (isWordStored(request.word, wordList)) {
          let definitionData = [];

          for (let i = 0; i < 3; i++) {
            if (data[i]) {
              const response = { type: data[i].fl, def: data[i].shortdef[0] };
              definitionData.push(response);
            }
          }

          const newWord = {
            word: request.word.toLowerCase(),
            defs: definitionData,
          };

          wordList = [newWord, ...wordList];
          localStorage.setItem("wordList", JSON.stringify(wordList));
        }

        sendResponse({ response: `${data[0].fl}: ${data[0].shortdef[0]}` });
      })
      .catch(error => sendResponse({ response: "Oops! can't fetch" }));
  }
  return true;
});

// function to check word is in local-storage or not
isWordStored = (word, wordList) => {
  for (let w in wordList) {
    if (w.word === word.toLowerCase()) {
      return false;
    }
  }
  return true;
};
