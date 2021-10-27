/*jshint esversion: 6 */

/* 
learn.js is the learning module for VocaBee.
It includes the following following functionality:
  Learning Menu:
    renderMenu()
  Simple Flip Exercise
    renderSimpleFlip()
  Multiple Choice Exercise
    renderMultipleChoice()
*/

// Define a few global variables
let numberCorrect = 0;
let numberSeen = 0;

/**
 * This renders the exercise options menu
 * @param {object} cardStack stack for learning exercises
 * @param {object} targetDiv HTML container for rendering exercises
 */
export function renderMenu(cardStack, targetDiv) {
  targetDiv.innerHTML = `
    <div id="menu_div">
      <h5>Choose a learning exercise:</h5>
      <button id="menu_flip-button" class="menu-button">Simple Flip</button>
      <button id="menu_multiple-button" class="menu-button">Multiple Choice</button>
    <div>
  `;
  const flipButton = document.querySelector("#menu_flip-button");
  const multipleButton = document.querySelector("#menu_multiple-button");

  flipButton.addEventListener("click", () => {
    renderFlipper(cardStack, targetDiv);
  });
  multipleButton.addEventListener("click", () => {
    renderMultipleChoice(cardStack, targetDiv);
  });
}

/**
 * renderFlipper creates a simple card flipping
 * activity.
 * @param {object} cardStack is the stack of cards
 * @param {object} targetDiv is the target HTML element for display
 */
function renderFlipper(cardStack, targetDiv) {
  const cards = cardStack.cards;
  let cardOrder = shuffleCards(cards.length);
  let currentCard = 0;
  let fontSize = 1.5;

  targetDiv.innerHTML = `
    <div id="flipper_div">
      <h5 id="flipper_title">Card ${currentCard + 1} of ${cards.length}</h5>
      <button id="font_plus_button" class="magnifier"><i class="fas fa-search-plus"></i></button>
      <button id="font_minus_button" class="magnifier"><i class="fas fa-search-minus"></i></button>
      <div id="flip_card_div">
        <div id="flip_card_inner">
          <div id="flip_Side-1" class="card-side"></div>
          <div id="flip_Side-2" class="card-side"></div>
        </div>
      </div>
      <div>
        <button id="next_button" class="btn btn-success">Next</button>
        <button id="return_menu_button" class="btn btn-secondary mt-3">Back to Menu</button>
      </div>
    </div>
  `;
  // Randomize Stack
  const flipDiv = document.querySelector("#flip_card_div");
  const side1 = document.querySelector("#flip_Side-1");
  const side2 = document.querySelector("#flip_Side-2");
  side1.style.fontSize = `${fontSize}em`;
  side2.style.fontSize = `${fontSize}em`;
  const nextButton = document.querySelector("#next_button");
  const fontPlusButton = document.querySelector("#font_plus_button");
  const fontMinusButton = document.querySelector("#font_minus_button");
  const returnMenuButton = document.querySelector("#return_menu_button");

  flipDiv.addEventListener("click", () => {
    flipCard(side1, side2);
  });

  nextButton.addEventListener("click", () => {
    side1.style.display = "none";
    side2.style.display = "none";
    if (currentCard < cards.length - 1) {
      currentCard++;
    } else {
      cardOrder = shuffleCards(cards.length);
      currentCard = 0;
    }
    if (currentCard == cards.length - 1) {
      nextButton.innerHTML = "Reshuffle";
    } else {
      nextButton.innerHTML = "Next";
    }
    renderFlipCard(
      side1,
      side2,
      cards[cardOrder[currentCard]],
      currentCard,
      cards.length
    );
  });

  fontPlusButton.addEventListener("click", () => {
    fontSize = fontSize + 0.2;
    side1.style.fontSize = `${fontSize}em`;
    side2.style.fontSize = `${fontSize}em`;
  });
  fontMinusButton.addEventListener("click", () => {
    fontSize = fontSize - 0.2;
    side1.style.fontSize = `${fontSize}em`;
    side2.style.fontSize = `${fontSize}em`;
  });
  returnMenuButton.addEventListener("click", () => {
    renderMenu(cardStack, targetDiv);
  });

  renderFlipCard(
    side1,
    side2,
    cards[cardOrder[currentCard]],
    currentCard,
    cards.length
  );
}

/**
 * Given a card object, renders the DOM elements
 * for both sides
 * @param {object} card next card in the stack
 */
function renderFlipCard(side1, side2, card, currentCard, cardLength) {
  const title = document.querySelector("#flipper_title");
  title.innerHTML = `Card ${currentCard + 1} of ${cardLength}`;

  side1.style.display = "block";
  side2.style.display = "none";

  side1.innerHTML = card.side_1;
  side1.style.direction = card.side_1_direction;
  side2.innerHTML = card.side_2;
  side2.style.direction = card.side_2_direction;
}

/**
 * Flips the card
 * @param {object} side1 HTML element
 * @param {object} side2 HTML element
 */
function flipCard(side1, side2) {
  if (side1.style.display == "none") {
    side1.style.display = "block";
    side2.style.display = "none";
  } else {
    side1.style.display = "none";
    side2.style.display = "block";
  }
}

/**
 * Given a quantity, n, of cards, return an
 * array of randomly ordered indices
 * @param {number} n quantity of cards
 */
