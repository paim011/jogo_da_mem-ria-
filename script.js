const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

// Items arrays
const itemsSet1 = [
  { name: "abacate", image: "abacate1.png" },
  { name: "banana", image: "banana1.png" },
  { name: "cereja", image: "cereja1.png" },
  { name: "laranja", image: "laranja1.png" },
  { name: "maça", image: "maça1.png" },
  { name: "manga", image: "manga1.png" },
  { name: "mirtilo", image: "mirtilo1.png" },
  { name: "morango", image: "morango1.png" },
  { name: "pera", image: "pera1.png" },
  { name: "pessego", image: "pessego1.png" },
  { name: "uva", image: "uva1.png"}
];

const itemsSet2 = [
  { name: "abacate", image: "abacatenome.png" },
  { name: "banana", image: "banananome.png" },
  { name: "cereja", image: "cerejanome.png" },
  { name: "laranja", image: "laranjanome.png" },
  { name: "maça", image: "maçanome.png" },
  { name: "manga", image: "manganome.png" },
  { name: "mirtilo", image: "mirtilonome.png" },
  { name: "morango", image: "morangonome.png" },
  { name: "pera", image: "peranome.png" },
  { name: "pessego", image: "pessegonome.png" },
  { name: "uva", image: "uvanome.png"}
];

// Initial Time
let seconds = 0,
  minutes = 0;
// Initial moves and win count
let movesCount = 0,
  winCount = 0;

// For timer
const timeGenerator = () => {
  seconds += 1;
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

// For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

// Pick random objects from the items arrays
const generateRandom = (size = 4) => {
  let tempArray1 = [...itemsSet1];
  let tempArray2 = [...itemsSet2];
  let cardValues = [];
  size = (size * size) / 2;
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray1.length);
    cardValues.push({ set1: tempArray1[randomIndex], set2: tempArray2[randomIndex] });
    tempArray1.splice(randomIndex, 1);
    tempArray2.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  let allCards = [];
  cardValues.forEach(pair => {
    allCards.push({ ...pair.set1, pair: true });
    allCards.push({ ...pair.set2, pair: true });
  });
  allCards.sort(() => Math.random() - 0.5);

  for (let i = 0; i < size * size; i++) {
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${allCards[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
          <img src="${allCards[i].image}" class="image"/>
        </div>
     </div>
     `;
  }

  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;
  cards = document.querySelectorAll(".card-container");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("matched")) {
        card.classList.add("flipped");
        if (!firstCard) {
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          movesCounter();
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard = false;
            winCount += 1;
            if (winCount == Math.floor(cardValues.length)) {
              result.innerHTML = `<h2>You Won</h2>
            <h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  interval = setInterval(timeGenerator, 1000);
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};
