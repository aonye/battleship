import gameBoardFact from './modules/Gameboard';
import playerFact from './modules/player';
import display from './modules/display';

const initialize = (() => {
    const form = document.getElementById('form');
    const input = document.querySelector('#name');
    const submit = document.querySelector('#name + button');
    const vertical = document.querySelector('#vertical');
    const newGame = document.querySelector('#newgame');
    const gameInfo = {};

    setTimeout(() => {
        start();
    }, 2000); //2000, change to single digit for debugging

    function start() {
        display.changeBulletMsg('Player, please enter your name below: ');
        display.fadeInNode(form);
    }

    function initSettings(playerName) {
        //error check - cannot name yourself Computer.
        gameInfo['player'] = playerFact(playerName);
        gameInfo['playerBoardInfo'] = gameBoardFact();
        gameInfo['cpu'] = playerFact('Computer');
        gameInfo['cpuBoardInfo'] = gameBoardFact();
        gameInfo.winner === true ? togglePlayer() : gameInfo['currentPlayer'] = pickRandStarter(Math.floor(Math.random() * 2));
        display.renderBoard(gameInfo['player'].name);
        display.renderBoard(gameInfo['cpu'].name);
        placeShipPhase();
    }

    function placeShipPhase() {
        if (gameInfo.playerBoardInfo.getNumOfShips() === 5 && gameInfo.cpuBoardInfo.getNumOfShips() === 5) {
            display.changeBulletMsg('Finished ship placing phase');
            display.toggleNode(vertical);
            setTimeout(() => {
                playGame();
            }, 2000); //2000
            return;
        }
        insertShip();
    }

    function insertShip() {
        const currentPlayer = getPlayer();
        const CPBoardInfo = getCPBoardInfo();
        const { shipName, length } = CPBoardInfo.getShipInfo();
        const nodeList = document.querySelectorAll(`#${currentPlayer.name} div`);
        if (currentPlayer.name !== 'Computer') {
            display.changeBulletMsg(`Please select node to place ship: ${shipName} (${length}).`);
            nodeList.forEach((node) => {
                node.addEventListener('click', nodeEventHand);
            });
        } else {
            display.changeBulletMsg(`Computer is placing ship: ${shipName} (${length}).`);
            setTimeout(() => {
                computerPick();
            }, 1500); //1500
        }

        function nodeEventHand(event) {
            const id = matchNumber(event.target.id);
            if (CPBoardInfo.checkShipPlacement(currentPlayer.name, id)) {
                const coordArr = CPBoardInfo.placeShip(id);
                display.highlightShips(currentPlayer.name, coordArr);
                nodeList.forEach((node) => { node.removeEventListener('click', nodeEventHand) });
                togglePlayer();
                placeShipPhase();
            }
        }

        function computerPick() {
            let move;
            do {
                if (Math.floor(Math.random() * 2)) { // returns 0 or 1, randomly toggle Vertical
                    CPBoardInfo.toggleVertical();
                }
                move = currentPlayer.generateMove();
            } while (!CPBoardInfo.checkShipPlacement(currentPlayer.name, move));
            const coordArr = CPBoardInfo.placeShip(move);
            display.highlightShips(getPlayer().name, coordArr); // show cpu ships for debugging
            togglePlayer();
            placeShipPhase();
        }
    }

    function getPlayer() {
        return gameInfo[`${gameInfo.currentPlayer}`];
    }

    function getCPBoardInfo() {
        return gameInfo[`${gameInfo.currentPlayer}BoardInfo`];
    }

    function getOpponent() {
        return gameInfo.currentPlayer === 'player' ? gameInfo['cpu'] : gameInfo['player'];
    }

    function getOpponentBoardInfo() {
        return gameInfo.currentPlayer === 'player' ? gameInfo[`cpuBoardInfo`] : gameInfo['playerBoardInfo'];
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

    function playGame() { //player logic:
        //currentPlayer selects node on the opposing board
        //Checks if it's a hit or a miss
        //If hit, check if the ship has been sunk
        if (gameInfo.playerBoardInfo.isAllSunk()) {
            display.changeBulletMsg(`${gameInfo.cpu.name} is the winner!`);
            display.toggleNode(newGame);
            return;
        }
        else if (gameInfo.cpuBoardInfo.isAllSunk()) {
            display.changeBulletMsg(`${gameInfo.player.name} is the winner!`);
            display.toggleNode(newGame);
            return;
        }
        else {
            playRound();
        }
    }

    function playRound() {
        let index;
        const opponent = getOpponent();
        const board = getOpponentBoardInfo().board;
        const DOMNodes = document.querySelectorAll(`#${getOpponent().name} div`); //select opponent board

        switch (gameInfo.currentPlayer) {
            case 'player': {
                display.changeBulletMsg('Your turn to attack!');
                DOMNodes.forEach((node) => {
                    node.addEventListener('click', nodeClickHand); //handles recursion
                });
                break;
            }
            case 'cpu': {
                display.changeBulletMsg('Enemy fire!');
                setTimeout(() => {
                    computerRound();
                }, 1000); //1000
                break;
            }
        }

        function nodeClickHand(event) {
            index = matchNumber(event.target.id);
            if (opponent.checkMove(board[index])) { //checks if node has been clicked before
                DOMNodes.forEach((node) => node.removeEventListener('click', nodeClickHand));
                finishRound(event.target, index);
                return;
            }
            alert('Cannot select this node, please try again');
        }

        function computerRound() {
            do {
                index = gameInfo.cpu.generateMove();
            } while (!opponent.checkMove(board[index]));
            const div = document.querySelector(`#${getOpponent().name} div[id = '${getOpponent().name + index}']`);
            finishRound(div, index);
        }

        function finishRound(div, index) {
            const { ship, result } = getOpponentBoardInfo().receiveAttack(index);
            if (result && ship.isSunk()) {
                display.changeBulletMsg(`${getOpponent.name} has sunk ${ship.name} (${ship.length}).`);
                display.updateBoardResult(div, result);
                display.shipDestroyed(ship.name, getOpponent().name, getOpponentBoardInfo().board);
                setTimeout(() => {
                    togglePlayer();
                    playGame();
                }, 2000); //2000
                return;
            }
            display.updateBoardResult(div, result);
            togglePlayer();
            playGame();
        }
    }

    function matchNumber(id) {
        const regex = /\d+/gm;
        return id.match(regex)[0];
    }

    function submitHand(event) {
        event.preventDefault(); //prevent page from refreshing
        const val = input.value;
        input.value = '';
        if (val) { //truthy value
            if (val === 'Computer') {
                display.changeBulletMsg(`You cannot be a 'Computer' Beep Boop.`);
                setTimeout(() => {
                    display.changeBulletMsg('Player, please enter your name below: ');
                }, 2000); //2000
                return;
            } else if (val.length > 15) {
                display.changeBulletMsg(`Name is too long(must be < 15 chars).Try again.`);
                setTimeout(() => {
                    display.changeBulletMsg('Player, please enter your name below: ');
                }, 2000); //2000
                return;
            }
            display.changeBulletMsg(`Welcome aboard, ${val}. Making grid..`);
            setTimeout(() => {
                display.toggleNode(form); //cannot set opacity 0 as overlap will cause eventHand issues
                display.toggleNode(vertical);
                initSettings(`${val}`);
            }, 2000); ///2000
        }
    }

    function verticalClickHand(event) {
        display.toggleVerticalBtn(event.target);
        gameInfo.playerBoardInfo.toggleVertical();
    }

    function newGameHand() {
        display.toggleNode(newGame);
        display.resetDOM();
        display.toggleNode(vertical);
        gameInfo['winner'] = true;
        initSettings(gameInfo.player.name);
    }

    submit.addEventListener('click', submitHand);
    vertical.addEventListener('click', verticalClickHand);
    newGame.addEventListener('click', newGameHand);

})();

export default initialize;