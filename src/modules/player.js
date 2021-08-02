const Player = (name) => {

    function checkMove(elem) {
        return elem['hasBeenHit'] === true ? false : true;
    }

    function generateMove() {
        return Math.floor(Math.random() * 99);
    }

    return name === 'Computer' ? { name, checkMove, generateMove } : { name, checkMove }; //Players don't need to generate moves
};

export default Player;