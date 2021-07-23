import gameBoardFact from './modules/Gameboard';
import playerFact from './modules/player';
import display from './modules/display';
import gameBoard from './modules/Gameboard';
import Player from './modules/player';

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
            switch (gameInfo.currentPlayer) {
                case 'player': {
                    playRound();//eventhandler handles recursion
                    break;
                }
                case 'cpu': {
                    setTimeout(() => {
                        computerPlay();
                    }, 1);
                    break;
                }
            }
        }
    }

    function playRound() {
        let DOMNodes = document.querySelectorAll(`#${gameInfo[`${gameInfo.currentPlayer}`]['playerInfo']['name']} div`);
        DOMNodes.forEach((node) => {
            node.addEventListener('click', nodeClickHand);
        });
        function nodeClickHand(event) {
            const index = event.target.className;
            const board = gameInfo[`${gameInfo.currentPlayer}Board`]['boardInformation']['board'];
            if (gameInfo[`${gameInfo.currentPlayer}`].checkMove(board[index])) { //checks if node has been clicked before
                DOMNodes.forEach((node) => node.removeEventListener('click', nodeClickHand));
                finishRound(event.target, index);
                return;
            }
            alert('Cannot select this node, please try again');
        }
    }

    function finishRound(div, index) {
        const result = gameInfo[`${gameInfo.currentPlayer}Board`].receiveAttack(index);
        display.updateBoardColor(div, result);
        changePlayer();
        playGame();
    }

    function computerPlay() {
        let index = gameInfo.cpu.generateMove();
        const board = gameInfo.cpuBoard.boardInformation.board;
        while (!gameInfo.cpu.checkMove(board[index])) {
            console.log(`invalid with ${index}, retrying with....`);
            index = gameInfo.cpu.generateMove();
            console.log(index);
        }
        const div = document.querySelector(`#Computer div[class='${index}']`);
        finishRound(div, index);
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