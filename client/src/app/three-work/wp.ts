export class Piece {
    x;
    y;
    color;
    width;
    height;
    constructor(c, x, y, w, h) {
        this.x = x;
        this.y = y;
        this.color = c;
        this.width = w;
        this.height = h;
    }
}

export class Board {
    pieces = [];

    constructor() {
        this.createPieces();
    }

    createPieces() {
        this.createPiece('red',   1, 0, 2, 2);
        this.createPiece('green', 0, 0, 1, 2);
        this.createPiece('green', 3, 0, 1, 2);

        this.createPiece('green', 0, 2, 1, 2);
        this.createPiece('blue',  1, 2, 2, 1);
        this.createPiece('green', 3, 2, 1, 2);

        this.createPiece('yellow',0, 4, 1, 1);
        this.createPiece('yellow',1, 3, 1, 1);
        this.createPiece('yellow',2, 3, 1, 1);
        this.createPiece('yellow',3, 4, 1, 1);
    }

    createPiece(c, x, y, w, h) {
        this.pieces.push(new Piece(c, x, y, w, h));
    }
}
