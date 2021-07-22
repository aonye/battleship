import gameBoardFact from './modules/Gameboard';
import playerFact from './modules/player';
import display from './modules/display';
import gameBoard from './modules/Gameboard';

const initialize = (() => {
    const gameInfo = {};
    // let x = ship(4);
    // console.log(x);
    // x.hit(0);
    // x.hit(1);
    // x.hit(2);
    // x.hit(3);
    // x.hit(3);
    // console.log(x.isSunk());
    // console.log('hello world');

    // let t = board();
    // t.toggleVertical();
    // t.placeShip('Destroyer', 5, 'C5');
    // console.log(t.boardInformation["board"]);
    // t.receiveAttack('C5');
    // console.log(t.isAllSunk());

    initGame();
    playGame();

    function initGame() {
        gameInfo['player'] = playerFact('Anon');
        gameInfo['playerBoard'] = gameBoardFact();
        gameInfo['cpu'] = playerFact('Computer');
        gameInfo['cpuBoard'] = gameBoardFact();
        gameInfo['currentPlayer'] = pickRandStarter(Math.floor(Math.random() * 2));
        display.renderBoard(gameInfo['player'].playerInfo.name);
        display.renderBoard(gameInfo['cpu'].playerInfo.name);

        console.log(`${gameInfo.currentPlayer} has been randomly chosen to start first`);
    }

    function pickRandStarter(num) {
        if (num === 0) {
            return 'player';
        }
        return 'cpu';
    }

    function playGame() {
        console.log(gameInfo.playerBoard.isAllSunk(), gameInfo.cpuBoard.isAllSunk());
        if (gameInfo.playerBoard.isAllSunk() && gameInfo.cpuBoard.isAllSunk()) {
            console.log('made it in here');
            return;
        } else {
            //eventhandler recursion.
            playerRound();
            return;
        }
    }

    function playerRound() {
        let DOMNodes = document.querySelectorAll(`#${gameInfo[`${gameInfo.currentPlayer}`]['playerInfo']['name']} div`);

        DOMNodes.forEach((node) => {
            node.addEventListener('click', nodeClickHand);
        });

        function nodeClickHand(event) {
            const index = event.target.className;
            const board = gameInfo[`${gameInfo.currentPlayer}Board`]['boardInformation']['board'];
            if (gameInfo[`${gameInfo.currentPlayer}`].checkMove(board[index])) { //checks if node has been clicked before
                let result = gameInfo[`${gameInfo.currentPlayer}Board`].receiveAttack(index);
                display.updateBoardColor(event.target, result);
                DOMNodes.forEach((node) => node.removeEventListener('click', nodeClickHand));
                changePlayer();
                playGame();
                return;
            }
            alert('Cannot select this node, please try again');
        }
    }

    function changePlayer() {
        if (gameInfo.currentPlayer === 'player') {
            gameInfo.currentPlayer = 'cpu';
        } else {
            gameInfo.currentPlayer = 'player';
        }
    }
})();

export default initialize;