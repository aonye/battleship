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

    startGame();

    function startGame() {
        setTimeout(() => {
            display.changeBulletMsg('Player, please enter your name below: ');
            display.fadeInNode(form);
        }, 2000); //2000
    }

    function initSettings(playerName) {
        //ship picking phase
        //get input for player's real name and insert it into this function
        //error check - cannot name yourself Computer.
        gameInfo['player'] = playerFact(playerName, gameBoardFact());
        gameInfo['cpu'] = playerFact('Computer', gameBoardFact());
        gameInfo['currentPlayer'] = pickRandStarter(Math.floor(Math.random() * 2));
        display.renderBoard(gameInfo['player'].name);
        display.renderBoard(gameInfo['cpu'].name);
        console.log(gameInfo);
        placeShipPhase();
    }

    function placeShipPhase() {
        if (gameInfo.player.boardInfo.getNumOfShips() === 5 && gameInfo.cpu.boardInfo.getNumOfShips() === 5) {
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
        const nodeList = document.querySelectorAll(`#${getPlayer().name} div`);
        const { name, length } = getPlayer().boardInfo.getShipInfo();

        if (getPlayer().name !== 'Computer') {
            display.changeBulletMsg(`Please select node to place ship: ${name}(${length}).`);
            nodeList.forEach((node) => {
                node.addEventListener('click', nodeEventHand);
            });
        } else {
            display.changeBulletMsg(`Computer is placing ship: ${name}(${length})..`);
            setTimeout(() => {
                computerPick();
            }, 1500); //1500
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
            //display.updateShips(getPlayer().name, currentPlayer.boardInfo.board); //show cpu ships for debugging
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
            display.changeBulletMsg(`${gameInfo.cpu.name} is the winner!`);
            display.toggleNode(newGame);
            return;
        }
        else if (gameInfo.cpu.boardInfo.isAllSunk()) {
            display.changeBulletMsg(`${gameInfo.player.name} is the winner!`);
            display.toggleNode(newGame);
            return;
        }
        else {
            switch (gameInfo.currentPlayer) {
                case 'player': {
                    display.changeBulletMsg('Your turn to attack!');
                    playRound(); //eventhandler handles recursion
                    break;
                }
                case 'cpu': {
                    display.changeBulletMsg('Enemy fire!');
                    setTimeout(() => {
                        computerPlay();
                    }, 1000); //1000
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
        console.log(ship);
        if (result && ship.isSunk()) {
            display.changeBulletMsg(`${gameInfo.currentPlayer} has sunk ${ship.name}(${ship.length}).`);
            display.updateBoardResult(div, result);
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
                display.changeBulletMsg(`Name is too long (must be <15 chars). Try again.`);
                setTimeout(() => {
                    display.changeBulletMsg('Player, please enter your name below: ');
                }, 2000); //2000
                return;
            }
            display.changeBulletMsg(`Welcome aboard, ${val}. Making grid..`);
            setTimeout(() => {
                display.toggleNode(form); //cannot set opacity to 0 as overlap will cause eventHand issues
                display.toggleNode(vertical);
                initSettings(`${val}`);
            }, 2000); ///2000
        }
    }

    function verticalClickHand(event) {
        display.toggleVerticalBtn(event.target);
        gameInfo.player.boardInfo.toggleVertical();
    }

    function newGameHand() {
        display.toggleNode(newGame);
        resetSettings();
        startGame();
    }

    function resetSettings() {
        display.resetDOM();
        display.fadeOutNode(form); //reset opacity to 0
        display.toggleNode(form); //retoggle since previously was untoggled to prevent conflict with verticalBtn
    }

    submit.addEventListener('click', submitHand);
    vertical.addEventListener('click', verticalClickHand);
    newGame.addEventListener('click', newGameHand);

})();

export default initialize;