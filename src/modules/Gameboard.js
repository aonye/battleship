// Create Gameboard factory.
// Note that we have not yet created any User Interface. We should know our code is coming together by running the tests.


// You shouldn’t be relying on console.logs or DOM methods to make sure your code is doing what you expect it to.
// Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or not 
// the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
// Gameboards should keep track of missed attacks so they can display them properly.
// Gameboards should be able to report whether or not all of their ships have been sunk.

import ship from './makeship';

//takes 5 coordinates before returning an appropriate gameboard.

const gameBoard = () => {
    const boardInformation = {
        board: initializeArr(),
        ships: [],
        winner: false,
        isVertical: false,
    };
    //10x10 board

    function initializeArr() {
        let arr = new Array(100)
        for (let i = 0; i < arr.length; i++) {
            arr[i] = { containShip: false, hasBeenHit: false }
        }
        return arr;
    }

    function checkValidPlacement(coordinate) {

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

    function placeShip(name, length, coordinate) { //alignment is either vertical or horizontal
        // Gameboards should be able to place ships at specific coordinates 
        // by calling the ship factory function.
        //coordinate = convertCoordinate(coordinate);

        //pretend we place ship of length 4 at arr position 0.
        let newShip = ship(name, length);
        for (let i = 0; i < newShip.length; i++) {
            if (boardInformation['isVertical'] === true) {
                let vertAdjust = i * 10;
                boardInformation['board'][coordinate + vertAdjust]['containShip'] = true;
                boardInformation['board'][coordinate + vertAdjust]['shipName'] = name;
                boardInformation['board'][coordinate + vertAdjust]['position'] = i;
            } else {
                boardInformation['board'][coordinate]['containShip'] = true;
                boardInformation['board'][coordinate]['shipName'] = name;
                boardInformation['board'][coordinate]['position'] = i;
            }
        }
        boardInformation['ships'].push(newShip);
    }

    function toggleVertical() {
        if (boardInformation['isVertical'] === true) {
            boardInformation['isVertical'] = false;
        } else {
            boardInformation['isVertical'] = true;
        }
    }

    function receiveAttack(coord) {
        const board = boardInformation.board;
        if (board[coord]['hasBeenHit'] === false) {
            board[coord]['hasBeenHit'] = true;
            if (board[coord]['containShip'] === true) {
                let ship = getShip(board[coord]['shipName']); //successful hit
                ship.hit(board[coord]['position']);
                return true;
            } else { //unsuccessful 
                return false;
            }
        }
    }

    function getShip(name) {
        let locatedShip = boardInformation['ships'].filter((ships) => {
            return ships['name'] === name;
        });
        let shipObj = locatedShip[0];
        return shipObj;
    }


    function isAllSunk() {
        let shipArr = boardInformation['ships'];
        for (let i = 0; i < shipArr.length; i++) {
            if (shipArr[i].isSunk() === false) {
                return false;
            }
        }
        //return true;
        return false;
    }

    return { placeShip, toggleVertical, receiveAttack, isAllSunk, boardInformation };
};

export default gameBoard;