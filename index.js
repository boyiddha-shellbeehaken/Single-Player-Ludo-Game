const startButton = document.getElementById("start-game");
const rollButton = document.getElementById("roll-dice");
const diceDisplay = document.getElementById("dice-display");
const ludoBoard = document.getElementById("ludo-board");
const currentLevelDisplay = document.getElementById("current-level");
const targetScoreDisplay = document.getElementById("target-score");
const currentScoreDisplay = document.getElementById("current-score");
const attemptsLeftDisplay = document.getElementById("attempts-left");
const highestLevelDisplay = document.getElementById("highest-level");

const messageBox = document.getElementById("message-box");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-game");
const overlay = document.getElementById("overlay");

let targetScore;
let targetAttempts;
let currentLevel = 0;
let previousLevel = 0;
let currentScore = 0;
let attemptsLeft = 0;
let highestLevel = 0;
let diceValue = 0;
let previousColor = 0;
let clickCounter = 0;
let previousClikCounter = 0;
let boardCells = [];

// Load the highest level from localStorage if it exists
const savedHighestLevel = localStorage.getItem("highestLevel");
if (savedHighestLevel !== null) {
  highestLevel = parseInt(savedHighestLevel, 10);
}

highestLevelDisplay.textContent = highestLevel;

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setupGame() {
  startButton.textContent = "Retstart From L-0!";
  //console.log("previous level: " + previousLevel);
  if (clickCounter > previousClikCounter) {
    previousLevel = 0;
    previousClikCounter = clickCounter;
  }

  targetScore = getRandomNumber(25, 36);
  targetAttempts = getRandomNumber(12, 18);
  attemptsLeft = targetAttempts;
  currentScore = 0;
  currentLevel = previousLevel;

  // Load the highest level from localStorage if it exists
  const savedHighestLevel = localStorage.getItem("highestLevel");
  if (savedHighestLevel !== null) {
    highestLevel = parseInt(savedHighestLevel, 10);
  }

  updateDisplays();
  createBoard(targetScore);
  diceDisplay.textContent = "--";
  diceDisplay.style.backgroundColor = "white";
}

function createBoard(size) {
  ludoBoard.style.gridTemplateColumns = `repeat(${Math.ceil(
    Math.sqrt(size)
  )}, 1fr)`;
  ludoBoard.innerHTML = "";
  ludoBoard.appendChild(overlay);
  ludoBoard.appendChild(messageBox);
  boardCells = [];

  for (let i = 1; i < size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    ludoBoard.appendChild(cell);
    boardCells.push(cell);
  }

  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.index = size;
  cell.textContent = size;
  ludoBoard.appendChild(cell);
  boardCells.push(cell);
}

function rollDice() {
  if (attemptsLeft <= 0) return;

  diceDisplay.classList.add("rotating");
  setTimeout(() => {
    diceDisplay.classList.remove("rotating");
  }, 700);

  diceValue = getRandomNumber(1, 6);
  let color = getRandomNumber(1, 6);

  while (previousColor === color) {
    color = getRandomNumber(1, 6);
  }
  previousColor = color;

  const diceColors = ["red", "blue", "green", "yellow", "violet", "orange"];

  const diceColor = diceColors[color - 1];

  diceDisplay.textContent = diceValue;
  diceDisplay.style.backgroundColor = diceColor;

  const newPosition = currentScore + diceValue;

  if (newPosition <= targetScore) {
    for (let i = currentScore + 1; i <= newPosition; i++) {
      const cell = boardCells[i - 1];
      cell.style.backgroundColor = diceColor;
      cell.textContent = i;
    }
    currentScore = newPosition;
  }

  attemptsLeft--;
  updateDisplays();

  if (currentScore === targetScore) {
    currentLevel++;
    previousLevel = currentLevel;

    if (currentLevel > highestLevel) {
      highestLevel = currentLevel;
      // Save the new highest level to localStorage
      localStorage.setItem("highestLevel", highestLevel);
    }
    //updateDisplays();
    attemptsLeft = 0;
    showMessage("You have won the Match");
  } else if (attemptsLeft === 0) {
    updateDisplays();
    console.log("loss......");
    showMessage("You have lost the Match");
  }
}

function updateDisplays() {
  currentLevelDisplay.textContent = currentLevel;
  targetScoreDisplay.textContent = targetScore;
  currentScoreDisplay.textContent = currentScore;
  attemptsLeftDisplay.textContent = attemptsLeft;
  highestLevelDisplay.textContent = highestLevel;

  if (attemptsLeft < 4) {
    attemptsLeftDisplay.classList.add("blink");
  } else {
    attemptsLeftDisplay.classList.remove("blink");
  }
}

function showMessage(message) {
  resultMessage.textContent = message;
  overlay.style.display = "block";
  messageBox.style.display = "block";
  if (message === "You have won the Match") {
    setTimeout(() => {
      hideMessage();
    }, 3500);
  }
}

function hideMessage() {
  overlay.style.display = "none";
  messageBox.style.display = "none";
  setupGame();
}

restartButton.addEventListener("click", hideMessage);
startButton.addEventListener("click", () => {
  clickCounter++;
  setupGame();
});
rollButton.addEventListener("click", rollDice);
//setupGame();
