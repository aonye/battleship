const display = (() => {
    const container = document.querySelector('.container');


    function renderBoard(playerName) {
        let mainDiv = document.createElement('div');
        mainDiv.classList = 'board';
        mainDiv.setAttribute('id', playerName);
        for (let i = 0; i <= 99; i++) {
            let div = document.createElement('div');
            div.classList = i;
            mainDiv.appendChild(div);
        }
        container.append(mainDiv);
    }

    function updateBoardColor(elem, result) {
        if (result === false) {
            elem.style.backgroundColor = 'rgb(178, 34, 34)';
        } else {
            elem.style.backgroundColor = 'rgb(51, 204, 51)';
        }
    }

    return { updateBoardColor, renderBoard };

})();

export default display;