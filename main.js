const GameState = ((wrapper, inputArea, gameArea) => {
    const set = text => wrapper.innerText = text;
    const setGameStarted = () => {
        inputArea.classList.add('d-none');
        gameArea.classList.remove('d-none');
    }
    const setGameStopped = () => {
        inputArea.classList.remove('d-none');
        gameArea.classList.add('d-none');
    }

    return { set, setGameStarted, setGameStopped };
})(
    document.querySelector('#game-state'),
    document.querySelector('#input-area'),
    document.querySelector('#game-area')
);

const GameBoard = ((wrapper) => {
    let tiles = [
        ['', '', ''], // 0, 1, 2
        ['', '', ''], // 3, 4, 5
        ['', '', '']  // 6, 7, 8
    ];
    let isGameOver = false;

    const Tile = (playerMarker, endTurn, position) => {
        let tileNode = document.createElement('div');
        tileNode.className = 'tile';
        tileNode.addEventListener('click', (event) => {
            if (event.target.innerText !== '' || isGameOver) return;
            event.target.innerHTML = `<span>${playerMarker()}</span>`;
            tiles[position.x][position.y] = playerMarker();
            endTurn();
        });
        return tileNode;
    };

    const build = (playerMarker, endTurn) => {
        reset();
        tiles.forEach((row, x) => {
            row.forEach((column, y) => {
                wrapper.appendChild(Tile(playerMarker, endTurn, {x,y}));
            })
        })
    };

    const reset = () => {
        wrapper.innerHTML = '';
        isGameOver = false;
        tiles = [
            ['', '', ''], // 0, 1, 2
            ['', '', ''], // 3, 4, 5
            ['', '', '']  // 6, 7, 8
        ];
    }

    const areEqual = (a, b, c) => {
        if (a === '' || b === '' || c === '') return false;
        return a === b && b === c;
    };

    const playerWon = () => {
        for (let i = 0; i < 3; i++) {
            if (areEqual(tiles[i][0], tiles[i][1], tiles[i][2])) return true;
        }
        for (let i = 0; i < 3; i++) {
            if (areEqual(tiles[0][i], tiles[1][i], tiles[2][i])) return true;
        }
        if (areEqual(tiles[0][0], tiles[1][1], tiles[2][2])) return true;
        if (areEqual(tiles[2][0], tiles[1][1], tiles[0][2])) return true;
        return false;
    };

    const gameOver = () => {
        isGameOver = true;
    }

    return { build, reset, playerWon, gameOver }
})(document.querySelector('#game-board'));

const Game = ((state, board) => {
    let playerA = null;
    let playerB = null;
    let currentPlayer = null;
    let turnCount = 0;

    const start = (pA, pB) => {
        playerA = currentPlayer = pA;
        playerB = pB;
        state.set(`Started new game. It is ${playerA.name}'s turn.`);
        board.build(playerMarker, endTurn);
    };

    const playerMarker = () => currentPlayer.marker;

    const endTurn = () => {
        turnCount++;
        console.log(turnCount);
        if (turnCount === 9) {
            state.set('It\'s a draw! Press \'reset\' to start a new game.');
            board.gameOver();
        } else if (board.playerWon()) {
            state.set(`${currentPlayer.name} won! Press 'reset' to start a new game.`)
            board.gameOver();
        } else {
            currentPlayer = currentPlayer === playerA ? playerB : playerA;
            state.set(`It is ${currentPlayer.name}'s turn.`);
        }
    };

    const reset = () => {
        playerA = null;
        playerB = null;
        currentPlayer = null;
        turnCount = 0;
        state.set('Please type your names below');
        board.reset();
    };

    return { start, playerMarker, endTurn, reset };
})(GameState, GameBoard);

const Player = (name, marker) => {
    return { name, marker };
}

const playerAInput = document.querySelector('#player-a-name');
const playerBInput = document.querySelector('#player-b-name');
const inputArea = document.querySelector('#input-area');
const gameArea = document.querySelector('#game-area');

const newGameButton = document.querySelector('#new-game-button');
newGameButton.addEventListener('click', () => {
    Game.start(
        Player(playerAInput.value, 'X'),
        Player(playerBInput.value, 'O')
    );
    GameState.setGameStarted();
});

const resetGameButton = document.querySelector('#reset-game-button');
resetGameButton.addEventListener('click', () => {
    playerAInput.value = '';
    playerBInput.value = '';
    Game.reset();
    GameState.setGameStopped();
});