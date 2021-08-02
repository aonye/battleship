const makeShip = (name, length) => {
    return {
        name,
        length,
        hits: new Array(length),
        hit(num) {
            if (!this.hits[num]) {
                this.hits[num] = 'X';
            }
        },
        isSunk() {
            for (let i = 0; i < this.hits.length; i++) {
                if (this.hits[i] === undefined) {
                    return false;
                }
            }
            return true;
        },
    };
}

export default makeShip;
