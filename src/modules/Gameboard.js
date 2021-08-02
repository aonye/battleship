// Create Gameboard factory.
// Note that we have not yet created any User Interface. We should know our code is coming together by running the tests.


// You shouldn’t be relying on console.logs or DOM methods to make sure your code is doing what you expect it to.
// Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or not 
// the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
// Gameboards should keep track of missed attacks so they can display them properly.
// Gameboards should be able to report whether or not all of their ships have been sunk.

import makeShip from './makeship';

//takes 5 coordinates before returning an appropriate gameboard.

const gameBoard = () => {
    //10x10 board
    const board = initializeArr();
    const ships = [];
    let isVertical = false;

    function initializeArr() {
        let arr = new Array(100)
        for (let i = 0; i < arr.length; i++) {
            arr[i] = { containShip: false, hasBeenHit: false }
        }
        return arr;
    }

    // function convertCoordinate(coordinate) {
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

    function placeShip(coordinate) {
        //alignment is either vertical or horizontal
        // Gameboards should be able to place ships at specific coordinates 
        // by calling the ship factory function.
        const { name, length } = getShipInfo();
        const newShip = makeShip(name, length);
        coordinate = parseFloat(coordinate);
        for (let i = 0; i < length; i++) {
            if (isVertical === true) {
                let vertAdjust = i * 10;
                board[coordinate + vertAdjust]['containShip'] = true;
                board[coordinate + vertAdjust]['shipName'] = name;
                board[coordinate + vertAdjust]['position'] = i;
            } else {
                board[coordinate + i]['containShip'] = true;
                board[coordinate + i]['shipName'] = name;
                board[coordinate + i]['position'] = i;
            }
        }
        ships.push(newShip);
    }

    function toggleVertical() {
        if (isVertical === true) {
            isVertical = false;
        } else {
            isVertical = true;
        }
    }

    function receiveAttack(coord) {
        if (board[coord]['hasBeenHit'] === false) {
            board[coord]['hasBeenHit'] = true;
            if (board[coord]['containShip'] === true) {
                const ship = getShip(board[coord]['shipName']);
                ship.hit(board[coord]['position']); //record successful hit
                return { ship, result: true };
            } else { //unsuccessful 
                return { ship: undefined, result: false };
            }
        }
    }

    function getShip(name) {
        const locatedShip = ships.filter((ship) => {
            return ship['name'] === name; //filter array for ships for ship hit
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

    function verticalStatus() {
        return isVertical;
    }

    function getNumOfShips() {
        return ships.length;
    }

    function getShipInfo() {
        switch (ships.length) {
            case 0: {
                return { length: 5, name: 'Carrier' };
            }
            case 1: {
                return { length: 4, name: 'Battleship' };
            }
            case 2: {
                return { length: 3, name: 'Cruiser' };
            }
            case 3: {
                return { length: 3, name: 'Submarine' };
            }
            case 4: {
                return { length: 2, name: 'Destroyer' };
            }
            default: {
                console.log('this should never be printed');
            }

        }
    }

    return { placeShip, toggleVertical, verticalStatus, getNumOfShips, getShipInfo, receiveAttack, isAllSunk, board, ships };
};

export default gameBoard;