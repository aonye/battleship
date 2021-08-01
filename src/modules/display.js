const display = (() => {
    const bulletin = document.querySelector('.bulletin');
    const container = document.querySelector('.container');

    function renderBoard(playerName) {
        let mainDiv = document.createElement('div');
        mainDiv.classList = 'board';
        mainDiv.setAttribute('id', playerName);
        for (let i = 0; i <= 99; i++) {
            let div = document.createElement('div');
            div.setAttribute('id', `${playerName + i}`);
            mainDiv.appendChild(div);
        }
        container.append(mainDiv);
    }

    function updateShips(name, board) {
        for (let i = 0; i < board.length; i++) {
            if (board[i].containShip === true) {
                const div = document.querySelector(`#${name + i}`);
                div.style.backgroundColor = 'rgb(235, 199, 235)';
            }
        }
    }

    function updateBoardResult(elem, result) {
        if (result === false) {
            elem.textContent = 'X';
            elem.classList.add('miss');
        } else {
            elem.textContent = 'O';
            elem.classList.add('hit');
        }
    }

    function shipDestroyed(name, board) {
        for (let i = 0; i < board.length; i++) {
            if (board[i].shipName === name) {
                const div = document.querySelector(`#${name + i}`);
                div.style.backgroundColor = 'rgb(235, 199, 235)';
            }
        }
    }

    function changeBulletMsg(str) {
        bulletin.textContent = str;
    }

    function unhideNode(nodeID) {
        console.log(nodeID);
        nodeID.style.transition = 'opacity 1s ease-in';
        nodeID.style.opacity = '1';
    }


    return { updateShips, updateBoardResult, renderBoard, shipDestroyed, changeBulletMsg, unhideNode };

})();

export default display;