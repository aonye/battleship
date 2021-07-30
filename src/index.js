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

    //ship picking phase

    initGame();
    //playGame();

    function placeShipPhase() {
        //console.log(gameInfo.player.boardInfo.getNumOfShips(), gameInfo.cpu.boardInfo.getNumOfShips());
        if (gameInfo.player.boardInfo.getNumOfShips() === 5 && gameInfo.cpu.boardInfo.getNumOfShips() === 5) {
            console.log('finished placing ships');
            playGame();
            return;
        }
        playerPick();
    }


    function playerPick() {
        const currentPlayer = getPlayer();
        const nodeList = document.querySelectorAll(`#${getName()} div`);
        if (getName() !== 'Computer') {
            nodeList.forEach((node) => {
                node.addEventListener('click', nodeEventHand);
            });
        } else {
            computerMove();
        }
        function nodeEventHand(event) {
            if (currentPlayer.checkShipPlacement(event.target.className)) {
                console.log('passed error checking');
                currentPlayer.boardInfo.placeShip(event.target.className);
                nodeList.forEach((node) => { node.removeEventListener('click', nodeEventHand) });
                togglePlayer();
                placeShipPhase();
            }
        }

        function computerMove() {
            let move;
            do {
                if (getRandomVertical) {
                    currentPlayer.boardInfo.toggleVertical();
                }
                move = currentPlayer.generateMove();
            } while (!currentPlayer.checkShipPlacement(move));
            currentPlayer.boardInfo.placeShip(move);
            togglePlayer();
            placeShipPhase();
            function getRandomVertical() {
                return Math.floor(Math.random() * 2);
            }
        }
    }

    function initGame() {
        //get input for player's real name and insert it into this function
        //error check - cannot name yourself Computer.
        gameInfo['player'] = playerFact('Anon', gameBoardFact());
        gameInfo['cpu'] = playerFact('Computer', gameBoardFact());
        gameInfo['currentPlayer'] = pickRandStarter(Math.floor(Math.random() * 2));
        display.renderBoard(gameInfo['player'].name);
        display.renderBoard(gameInfo['cpu'].name);

        console.log(`${getName()} has been randomly chosen to start first`);
        placeShipPhase();
    }

    function getName() { //gets currentplayer's registered name
        return gameInfo[`${gameInfo.currentPlayer}`]['name'];
    }

    function getOpponentName() {
        if (gameInfo.currentPlayer === 'player') {
            return gameInfo['cpu']['name'];
        } else {
            return gameInfo['player']['name'];
        }
    }

    function getPlayer() {
        return gameInfo[`${gameInfo.currentPlayer}`];
    }

    function getOpponent() {
        if (gameInfo.currentPlayer === 'player') {
            return gameInfo['cpu'];
        } else {
            return gameInfo['player'];
        }
    }

    function togglePlayer() {
        if (getName() !== 'Computer') { //getName is a pure fxn.
            gameInfo.currentPlayer = 'cpu';
        } else {
            gameInfo.currentPlayer = 'player';
        }
    }

    function pickRandStarter(num) {
        if (num === 0) {
            return 'player';
        }
        return 'cpu';
    }

    function playGame() {
        //Logic:
        //currentPlayer selects node on the opposing board
        //Checks if it's a hit or a miss
        //Checks if the ship has been sunk
        if (gameInfo.player.boardInfo.isAllSunk() && gameInfo.cpu.boardInfo.isAllSunk()) {
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
                    }, 2000);
                    break;
                }
            }
        }
    }

    function playRound() {
        const DOMNodes = document.querySelectorAll(`#${getOpponentName()} div`); //select opponent board
        DOMNodes.forEach((node) => {
            node.addEventListener('click', nodeClickHand);
        });
        function nodeClickHand(event) {
            const index = event.target.className;
            const opponent = getOpponent();
            const board = opponent.boardInfo.board;
            if (opponent.checkMove(board[index])) { //checks if node has been clicked before
                DOMNodes.forEach((node) => node.removeEventListener('click', nodeClickHand));
                finishRound(event.target, index);
                return;
            }
            alert('Cannot select this node, please try again');
        }
    }

    function finishRound(div, index) {
        const result = getOpponent().boardInfo.receiveAttack(index);
        display.updateBoardColor(div, result);
        togglePlayer();
        playGame();
    }

    function computerPlay() {
        let index;
        const opponent = getOpponent();
        do {
            index = gameInfo.cpu.generateMove();
        } while (!opponent.checkMove(index));
        const div = document.querySelector(`#${getOpponentName()} div[class='${index}']`);
        finishRound(div, index);
    }

})();

export default initialize;