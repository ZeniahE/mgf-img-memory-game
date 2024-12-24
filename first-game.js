// list of possible images to be matched

const images = [
  "images/arson+aliens.webp",
  "images/blkf-serve.webp",
  "images/concert.webp",
  "images/girl-whatchu-said-to-me.webp",
  "images/luh-bw-moment.webp",
  "images/mega-arson.webp",
  "images/megas-disgusted.webp",
  "images/mega-slay.webp",
  "images/oh-okay.webp",
  "images/os-candid-serve.webp",
  "images/os-crouched.webp",
  "images/os-moment.webp",
];

// hosts elements from the document in variables so they can be accessed
const board = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const messageElement = document.getElementById("message");
const startButton = document.getElementById("start-button");

// creates variables to make the game work
let firstTile = null;
let secondTile = null;
let score = 0;
let matchedPairs = 0;
let timer = 10; // sets the amount of time the user has to memorize the cards before they are turned over
let countdown;

// Access the restart button and set it to hidden initially
const restartButton = document.getElementById("restart");
restartButton.style.display = "none"; // Hidden by default
restartButton.addEventListener("click", () => {
  // Restart logic: reset the game
  board.innerHTML = null; // Clear the board
  firstTile = null;
  secondTile = null;
  score = 0;
  matchedPairs = 0;
  timer = 10;
  scoreElement.textContent = `Score: ${score}`;
  messageElement.textContent = "";
  restartButton.style.display = "none"; // Hide the restart button again
  scoreElement.style.display = "inline-block";
  timerElement.style.display = "inline-block";
  setTimeout(() => {
    startGame(); // Restart the game
  }, 200);
});

// Add the restart button to the DOM next to the message element
messageElement.parentNode.insertBefore(
  restartButton,
  messageElement.nextSibling
);

// updates the score everytime a user makes a pair
function updateScore(amount) {
  score += amount;
  scoreElement.textContent = `Score: ${score}`;
}

// checks if the user made a correct match
function checkMatch() {
  if (firstTile.dataset.image === secondTile.dataset.image) {
    updateScore(20); // increments score
    firstTile.classList.remove("hidden"); // keeps tile unhidden
    secondTile.classList.remove("hidden"); // keeps tile unhidden
    firstTile = null; //resets user tile choices
    secondTile = null; //resets user tile choices
    matchedPairs++; // keeps track of successful pairs

    // compares the amount of user discovered pairs to the total pairs possible
    if (matchedPairs === images.length) {
      messageElement.textContent = "Final Score: " + score + "/240 !";
      restartButton.style.display = "inline-block";
      scoreElement.style.display = "none";
      timerElement.style.display = "none";
    }

    // controls what happens if the user gets a wrong pair
  } else {
    updateScore(-20); // subtracts 10 from the score
    // sets a one second delay before the tiles are turned back over
    setTimeout(() => {
      firstTile.classList.add("hidden"); // rehides selected tile
      secondTile.classList.add("hidden"); // rehides selected tile
      firstTile = null; // clears user tile selection
      secondTile = null; // clears user tile selection
    }, 1000); // 1000 milliseconds = 1 second
  }
}

function handleTileClick(event) {
  // sets tile to be whichever tile the user clicked
  const tile = event.target;

  // ignores selection if user accidentally clicks the same tile twice (like double clicks)
  if (!tile.classList.contains("hidden") || secondTile) return;

  // turns the tiles over so the text is visible
  tile.classList.remove("hidden");

  // sets the first tile
  if (!firstTile) {
    firstTile = tile;
  } else {
    // sets the second favor
    secondTile = tile;
    // checks if the user made the correct selection
    checkMatch();
  }
}

// fuction responsable for the initialization of the game on button click
function startGame() {
  // duplicates the list to display both the words and their match
  const tiles = [...images, ...images].sort(() => Math.random() - 0.5);

  startButton.style.display = "none"; // Hide the start button
  board.style.visibility = "visible"; // Show the game board

  // sets the tiles and places them on the board
  tiles.forEach((image) => {
    const tile = document.createElement("div"); // makes the tiles as div elements
    tile.classList.add("tile"); // adds the tiles to a list
    tile.dataset.image = image; // Store the image name for matching
    tile.style.backgroundImage = `url(${image})`; // Set the image as the tile's background
    tile.style.backgroundSize = "cover"; // Ensure the image fills the tile
    tile.style.backgroundPosition = "center";
    tile.addEventListener("click", handleTileClick); // calls the handleTileClick function when a till is clicked
    board.appendChild(tile); // adds the tiles to the board
  });

  // starts the countdown
  countdown = setInterval(() => {
    timer--;
    // updates the countdown at the top of the screen
    timerElement.textContent = `Time: ${timer}`;

    // turns all the cards over at the end of the countdown
    if (timer === 0) {
      clearInterval(countdown);
      document.querySelectorAll(".tile").forEach((tile) => {
        tile.classList.add("hidden");
      });
    }
  }, 1000);
}

// calls the start game function when the user hits a button
startButton.addEventListener("click", startGame);
