/* STATE */
let gameMode = "";
let difficulty = "easy";
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;

let scoreX = 0, scoreO = 0, scoreD = 0, matches = 0;

const clickSound = () => document.getElementById("clickSound").play();
const winSound = () => document.getElementById("winSound").play();
const loseSound = () => document.getElementById("loseSound").play();
const drawSound = () => document.getElementById("drawSound").play();

/* HOME */
function loadHome() {
  document.getElementById("app").innerHTML = `
    <h1 class="title">Tic Tac Toe 🎮</h1>
    <p class="subtitle">Choose Game Mode</p>

    <button class="button" onclick="selectMode('AI')">👤 Player vs AI</button>
    <button class="button" onclick="selectMode('2P')">👥 2 Player Mode</button>
  `;
}

/* MODE */
function selectMode(mode) {
  gameMode = mode;
  if (mode === "AI") loadDifficulty();
  else loadPlayerNames();
}

/* DIFFICULTY */
function loadDifficulty() {
  document.getElementById("app").innerHTML = `
    <h1 class="title">Tic Tac Toe 🎮</h1>
    <p class="subtitle">😄 Choose Difficulty</p>

    <div class="diff-wrapper">
      <button id="btnEasy" class="button diff-btn" onclick="setDifficulty('easy')">
        <span id="indEasy" class="diff-indicator"></span> Easy
      </button>

      <button id="btnMedium" class="button diff-btn" onclick="setDifficulty('medium')">
        <span id="indMedium" class="diff-indicator"></span> Medium
      </button>

      <button id="btnHard" class="button diff-btn" onclick="setDifficulty('hard')">
        <span id="indHard" class="diff-indicator"></span> Hard
      </button>
    </div>

    <button class="button" onclick="loadGame()">Start Game</button>
    <button class="button" onclick="loadHome()">Back</button>
  `;

  updateIndicators();
}

/* Update glowing circle */
function updateIndicators() {
  ["Easy","Medium","Hard"].forEach(level => {
    let id = "ind" + level;
    document.getElementById(id).classList.remove("active-indicator");
  });

  if (difficulty === "easy") document.getElementById("indEasy").classList.add("active-indicator");
  if (difficulty === "medium") document.getElementById("indMedium").classList.add("active-indicator");
  if (difficulty === "hard") document.getElementById("indHard").classList.add("active-indicator");
}

function setDifficulty(level) {
  difficulty = level;
  clickSound();
  updateIndicators();
}

/* PLAYER NAMES */
let p1 = "Player 1", p2 = "Player 2";

function loadPlayerNames() {
  document.getElementById("app").innerHTML = `
    <h1 class="title">Tic Tac Toe 🎮</h1>
    <p class="subtitle">👥 Enter Player Names</p>

    <input id="p1name" class="input" placeholder="Player 1 (X)">
    <input id="p2name" class="input" placeholder="Player 2 (O)">

    <button class="button" onclick="start2P()">Start</button>
    <button class="button" onclick="loadHome()">Back</button>
  `;
}

function start2P() {
  p1 = document.getElementById("p1name").value || "Player 1";
  p2 = document.getElementById("p2name").value || "Player 2";
  loadGame();
}

/* GAME SCREEN */
function loadGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameOver = false;

  document.getElementById("app").innerHTML = `
    <h1 class="title">Tic Tac Toe 🎮</h1>
    <p class="subtitle">🎯 Turn: <span id="turn">${currentPlayer}</span></p>

<div class="game-wrapper" style="margin-top:20px;display:flex;justify-content:center;gap:50px;">
      <div id="gameBoard" class="grid"></div>

      <div class="sidebar">
        <h3 class="subtitle">🏆 Scoreboard</h3>
        <div class="score-line"><span>You</span><span id="scoreX">${scoreX}</span></div>
        <div class="score-line"><span>${gameMode === "AI" ? "AI" : p2}</span><span id="scoreO">${scoreO}</span></div>
        <div class="score-line"><span>Draws</span><span id="scoreD">${scoreD}</span></div>
        <hr>
        <div class="score-line"><span>Matches</span><span id="scoreM">${matches}</span></div>
      </div>
    </div>

    <button class="button" onclick="loadGame()">Play Again</button>
    <button class="button" onclick="loadHome()">Back to Menu</button>
  `;

  createCells();
}

