import makeShip from '../modules/makeship';


test('Test hit', () => {
    let mockShip = makeShip(3);
    mockShip.hit(0);
    expect(mockShip.hits[0]).toEqual('X');
});

test('Test sunk', () => {
    let mockShip = makeShip(3);
    for (let i = 0; i < mockShip.hits.length; i++) {
        mockShip.hits[i] = 'X';
    }
    expect(mockShip.isSunk()).toEqual(true);
});

