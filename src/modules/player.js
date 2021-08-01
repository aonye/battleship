const Player = (name, boardInfo) => {

    function checkMove(elem) {
        if (elem['hasBeenHit'] === true) {
            return false; //invalid move
        } else {
            return true; //valid move
        }
    }

    function checkShipPlacement(coordinate) {
        const coord = parseFloat(coordinate);
        const { length } = boardInfo.getShipInfo();
        if (boardInfo.verticalStatus()) {
            for (let i = 0; i < length; i++) {
                const newCoord = i * 10 + coord;
                if (newCoord > boardInfo.board.length - 1) { //index 99, length 100
                    return checkComp() === true ? (alert('Error, out of bounds.'), false) : false;
                    //out of bounds
                }
                if (boardInfo.board[newCoord]['containShip'] === true) {
                    return checkComp() === true ? (alert('Error, ship in path.'), false) : false;
                    //ship present in the path
                }
            }
            return true;
        } else {
            let rowLimit = getRowLimit(coord);
            for (let i = 0; i < length; i++) {
                if (coord + i > rowLimit) {
                    return checkComp() === true ? (alert('Error, cannot wrap ship.'), false) : false;
                    //coord+i, ships cannot wrap around a row
                }
                if (boardInfo.board[coord + i]['containShip'] === true) {
                    return checkComp() === true ? (alert('Error, ship in path.'), false) : false;
                }
            }
            return true;
        }

        function getRowLimit(num) { //helper function returns the last row val
            return parseFloat(Math.trunc(num / 10) + '9');
        }
    }

    function checkComp() {
        return name !== 'Computer' ? true : false;
    }

    function generateMove() {
        return Math.floor(Math.random() * 99);
    }

    return name === 'Computer' ? { name, boardInfo, checkMove, generateMove, checkShipPlacement } : { name, boardInfo, checkMove, checkShipPlacement };
};



export default Player;


//