const display = (() => {
    const container = document.querySelector('.container');
    const bulletin = document.querySelector('#bulletin');

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

    function highlightShips(name, array) {
        for (let i = 0; i < array.length; i++) {
            const div = document.querySelector(`#${name + array[i]}`);
            div.style.backgroundColor = 'rgb(235, 199, 235)'; //plum
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

    function shipDestroyed(sunkShip, name, board) {
        for (let i = 0; i < board.length; i++) {
            if (board[i].shipName === sunkShip) {
                const div = document.querySelector(`#${name + i}`);
                div.style.transition = 'background-color 0.75s ease';
                div.style.backgroundColor = 'rgb(40, 40, 40)';
            }
        }
    }

    function changeBulletMsg(str) {
        bulletin.textContent = str;
    }

    function fadeInNode(nodeID) {
        nodeID.style.transition = 'opacity 0.5s ease-in';
        nodeID.style.opacity = '1';
    }

    function fadeOutNode(nodeID) {
        nodeID.style.transition = 'opacity, 0.5s ease-out';
        nodeID.style.opacity = '0';
    }

    function toggleNode(nodeID) {
        nodeID.style.display === 'none' ? nodeID.style.display = 'flex' : nodeID.style.display = 'none';
    }

    function toggleVerticalBtn(btn) {
        btn.textContent === 'Vertical' ? btn.textContent = 'Horizontal' : btn.textContent = 'Vertical';
    }

    function resetDOM() {
        while (container.hasChildNodes()) {
            container.removeChild(container.lastChild);
        }
    }

    return { resetDOM, highlightShips, updateBoardResult, renderBoard, shipDestroyed, changeBulletMsg, toggleVerticalBtn, toggleNode, fadeInNode, fadeOutNode };

})();

export default display;