function shuffleCards(n) {
  // Generate an array of sequential numbers the length of n:
  const array = [...Array(n).keys()];
  // Loop through array and randomize
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * renderMultipleChoice creates a simple
 * multiple choice learning activity.
 * @param {object} cardStack is the stack of cards
 * @param {object} targetDiv is the target HTML element for display
 */
function renderMultipleChoice(cardStack, targetDiv) {
  const cards = cardStack.cards;
  let cardOrder = shuffleCards(cards.length);
  let currentCard = 0;
  let fontSize = 1.5;
  numberCorrect = 0;
  numberSeen = 0;

  targetDiv.innerHTML = `
    <div id="multiple_div">
      <h5 id="multiple_title">Card ${currentCard + 1} of ${cards.length}</h5>
      <button id="font_plus_button" class="magnifier"><i class="fas fa-search-plus"></i></button>
      <button id="font_minus_button" class="magnifier"><i class="fas fa-search-minus"></i></button>
      <div id="multiple_card_div" class="card-side"></div>
      <div id="multiple_choices"></div>
      <div>
        <button id="next_button" class="btn btn-success">Next</button>
        <button id="return_menu_button" class="btn btn-secondary mt-3">Back to Menu</button>
      </div>
    </div>
  `;
  // Randomize Stack
  const multiCardDiv = document.querySelector("#multiple_card_div");
  multiCardDiv.style.fontSize = `${fontSize}em`;

  const nextButton = document.querySelector("#next_button");
  nextButton.style.display = "none";
  const fontPlusButton = document.querySelector("#font_plus_button");
  const fontMinusButton = document.querySelector("#font_minus_button");
  const returnMenuButton = document.querySelector("#return_menu_button");

  nextButton.addEventListener("click", () => {
    multiCardDiv.style.display = "none";
    multiCardDiv.innerHTML = "";
    if (currentCard < cards.length - 1) {
      currentCard++;
    } else {
      cardOrder = shuffleCards(cards.length);
      currentCard = 0;
    }
    if (currentCard == cards.length - 1) {
      nextButton.innerHTML = "Reshuffle";
    } else {
      nextButton.innerHTML = "Next";
    }
    renderMultiCard(cards, cardOrder, currentCard, multiCardDiv);
    nextButton.style.display = "none";
  });

  fontPlusButton.addEventListener("click", () => {
    fontSize = fontSize + 0.2;
    multiCardDiv.style.fontSize = `${fontSize}em`;
  });
  fontMinusButton.addEventListener("click", () => {
    fontSize = fontSize - 0.2;
    multiCardDiv.style.fontSize = `${fontSize}em`;
  });

  returnMenuButton.addEventListener("click", () => {
    renderMenu(cardStack, targetDiv);
  });
  renderMultiCard(cards, cardOrder, currentCard, multiCardDiv);
}

/**
 * Renders the multiple choice exercise
 * @param {array} cards the array of card objects
 * @param {array} cardOrder an array of numbers for a random order
 * @param {number} currentCard number for the current card
 * @param {object} multiCardDiv target HTML container element
 */
function renderMultiCard(cards, cardOrder, currentCard, multiCardDiv) {
  const correctAnswer = cardOrder[currentCard];
  const title = document.querySelector("#multiple_title");
  title.innerHTML = `
  Card ${currentCard + 1} of ${cards.length}<br>
  <b>Score:</b> ${numberCorrect} of ${numberSeen}
  `;
  multiCardDiv.style.display = "block";
  multiCardDiv.innerHTML = cards[cardOrder[currentCard]].side_1;
  const multipleChoices = document.querySelector("#multiple_choices");
  multipleChoices.innerHTML = "";
  let randomAnswers = shuffleCards(cards.length);
  if (randomAnswers.length > 4) {
    randomAnswers = randomAnswers.slice(0, 4);
  }
  // Check to esnure the random answer choice array includes the correct answer
  if (!randomAnswers.includes(correctAnswer)) {
    const answerPosition = Math.floor(Math.random() * randomAnswers.length);
    randomAnswers[answerPosition] = correctAnswer;
  }
  // Generate the answer choice buttons
  for (let i = 0; i < randomAnswers.length; i++) {
    const optionButton = document.createElement("button");
    optionButton.innerHTML = cards[randomAnswers[i]].side_2;
    optionButton.classList.add("choice-button");
    optionButton.setAttribute("data-choice", `${randomAnswers[i]}`);
    optionButton.addEventListener("click", () => {
      checkAnswers(optionButton, correctAnswer);
    });
    multipleChoices.appendChild(optionButton);
  }
}

/**
 * Checks to see whether the selected button is the correct
 * answer and then styles the buttons in various colors
 * @param {object} choice button that was chosen by the user
 * @param {number} correctAnswer the correct answer index
 */
function checkAnswers(choice, correctAnswer) {
  numberSeen++;
  const buttons = document.querySelectorAll(".choice-button");
  buttons.forEach((button) => {
    if (parseInt(button.getAttribute("data-choice")) == correctAnswer) {
      button.classList.add("right-answer");
    } else {
      button.classList.add("wrong-answer");
    }
    button.disabled = true;
  });
  if (parseInt(choice.getAttribute("data-choice")) == correctAnswer) {
    choice.innerHTML = `${choice.innerHTML} <i class="fas fa-check"></i>`;
    choice.classList.add("right-choice");
    numberCorrect++;
  } else {
    choice.innerHTML = `${choice.innerHTML} <i class="fas fa-times"></i>`;
    choice.classList.add("wrong-choice");
  }
  const nextButton = document.querySelector("#next_button");
  nextButton.style.display = "block";
}
