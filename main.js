const playerAInput = document.querySelector('#player-a-name');
const playerBInput = document.querySelector('#player-b-name');

const resetGameButton = document.querySelector('#reset-game-button');
resetGameButton.addEventListener('click', () => {
    playerAInput.value = '';
    playerBInput.value = '';
    GameBoard.reset();
});

const newGameButton = document.querySelector('#new-game-button');
let currentGame = null;
newGameButton.addEventListener('click', () => {
    currentGame = Game(
        PlayerFactory(playerAInput.value, 'X'),
        PlayerFactory(playerBInput.value, 'O')
    );
    GameBoard.reset();
})

const Game = function (playerA, playerB) {
    const players = [ playerA, playerB ];
    let playerTurn = 0;
    const endTurn = () => playerTurn = playerTurn === 0 ? 1 : 0;
    const getCurrentPlayer = () => players[playerTurn];

    return {endTurn, getCurrentPlayer};
};

const PlayerFactory = (name, marker) => {
    return {name, marker};
}

const GameState = (function (wrapper) {

})(document.querySelector('#game-state'));

const GameBoard = (function (wrapper) {
    let tiles = [];

    const TileFactory = (marker, pos) => {
        let position = pos;
        let tile = document.createElement('div');
        tile.className = 'tile';
        tile.innerText = marker;
        tile.addEventListener('click', () => {
            if (tiles[position.x][position.y] !== '') return;
            setTile(currentGame.getCurrentPlayer().marker, position);
            build();
            if (checkWinCondition()) console.log('game over');
            currentGame.endTurn();
        });
        return tile;
    }

    const build = () => {
        wrapper.innerHTML = '';
        tiles.forEach((row, x) =>
            row.forEach((column, y) =>
                wrapper.appendChild(TileFactory(tiles[x][y], {x,y}))
            )
        );
    }

    const areEqual = (a, b, c) => {
        if (a === '' || b === '' || c === '') return false;
        return a === b && b === c;
    }

    const checkWinCondition = () => {
        for (let i = 0; i < 3; i++) {
            if (areEqual(tiles[i][0], tiles[i][1], tiles[i][2])) return true;
        }
        for (let i = 0; i < 3; i++) {
            if (areEqual(tiles[0][i], tiles[1][i], tiles[2][i])) return true;
        }
        if (areEqual(tiles[0][0], tiles[1][1], tiles[2][2])) return true;
        if (areEqual(tiles[2][0], tiles[1][1], tiles[0][2])) return true;
        return false;
    }

    const setTile = (marker, position) => {
        tiles[position.x][position.y] = marker;
    }

    const reset = () => {
        tiles = [
            ['', '', ''], // 0, 1, 2
            ['', '', ''], // 3, 4, 5
            ['', '', '']  // 6, 7, 8
        ];
        build();
    }

    return {setTile, build, reset};
})(document.querySelector('#game-board'));
