const boardEl = document.getElementById('gameBoard');
const statusEl = document.getElementById('status');
let board = Array(9).fill('');
let currentPlayer = 'X';
let isGameOver = false;
let mode = 'pvp'; // 'pvp' or 'ai'

function startGame(selectedMode) {
  mode = selectedMode;
  resetGame();
}

function resetGame() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  isGameOver = false;
  statusEl.textContent = "Player X's Turn";
  renderBoard();
}

function renderBoard() {
  boardEl.innerHTML = '';
  board.forEach((cell, index) => {
    const div = document.createElement('div');
    div.className = 'cell';
    if (cell) div.classList.add('taken');
    div.textContent = cell;
    div.addEventListener('click', () => handleMove(index));
    boardEl.appendChild(div);
  });
}

function handleMove(index) {
  if (board[index] || isGameOver) return;

  board[index] = currentPlayer;
  renderBoard();

  if (checkWin(currentPlayer)) {
    statusEl.textContent = `Player ${currentPlayer} Wins!`;
    isGameOver = true;
    return;
  }

  if (board.every(cell => cell)) {
    statusEl.textContent = "It's a draw!";
    isGameOver = true;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusEl.textContent = `Player ${currentPlayer}'s Turn`;

  if (mode === 'ai' && currentPlayer === 'O') {
    setTimeout(aiMove, 300);
  }
}

function aiMove() {
  const bestMove = getBestMove();
  handleMove(bestMove);
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(newBoard, depth, isMaximizing) {
  if (checkWin('O')) return 10 - depth;
  if (checkWin('X')) return depth - 10;
  if (newBoard.every(cell => cell)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!newBoard[i]) {
        newBoard[i] = 'O';
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!newBoard[i]) {
        newBoard[i] = 'X';
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWin(player) {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winCombos.some(combo => 
    combo.every(index => board[index] === player)
  );
}

startGame('pvp'); // Default start mode
