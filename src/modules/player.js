const Player = (name) => {
    const playerInfo = {
        name,
    }

    function checkMove(elem) {
        if (elem['hasBeenHit'] === true) {
            return false; //invalid move
        } else {
            return true; //valid move
        }
    }

    function generateMove() {
        return Math.floor(Math.random() * 99);
    }

    return playerInfo.name === 'Computer' ? { playerInfo, checkMove, generateMove } : { playerInfo, checkMove };
};



export default Player;