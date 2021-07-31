import gameBoardFact from './modules/Gameboard';
import playerFact from './modules/player';
import display from './modules/display';

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

    function initGame() {
        //get input for player's real name and insert it into this function
        //error check - cannot name yourself Computer.
        gameInfo['player'] = playerFact('Anon', gameBoardFact());
        gameInfo['cpu'] = playerFact('Computer', gameBoardFact());
        gameInfo['currentPlayer'] = pickRandStarter(Math.floor(Math.random() * 2));
        display.renderBoard(gameInfo['player'].name);
        display.renderBoard(gameInfo['cpu'].name);

        console.log(`${getPlayer().name} has been randomly chosen to start first`);
        placeShipPhase();
    }

    function placeShipPhase() {
        if (gameInfo.player.boardInfo.getNumOfShips() === 5 && gameInfo.cpu.boardInfo.getNumOfShips() === 5) {
            console.log('finished placing ships');
            playGame();
            return;
        }
        insertShip();
    }


    function insertShip() {
        const currentPlayer = getPlayer();
        const nodeList = document.querySelectorAll(`#${getPlayer().name} div`);
        if (getPlayer().name !== 'Computer') {
            nodeList.forEach((node) => {
                node.addEventListener('click', nodeEventHand);
            });
        } else {
            computerPick();
        }
        function nodeEventHand(event) {
            const id = matchNumber(event.target.id);
            if (currentPlayer.checkShipPlacement(id)) {
                currentPlayer.boardInfo.placeShip(id);
                nodeList.forEach((node) => { node.removeEventListener('click', nodeEventHand) });
                display.updateShips(getPlayer().name, currentPlayer.boardInfo.board);
                togglePlayer();
                placeShipPhase();
            }
        }

        function computerPick() {
            let move;
            do {
                if (Math.floor(Math.random() * 2)) { // returns 0 or 1, randomly toggle Vertical
                    currentPlayer.boardInfo.toggleVertical();
                }
                move = currentPlayer.generateMove();
            } while (!currentPlayer.checkShipPlacement(move));
            currentPlayer.boardInfo.placeShip(move);
            display.updateShips(getPlayer().name, currentPlayer.boardInfo.board);
            togglePlayer();
            placeShipPhase();
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
        if (getPlayer().name !== 'Computer') { //getPlayer is a pure fxn.
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
        if (gameInfo.player.boardInfo.isAllSunk()) {
            console.log('made it in here');
            return;
        }
        else if (gameInfo.cpu.boardInfo.isAllSunk()) {
            console.log('cpu has won');
            return;
        }
        else {
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
        const DOMNodes = document.querySelectorAll(`#${getOpponent().name} div`); //select opponent board
        DOMNodes.forEach((node) => {
            node.addEventListener('click', nodeClickHand);
        });
        function nodeClickHand(event) {
            const index = matchNumber(event.target.id);
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

    function computerPlay() {
        let index;
        const opponent = getOpponent();
        const board = opponent.boardInfo.board;
        do {
            index = gameInfo.cpu.generateMove();
        } while (!opponent.checkMove(board[index]));
        const div = document.querySelector(`#${getOpponent().name} div[id='${getOpponent().name + index}']`);
        finishRound(div, index);
    }

    function finishRound(div, index) {
        const { ship, result } = getOpponent().boardInfo.receiveAttack(index);
        if (result) {
            if (ship.isSunk()) {
                console.log('ship sunk')
            }
            //console.log(`${name}(${length}) has been sunk by ${getPlayer().name}`);
            //display.shipsDestroyed(name, getOpponent.boardInfo.board);
        }
        display.updateBoardResult(div, result);
        togglePlayer();
        playGame();
    }

    function matchNumber(id) {
        const regex = /\d+/gm;
        return id.match(regex)[0];
    }


})();

export default initialize;