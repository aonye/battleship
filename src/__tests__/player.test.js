import playerFactory from '../modules/player';

const mockPlayer = playerFactory('RandomName');
const arr = new Array(1);

test('Test, checkmove never hit', () => {
    arr[0] = { hasBeenHit: false };
    expect(mockPlayer.checkMove(arr[0])).toEqual(true);
});

test('Test empty', () => {
    arr[1] = { hasBeenHit: true };
    expect(mockPlayer.checkMove(arr[1])).toEqual(false);
});
