var dealerSum = 0;
var playerSum = 0;

var dealerCardsCount = 0;

var dealerAceCount = 0;
var playerAceCount = 0;

var hidden;
var deck;

let message = "";

var canHit = true;

window.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("play-button");
  if (el) {
    el.addEventListener("click", play);
  }
});

function play() {
  console.log("Play button clicked");
  document.getElementById("play-button").remove();
  document.getElementById("intro-1").classList.add("hidden");
  document.getElementById("intro-2").classList.add("hidden");
  document.getElementById("dealer-header").classList.remove("hidden");
  document.getElementById("player-header").classList.remove("hidden");
  document.getElementById("rules-div").classList.add("hidden");
  document.getElementById("hidden-card-1").classList.remove("my-5");
  document.getElementById("deck-cards-0").classList.remove("hidden", "my-5");
  document.getElementById("deck-cards-1").classList.remove("hidden", "my-5");
  document.getElementById("deck-cards-2").classList.remove("hidden", "my-5");
  document.getElementById("exit-button").classList.remove("hidden");
  document
    .getElementById("player-cards-placeholder")
    .classList.remove("hidden");
  document.getElementById("dealer-cards").classList.add("opacity-0");

  buildDeck();
  shuffleDeck();
  distributeCards();
  startGame();
}

function buildDeck() {
  let values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  let types = ["C", "D", "H", "S"];
  deck = [];

  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < values.length; j++) {
      deck.push(values[j] + "-" + types[i]);
    }
  }
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length);
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  console.log(deck);
}

function distributeCards() {
  document
    .getElementById("deck-cards-0")
    .classList.add("-translate-x-[560px]", "translate-y-52");
  document
    .getElementById("deck-cards-1")
    .classList.add("-translate-x-[560px]", "translate-y-52");
  document
    .getElementById("deck-cards-2")
    .classList.add("-translate-x-[560px]", "translate-y-52");
  setTimeout(() => {
    document
      .getElementById("deck-cards-2")
      .classList.add("-translate-x-[84px]", "translate-y-[320px]");
  }, 300);
  setTimeout(() => {
    document
      .getElementById("deck-cards-1")
      .classList.add("translate-x-[84px]", "translate-y-[320px]", "z-10");
  }, 600);
  setTimeout(() => {
    document.getElementById("player-cards").classList.remove("hidden");
    document.getElementById("player-cards-placeholder").classList.add("hidden");
    document.getElementById("deck-cards-2").classList.add("hidden");
    document.getElementById("deck-cards-1").classList.add("hidden");
    document.getElementById("player-sum").classList.remove("hidden");
    document.getElementById("button-bar").classList.remove("hidden");
  }, 2000);
}

function startGame() {
  hidden = deck.pop();
  dealerSum += getValue(hidden);
  dealerAceCount += hidden.includes("A") ? 1 : 0;
  console.log("Hidden card: " + hidden);

  while (dealerSum < 17) {
    dealerCardsCount++;
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "cards/" + card + ".png";
    dealerSum += getValue(card);
    dealerAceCount += card.includes("A") ? 1 : 0;
    document.getElementById("dealer-cards").appendChild(cardImg);
    cardImg.classList.add("h-64", "w-40");
    console.log(cardImg.getBoundingClientRect().bottom);
  }
  console.log("Dealer sum: " + dealerSum);

  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "cards/" + card + ".png";
    playerSum += getValue(card);
    playerAceCount += card.includes("A") ? 1 : 0;
    document.getElementById("player-cards").appendChild(cardImg);
    cardImg.classList.add("h-64", "w-40");
    console.log(cardImg.getBoundingClientRect().bottom);
  }
  document.getElementById("player-sum").innerHTML = playerSum;

  console.log("Player sum: " + playerSum);
  document.getElementById("hit-button").addEventListener("click", hit);
  document.getElementById("stand-button").addEventListener("click", stand);
  document.getElementById("exit-button").addEventListener("click", exit);
}

function exit() {
  location.reload();
}

function hit() {
  if (!canHit) return;
  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "cards/" + card + ".png";
  playerSum += getValue(card);
  playerAceCount += card.includes("A") ? 1 : 0;
  document.getElementById("player-cards").appendChild(cardImg);
  twClass = "h-64 w-40";
  cardImg.classList.add(...twClass.split(" "));
  document.getElementById("player-sum").innerHTML = playerSum;

  if (reduceAce(playerSum, playerAceCount) > 21) {
    canHit = false;
    stand();
  }
}

function reduceAce(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount--;
  }
  console.log("Player sum: " + playerSum);
  return playerSum;
}

function stand() {
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  playerSum = reduceAce(playerSum, playerAceCount);

  canHit = false;
  document.getElementById("hidden-card-1").src = "cards/" + hidden + ".png";

  if (playerSum > 21) {
    message = "You busted!";
  } else if (dealerSum > 21) {
    message = "You Won!";
  } else if (playerSum == dealerSum) {
    message = "Draw!";
  } else if (playerSum > dealerSum) {
    message = "You Won!";
  } else if (playerSum < dealerSum) {
    message = "You Lost!";
  }

  document.getElementById("button-bar").classList.add("hidden");
  document.getElementById("exit-button").classList.add("animate-bounce");
  document.getElementById("results").classList.remove("hidden");
  document.getElementById("results").innerHTML = message;
  document.getElementById("dealer-sum").innerHTML = dealerSum;
  document.getElementById("player-sum").innerHTML = playerSum;
}

function getValue(card) {
  let data = card.split("-");
  let value = data[0];

  if (isNaN(value)) {
    // J, Q, K, A -> either 11 or 1
    if (value == "A") {
      return 11;
    }
    return 10;
  }
  return parseInt(value);
}
