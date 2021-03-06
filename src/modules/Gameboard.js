import makeShip from './makeship';
// Instructions
// Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or not 
// the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
// Gameboards should keep track of missed attacks so they can display them properly.
// Gameboards should be able to report whether or not all of their ships have been sunk.
const gameBoard = () => {
    const board = initArr(); //10x10 board
    const ships = [];
    let isVertical = false;

    function initArr() {
        let arr = new Array(100);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = { containShip: false, hasBeenHit: false }
        }
        return arr;
    }

    // function convertCoord(coordinate) { //function that converts 'A1' type coord input into arr index
    //     let letter = coordinate.slice(0, 1);
    //     let num = coordinate.slice(1, coordinate.length);
    //     let decVal = letter.charCodeAt();
    //     let letterToNum = 0;
    //     while (decVal > 65) {
    //         decVal--;
    //         letterToNum += 10;
    //     }
    //     return parseFloat(letterToNum) + parseFloat(num) - 1;
    // }

    function checkShipPlacement(name, coordinate) {
        const coord = parseFloat(coordinate);
        const { length } = getShipInfo();
        if (isVertical) {
            for (let i = 0; i < length; i++) {
                const newCoord = i * 10 + coord;
                if (newCoord > board.length - 1) { //index 99, length 100
                    return name !== 'Computer' ? (alert('Error, out of bounds.'), false) : false; //ignore error for computer
                    //out of bounds
                }
                if (board[newCoord]['containShip'] === true) {
                    return name !== 'Computer' ? (alert('Error, ship in path.'), false) : false;
                    //ship present in the path
                }
            }
            return true;
        } else {
            const rowLimit = getRowLimit(coord);
            for (let i = 0; i < length; i++) {
                if (coord + i > rowLimit) {
                    return name !== 'Computer' ? (alert('Error, cannot wrap ship.'), false) : false;
                    //coord+i, ships cannot wrap around a row
                }
                if (board[coord + i]['containShip'] === true) {
                    return name !== 'Computer' ? (alert('Error, ship in path.'), false) : false;
                }
            }
            return true;
        }

        function getRowLimit(num) { //helper function returns the last row val
            return parseFloat(Math.trunc(num / 10) + '9');
        }
    }

    function placeShip(coordinate) {
        const { shipName, length } = getShipInfo();
        const newShip = makeShip(shipName, length);
        coordinate = parseFloat(coordinate);
        const coordArr = [];
        for (let i = 0; i < length; i++) {
            if (isVertical === true) {
                let vertAdjust = i * 10;
                board[coordinate + vertAdjust]['containShip'] = true;
                board[coordinate + vertAdjust]['shipName'] = shipName;
                board[coordinate + vertAdjust]['position'] = i;
                coordArr.push(coordinate + vertAdjust);
            } else {
                board[coordinate + i]['containShip'] = true;
                board[coordinate + i]['shipName'] = shipName;
                board[coordinate + i]['position'] = i;
                coordArr.push(coordinate + i);
            }
        }
        ships.push(newShip);
        return coordArr;
    }

    function toggleVertical() {
        isVertical === true ? isVertical = false : isVertical = true;
    }

    function receiveAttack(coord) {
        //do not need to error check if coord already attacked in receiveAtk as its already done
        board[coord]['hasBeenHit'] = true;
        if (board[coord]['containShip'] === true) {
            const ship = getShip(board[coord]['shipName']);
            ship.hit(board[coord]['position']); //record successful hit
            return { ship, result: true };
        } else { //unsuccessful 
            return { ship: undefined, result: false };
        }
    }

    function getShip(shipName) {
        const locatedShip = ships.filter((ship) => {
            return ship['name'] === shipName; //filter array of ships for the ship hit
        });
        return locatedShip[0];
    }

    function isAllSunk() {
        for (let i = 0; i < ships.length; i++) {
            if (ships[i].isSunk() === false) {
                return false;
            }
        }
        return true;
    }

    function getNumOfShips() {
        return ships.length;
    }

    function getShipInfo() {
        switch (ships.length) {
            case 0: {
                return { length: 5, shipName: 'Carrier' };
            }
            case 1: {
                return { length: 4, shipName: 'Battleship' };
            }
            case 2: {
                return { length: 3, shipName: 'Cruiser' };
            }
            case 3: {
                return { length: 3, shipName: 'Submarine' };
            }
            case 4: {
                return { length: 2, shipName: 'Destroyer' };
            }
            default: {
                console.log('this should never be printed');
            }

        }
    }

    return { board, checkShipPlacement, placeShip, toggleVertical, getNumOfShips, getShip, getShipInfo, receiveAttack, isAllSunk };
};

export default gameBoard;