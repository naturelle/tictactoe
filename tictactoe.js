const playerAInput = document.querySelector('#playerA');
const playerBInput = document.querySelector('#playerB');

const Player = (name, marker) => {
    return { name, marker };
}

const Game = (playerA, playerB, gameState, gameBoard) => {
    const start = () => {
        gameState.set(`Started new game. It is ${playerA.name}'s turn.`);
        console.log(this);
        gameBoard.build(this);
    }

    let currentPlayer = playerA;

    const playerMarker = () => currentPlayer.marker;

    const endTurn = () => {
        currentPlayer = currentPlayer === playerA ? playerB : playerA;
        gameState.set(`It is ${currentPlayer.name}'s turn.`);
    };

    return { start, playerMarker, endTurn }
}

const GameState = ((wrapper) => {
    const set = text => wrapper.innerText = text;

    return { set };
})(document.querySelector('#game-state'));

const GameBoard = ((wrapper) => {
    let tiles = [
        ['', '', ''], // 0, 1, 2
        ['', '', ''], // 3, 4, 5
        ['', '', '']  // 6, 7, 8
    ];

    const Tile = (game, position) => {
        let tileNode = document.createElement('div');
        tileNode.className = 'tile';
        tileNode.addEventListener('click', (e) => {
            if (e.target.innerText !== '') return;
            e.target.innerText = game.playerMarker();
            game.endTurn();
        });
        return tileNode;
    };

    const build = (game) => {
        wrapper.innerHTML = '';
        tiles.forEach((row, x) => {
            row.forEach((column, y) => {
                wrapper.appendChild(Tile(game, {x,y}));
            })
        })
    };

    return { build }
})(document.querySelector('#game-board'));

let game = null;
const newGameButton = document.querySelector('#new-game');
newGameButton.addEventListener('click', () => {
    game = Game(
        Player(playerAInput.value, 'X'),
        Player(playerBInput.value, 'O'),
        GameState,
        GameBoard
    );
    game.start();
})