import gameBoard from "../modules/Gameboard";

const mockBoard = gameBoard();

test('Ship database, no ships placed', () => {
    expect(mockBoard.getShipInfo()).toEqual({ length: 5, shipName: 'Carrier' });
});

test('Valid ship placement check', () => { //ship will be at index 5,6,7,8,9;
    expect(mockBoard.checkShipPlacement('Computer', 5)).toEqual(true);
});

test('Invalid ship placement check, wrapping error', () => { //ship will be at index 6,7,8,9 - cannot wrap to 10 as it is next row
    expect(mockBoard.checkShipPlacement('Computer', 6)).toEqual(false);
});

test('Valid vertical ship placement check', () => { //ship will be at index 0,10,20,30,40
    mockBoard.toggleVertical();
    expect(mockBoard.checkShipPlacement('Computer', 0)).toEqual(true);
});

test('Invalid vertical ship placement check', () => { //ship will be at index 60,70,80,90 - 100 out of bounds
    //vertical is already toggled here, dont do it again
    expect(mockBoard.checkShipPlacement('Computer', 60)).toEqual(false);
});

test('Num of ships before placement', () => {
    //vertical is already toggled here, dont do it again
    expect(mockBoard.getNumOfShips()).toEqual(0);
});

test('Place ship', () => {
    //vertical is toggled ON from previously
    const nodeValue = {
        containShip: true,
        hasBeenHit: false,
        shipName: 'Carrier',
        position: 3,
    }
    expect(mockBoard.placeShip(5)).toEqual([5, 15, 25, 35, 45]);
    expect(mockBoard.board[35]).toEqual(nodeValue);
});

test('Ship database, one ship placed', () => {
    expect(mockBoard.getShipInfo()).toEqual({ length: 4, shipName: 'Battleship' });
});

test('Place vertical 2nd ship', () => {
    mockBoard.toggleVertical(); //vertical turned off
    const nodeValue = {
        containShip: true,
        hasBeenHit: false,
        shipName: 'Battleship',
        position: 3,
    }
    expect(mockBoard.placeShip(6)).toEqual([6, 7, 8, 9]);
    expect(mockBoard.board[9]).toEqual(nodeValue);
});

test('Invalid ship placement check, ship in path', () => {
    expect(mockBoard.checkShipPlacement('Computer', 5)).toEqual(false);
});


test('Receive attack, hit', () => {
    const nodeValue = {
        containShip: true,
        hasBeenHit: true, //changes on hit
        shipName: 'Carrier',
        position: 0,
    }
    mockBoard.receiveAttack(5);
    //expect(mockBoard.receiveAttack(5)).toBe({ ship: mockShip, result: true });
    //cannot explicitly compare functions (return val) with jest as they may refer to different var through closures or bound to different 'this'
    expect(mockBoard.board[5]).toEqual(nodeValue);
});

test('Receive attack, miss', () => {
    const nodeValue = {
        containShip: false, //no ship
        hasBeenHit: true, //changes on hit
    }
    mockBoard.receiveAttack(4);
    expect(mockBoard.board[4]).toEqual(nodeValue);
    //see above with comparing functions
});

test('All ships sunk', () => {
    //atk remaining nodes
    mockBoard.receiveAttack(15);
    mockBoard.receiveAttack(25);
    mockBoard.receiveAttack(35);
    mockBoard.receiveAttack(45);
    mockBoard.receiveAttack(6);
    mockBoard.receiveAttack(7);
    mockBoard.receiveAttack(8);
    mockBoard.receiveAttack(9);
    expect(mockBoard.isAllSunk()).toEqual(true);
});
