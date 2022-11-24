let cells = document.querySelectorAll('.cell');
let result = document.querySelector('.modal-text');
const restart = document.querySelector('.reset');
const modal = document.querySelector('.modal');
let gameEnded = false;

// 2D array of the board

let board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

// Get rows

const getRows = (cell) => {
    return parseInt(cell.getAttribute('data-row'));
}

// Get columns

const getCols = (cell) => {
    return parseInt(cell.getAttribute('data-col'));
}

const getWinner = () => {
    // check rows
    for (let i = 0; i < 3; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            return board[i][0];
        }
    }

    // check columns

    for (let i = 0; i < 3; i++) {
        if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {

            return board[0][i];
        }
    }

    // check diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return board[0][0];
    }

    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return board[0][2];
    }

    return null;

}

const getWinningCells = () => {
    // check rows
    for (let i = 0; i < 3; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            return [i, 0, i, 1, i, 2];
        }
    }

    // check columns

    for (let i = 0; i < 3; i++) {
        if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {

            return [0, i, 1, i, 2, i];
        }
    }

    // check diagonals

    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return [0, 0, 1, 1, 2, 2];
    }

    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return [0, 2, 1, 1, 2, 0];
    }

    return null;

}

// Get the cell from the board

const getCell = (row, col) => {
    return board[row][col];
}

// Set the cell on the board

const setCell = (row, col, value) => {
    board[row][col] = value;
}

// Check if the cell is empty

const isEmpty = (row, col) => {
    return board[row][col] === null;
}

// Check if the board is full

const isFull = () => {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (isEmpty(row, col)) {
                return false;
            }
        }
    }
    return true;
}

// Check if the game is over

const isGameOver = () => {
    return isFull() || getWinner() !== null;
}

// Check if the game is a draw

const isDraw = () => {
    return isFull() && getWinner() === null;
}

// Check if the game is won

const isWon = () => {
    return getWinner() !== null;
}

// Check if the game is won by the player

const isWonByPlayer = () => {
    return getWinner() === 'X';
}

// Check if the game is won by the computer

const isWonByComputer = () => {
    return getWinner() === 'O';
}

// Show Modal
const showModal = () => {
    modal.style.display = 'block';
}

// Hide Modal
const hideModal = () => {
    modal.style.display = 'none';
}

// Change cells color function

const changeCellColor = (cell) => {
    
    let winningCells = getWinningCells();
    let row = getRows(cell);
    let col = getCols(cell);

    if (winningCells !== null) {
        for (let i = 0; i < winningCells.length; i += 2) {
            if (winningCells[i] === row && winningCells[i + 1] === col) {
                // add win-color class to span of the winning cell
                cell.children[0].classList.add('win-color');
            }
        }
    }

}


// Random sum function
function randSumSub(a, b) {
    if (Math.random() <= 0.5) {
      r = a - b;
    } else {
      r = a + b;
    }
    return r;
  }

// Win possibility object (scores)
let scores = {
    'X': randSumSub(-10, 10),
    'O': randSumSub(-1, 10),
    'tie': 0
}

// Event listener for each cell
cells.forEach(cell => {
    cell.addEventListener('click', () => {

        console.log(scores)

        if (gameEnded) {
            return;
        }

        let row = getRows(cell);
        let col = getCols(cell);

        if (isEmpty(row, col)) {
            setCell(row, col, 'X');
            cell.innerHTML = '<span class="X">X</span>';

            if (isGameOver()) {
                endGame();
            } else {
                computerMove();
            }
        }

    });
});

// Computer move
const computerMove = () => {
    let bestScore = -Infinity;
    let move;

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (isEmpty(row, col)) {
                setCell(row, col, 'O');
                let score = minimax(board, 0, false);
                setCell(row, col, null);
                if (score > bestScore) {
                    bestScore = score;
                    move = {
                        row,
                        col
                    };
                }
            }
        }
    }

    setCell(move.row, move.col, 'O');
    let cell = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
    cell.innerHTML = '<span class="O">O</span>';

    if (isGameOver()) {
        endGame();
    }
}

// MiniMax algorithm
const minimax = (board, depth, isMaximizing) => {

    if (isWonByPlayer()) {
        return scores['X'];
    } else if (isWonByComputer()) {
        return scores['O'];
    } else if (isDraw()) {
        return scores['tie'];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (isEmpty(row, col)) {
                    setCell(row, col, 'O');
                    let score = minimax(board, depth + 1, false);
                    setCell(row, col, null);
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (isEmpty(row, col)) {
                    setCell(row, col, 'X');
                    let score = minimax(board, depth + 1, true);
                    setCell(row, col, null);
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

// End game
const endGame = () => {
    gameEnded = true;

    showModal();

    // Game conditions
    if (isWonByPlayer()) {
        result.innerHTML = 'You won!';
    } else if (isWonByComputer()) {
        result.innerHTML = 'You lost!';
    } else {
        result.innerHTML = 'It\'s a tie!';
    }

    // Change color of winning cells
    if (isWon()) {
        cells.forEach(cell => {
            changeCellColor(cell);
        });
    }

}

// Restart game
restart.addEventListener('click', () => {

    hideModal();
    gameEnded = false;
    result.innerHTML = '';
    scores = {
        'X': randSumSub(-10, 10),
        'O': randSumSub(-1, 10),
        'tie': 0
    }

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            setCell(row, col, null);
            let cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.innerHTML = '';
        }
    }
    
    document.querySelectorAll('.win-color').forEach(cell => {
        cell.children[0].classList.remove('win-color');
    });

});