/* CELLS */
function createCells() {
  let g = document.getElementById("gameBoard");
  g.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    let c = document.createElement("div");
    c.className = "cell";
    c.dataset.i = i;
    c.onclick = () => handleMove(i);
    g.appendChild(c);
  }
}

/* PLAYER MOVE */
function handleMove(i) {
  if (board[i] !== "" || gameOver) return;

  board[i] = currentPlayer;
  clickSound();
  renderBoard();

  if (checkWin(currentPlayer)) return finishGame(currentPlayer);
  if (!board.includes("")) return finishGame("draw");

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  document.getElementById("turn").innerText = currentPlayer;

  if (gameMode === "AI" && currentPlayer === "O") {
    setTimeout(aiMove, 300);
  }
}

/* RENDER */
function renderBoard() {
  document.querySelectorAll(".cell").forEach((c, i) => c.innerText = board[i]);
}

/* AI MOVE */
function aiMove() {
  let move;

  if (difficulty === "easy") {
    move = randomMove();
  }
  else if (difficulty === "medium") {
    move = Math.random() < 0.5 ? randomMove() : minimax(board, "O").index;
  }
  else {
    move = minimax(board, "O").index;
  }

  handleMove(move);
}

function randomMove() {
  return board.map((v, i) => v === "" ? i : null).filter(x => x !== null)[0];
}

/* MINIMAX */
function minimax(newBoard, player) {
  const avail = newBoard.map((v,i)=>v===""?i:null).filter(x=>x!==null);

  if (checkLine(newBoard, "X")) return {score: -10};
  if (checkLine(newBoard, "O")) return {score: 10};
  if (avail.length === 0) return {score: 0};

  let moves = [];

  for (let i of avail) {
    let move = {};
    move.index = i;
    newBoard[i] = player;

    if (player === "O") move.score = minimax(newBoard,"X").score;
    else move.score = minimax(newBoard,"O").score;

    newBoard[i] = "";
    moves.push(move);
  }

  let bestMove = 0;

  if (player === "O") {
    let bestScore = -999;
    moves.forEach((m,i)=>{ if(m.score > bestScore){bestScore=m.score;bestMove=i;} });
  }
  else {
    let bestScore = 999;
    moves.forEach((m,i)=>{ if(m.score < bestScore){bestScore=m.score;bestMove=i;} });
  }

  return moves[bestMove];
}

/* WIN CHECK */
function checkWin(p) {
  return checkLine(board,p);
}

function checkLine(b,p) {
  let lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return lines.some(l=>l.every(i=>b[i]===p));
}

/* finish */

function finishGame(result) {
  gameOver = true;
  matches++;

  let msg = "";

  if (result === "X") {
    scoreX++;
    winSound();
    msg = "You Win! 🎉";
  } 
  else if (result === "O") {
    scoreO++;
    loseSound();
    msg = (gameMode === "AI") ? "AI Wins! 🤖" : `${p2} Wins! 🎉`;
  } 
  else {
    scoreD++;
    drawSound();
    msg = "It's a Draw! 🤝";
  }

  // update scoreboard UI
  document.getElementById("scoreX").innerText = scoreX;
  document.getElementById("scoreO").innerText = scoreO;
  document.getElementById("scoreD").innerText = scoreD;
  document.getElementById("scoreM").innerText = matches;

  // Create popup
  const pop = document.createElement("div");
  pop.className = "result-popup";
  pop.innerHTML = `
    <h2>${msg}</h2>
    <button class="button" onclick="closeResult()">OK</button>
  `;

  document.body.appendChild(pop);
}

// Close popup
function closeResult() {
  const p = document.querySelector(".result-popup");
  if (p) p.remove();
}


/* START */
loadHome();
