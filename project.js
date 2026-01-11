let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameMode = "", aiLevel = "";
let gameOver = false;

const boardDiv = document.getElementById("board");
const message = document.getElementById("message");

const modeBox = document.getElementById("modeBox");
const difficultyBox = document.getElementById("difficultyBox");
const newGameBox = document.getElementById("newGameBox");
const celebration = document.getElementById("celebration");

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

/* ---------- BOARD ---------- */
function createBoard(){
  boardDiv.innerHTML = "";
  for(let i=0;i<9;i++){
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.onclick = () => makeMove(i);
    boardDiv.appendChild(cell);
  }
}

function updateTurnMessage(player) {
    message.classList.remove('x-turn','o-turn','x-win','o-win','draw');
    if(player === 'X'){
        message.textContent = "Player X Turn";
        message.classList.add('x-turn');
    } else {
        message.textContent = "Player O Turn";
        message.classList.add('o-turn');
    }
}

function showWinner(winner) {
    message.classList.remove('x-turn','o-turn','x-win','o-win','draw');
    if(winner === 'X'){
        message.textContent = "X Wins!";
        message.classList.add('x-win');
    } else if(winner === 'O'){
        message.textContent = "O Wins!";
        message.classList.add('o-win');
    } else {
        message.textContent = "It's a Draw!";
        message.classList.add('draw');
    }
}

/* ---------- START ---------- */
function startFriend(){ gameMode="friend"; startGame(); }
function showDifficulty(){ difficultyBox.classList.remove("hidden"); }
function startAI(level){ gameMode="ai"; aiLevel=level; startGame(); }

function startGame(){
  board.fill("");
  currentPlayer = "X";
  gameOver = false;

  modeBox.classList.add("hidden");
  difficultyBox.classList.add("hidden");
  boardDiv.classList.remove("hidden");
  newGameBox.classList.add("hidden");

  updateTurnMessage(currentPlayer);
  celebration.classList.add("hidden");
  celebration.innerHTML = "";

  createBoard();
}

/* ---------- GAME LOGIC ---------- */
function makeMove(i){
  if(board[i] || gameOver) return;

  board[i] = currentPlayer;
  const cell = boardDiv.children[i];
  cell.innerText = currentPlayer;
  cell.classList.add(currentPlayer === "X" ? "x" : "o");

  if(checkWin()){
    showWinner(currentPlayer);
    gameOver = true;
    startCelebration(currentPlayer); // pass winner
    newGameBox.classList.remove("hidden");
    return;
  }

  if(board.every(c => c)){
    showWinner('Draw');
    gameOver = true;
    startCelebration('Draw'); // pass draw
    newGameBox.classList.remove("hidden");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurnMessage(currentPlayer);

  if(gameMode === "ai" && currentPlayer === "O"){
    setTimeout(aiMove, 400);
  }
}

/* ---------- WIN CHECK ---------- */
function checkWin(){
  for(let combo of wins){
    if(combo.every(i => board[i] === currentPlayer)){
      highlightWin(combo, currentPlayer);
      return true;
    }
  }
  return false;
}

function highlightWin(pattern, player){
  pattern.forEach(i => {
    boardDiv.children[i].classList.add(player==="X" ? "win-x" : "win-o");
  });
}

/* ---------- AI ---------- */
function aiMove(){
  let move;
  if(aiLevel==="easy") move=randomMove();
  else if(aiLevel==="medium") move=smartMove();
  else move=minimaxMove();
  makeMove(move);
}

function randomMove(){
  const empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

function smartMove(){
  for(let i=0;i<9;i++){
    if(board[i]===""){ board[i]="O"; if(checkStatic("O")){ board[i]=""; return i;} board[i]=""; }
  }
  for(let i=0;i<9;i++){
    if(board[i]===""){ board[i]="X"; if(checkStatic("X")){ board[i]=""; return i;} board[i]=""; }
  }
  if(board[4]==="") return 4;
  const corners=[0,2,6,8].filter(i=>board[i]==="");
  return corners.length ? corners[Math.floor(Math.random()*corners.length)] : randomMove();
}

function minimaxMove(){
  let best=-Infinity, move;
  for(let i=0;i<9;i++){
    if(board[i]===""){
      board[i]="O";
      let score=minimax(false);
      board[i]="";
      if(score>best){ best=score; move=i; }
    }
  }
  return move;
}

function minimax(isMax){
  if(checkStatic("O")) return 10;
  if(checkStatic("X")) return -10;
  if(board.every(c=>c)) return 0;

  let best = isMax?-Infinity:Infinity;
  for(let i=0;i<9;i++){
    if(board[i]===""){
      board[i]=isMax?"O":"X";
      let score=minimax(!isMax);
      board[i]="";
      best=isMax?Math.max(best,score):Math.min(best,score);
    }
  }
  return best;
}

function checkStatic(p){ return wins.some(w=>w.every(i=>board[i]===p)); }

/* ---------- CELEBRATION ---------- */
let celebrationInterval=null;
function startCelebration(winner){
  celebration.classList.remove("hidden");
  celebration.innerHTML="";

  let emojis;
  if(winner==="X") emojis=["🔴","❤️","🌺","🟥"];
  else if(winner==="O") emojis=["🔵","💙","💠","🟦","💠"];
   // draw celebration

  if(celebrationInterval) clearInterval(celebrationInterval);

  celebrationInterval=setInterval(()=>{
    for(let i=0;i<6;i++){
      const c=document.createElement("div");
      c.className="confetti";
      c.innerText=emojis[Math.floor(Math.random()*emojis.length)];
      c.style.left=Math.random()*100+"vw";
      c.style.fontSize=20+Math.random()*20+"px";
      c.style.animationDuration=3+Math.random()*2+"s";
      celebration.appendChild(c);
      setTimeout(()=>c.remove(),5000);
    }
  },400);
}

/* ---------- CONTROLS ---------- */
function restart(){ startGame(); }
function exitGame(){
  alert("Thanks for playing 😊");
  boardDiv.classList.add("hidden");
  newGameBox.classList.add("hidden");
  modeBox.classList.remove("hidden");
  difficultyBox.classList.add("hidden");
  message.innerText="";
  celebration.classList.add("hidden");
  celebration.innerHTML="";
}
