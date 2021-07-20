import gameBoard from "../modules/Gameboard";

const board = gameBoard();

// test('Ship placement', () => {
//     expect(gameBoard.placeShip()).toEqual();
// });

//receive attack - miss
//receive attack - hit

//test for isAllSunk

test('All ships sunk', () => {
    board.placeShip('mockship', 3, 'A1');
    expect(board.isAllSunk()).toEqual(false);
});
