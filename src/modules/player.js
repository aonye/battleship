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
        const { length } = boardInfo.getShipInfo(boardInfo.getNumOfShips());
        if (boardInfo.verticalStatus()) {
            for (let i = 0; i < length; i++) {
                const newCoord = i * 10 + coord;
                if (newCoord > boardInfo.board.length - 1) { //index 99, length 100
                    console.log('out of bounds', newCoord);
                    //out of bounds
                    return false;
                }
                if (boardInfo.board[newCoord]['containShip'] === true) {
                    console.log('ship in path', newCoord);
                    //already a ship present in the path
                    return false;
                }
            }
            return true;
        } else {
            let rowLimit = getRowLimit(coord);
            for (let i = 0; i < length; i++) {
                if (coord + i > rowLimit) {
                    console.log('wrap error', coord + i);
                    //ships cannot wrap around a row
                    return false;
                }
                if (boardInfo.board[coord + i]['containShip'] === true) {
                    console.log('ship in path', coord + i);
                    //already a ship present in the path
                    return false;
                }
            }
            return true;
        }

        function getRowLimit(num) { //helper function returns the last row val
            return parseFloat(Math.trunc(num / 10) + '9');
        }
    }

    function generateMove() {
        return Math.floor(Math.random() * 99);
    }

    return name === 'Computer' ? { name, boardInfo, checkMove, generateMove, checkShipPlacement } : { name, boardInfo, checkMove, checkShipPlacement };
};



export default Player;


//