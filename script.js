let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // Player starts as 'X'
let gameActive = true;
const statusDisplay = document.getElementById('status');
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

  // Prevent clicking a cell that's already filled or if the game is over
  if (board[clickedCellIndex] !== '' || !gameActive) return;

  // Player's turn
  board[clickedCellIndex] = currentPlayer;
  clickedCell.innerText = currentPlayer;

  checkWin();

  if (gameActive) {
    currentPlayer = 'O';
    statusDisplay.innerText = `AI's turn...`;
    setTimeout(aiMove, 1000); // AI takes its move after a 2-second delay
  }
}

function aiMove() {
  if (!gameActive) return; // Stop if the game is over

  // AI uses minimax to find the best move
  const bestMove = minimax(board, 'O').index;
  board[bestMove] = currentPlayer;

  // Update the cell visually
  document.querySelector(`[data-index="${bestMove}"]`).innerText = currentPlayer;

  checkWin();

  // Switch back to player if game is still active
  if (gameActive) {
    currentPlayer = 'X';
    statusDisplay.innerText = `Player ${currentPlayer}'s turn`;
  }
}

function checkWin() {
  let roundWon = false;
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusDisplay.innerText = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (!board.includes('')) {
    statusDisplay.innerText = 'Draw!';
    gameActive = false;
    return;
  }
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  statusDisplay.innerText = `Player ${currentPlayer}'s turn`;
  document.querySelectorAll('.cell').forEach(cell => (cell.innerText = ''));
}

// Minimax algorithm for optimal AI move
function minimax(newBoard, player) {
  const emptyCells = newBoard.filter(s => s === '');

  if (checkWinCondition(newBoard, 'X')) return { score: -10 };
  if (checkWinCondition(newBoard, 'O')) return { score: 10 };
  if (emptyCells.length === 0) return { score: 0 };

  const moves = [];

  for (let i = 0; i < newBoard.length; i++) {
    if (newBoard[i] === '') {
      let move = {};
      move.index = i;
      newBoard[i] = player;

      if (player === 'O') {
        const result = minimax(newBoard, 'X');
        move.score = result.score;
      } else {
        const result = minimax(newBoard, 'O');
        move.score = result.score;
      }

      newBoard[i] = '';
      moves.push(move);
    }
  }

  let bestMove;
  if (player === 'O') {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function checkWinCondition(board, player) {
  return winningConditions.some(condition => 
    condition.every(index => board[index] === player)
  );
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
statusDisplay.innerText = `Player ${currentPlayer}'s turn`;
self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('tic-tac-toe').then(cache => {
        return cache.addAll(['./', './index.html', './style.css', './script.js']);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });
  