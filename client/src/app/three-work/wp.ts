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

    get left() {
        return this.x;
    }

    get top() {
        return this.y;
    }

    get right() {
        return this.x + this.width;
    }

    get bottom() {
        return this.y + this.height;
    }

    intersection(other) {
        const result = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };

        if (!other) return result;

        var leftX   = Math.max( this.left, other.left );
        var rightX  = Math.min( this.right, other.right );
        var topY    = Math.max( this.top, other.top );
        var bottomY = Math.min( this.bottom, other.bottom );
        
        if ( leftX < rightX && topY < bottomY ) {
          result.x = leftX;
          result.y = topY;
          result.width = rightX-leftX;
          result.height = bottomY-topY;
        } else {
          // Rectangles do not overlap, or overlap has an area of zero (edge/corner overlap)
        } 
        
        return result;
    }

    moveHorizontal(x) {
        this.x += x;
    }

    moveVertical(y) {
        this.y += y;
    }
}

export class Board {
    pieces: Piece[] = [];

    constructor() {
        this.createPieces();
    }

    createPieces() {
        this.createPiece('green', 0, 0, 1, 2);
        this.createPiece('red',   1, 0, 2, 2);
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

    overlaps(piece) {
        return this.pieces.filter((p) => {
            if (p === piece) return false;
            const r = p.intersection(piece);
            return r.width && r.height;
        });
    }

    isInBounds(p) {
        return (p.x >= 0) && (p.y >= 0) && (p.right < 5) && (p.bottom < 6);
    }

    isValidEmptyPosition(p) {
        let result = true;
        const inBounds = this.isInBounds(p);
        if (!inBounds) {
            result = false;
        } else {
            const others = this.overlaps(p)
            result = others.length === 0
        }
        return result;
    }

    movePieceHorizontal(p, d) {
        p.x += (d < 0 ? -1 : 1);
        
console.log('PIECE.horz', p);
        const others = this.overlaps(p);
console.log('OTHERS', others);
        others.forEach(o => this.movePieceHorizontal(o, d))
    }

    canMovePieceHorizontal(p, d) {
        let result = true;
        const orgX= p.x;
        p.x += (d < 0 ? -1 : 1);
        const inBounds = this.isInBounds(p);
        if (inBounds) {
            const others = this.overlaps(p);
            if (others.length > 0) {
                result = others.every(o => this.canMovePieceHorizontal(o, d))
            }
            else {
                result = true;
            }
        } else {
            result = false;
        }
        p.x = orgX;
        return result;
    }

    movePieceVertical(p, d) {
        p.y += (d < 0 ? -1 : 1);
        const others = this.overlaps(p);
        others.forEach(o => this.movePieceVertical(o, d))
    }

    canMovePieceVertical(p, d) {
        let result = true;
        const orgY = p.y;
        p.y += (d < 0 ? -1 : 1);
        const inBounds = this.isInBounds(p);
        if (inBounds) {
            const others = this.overlaps(p);
            if (others.length > 0) {
                result = others.every(o => this.canMovePieceVertical(o, d))
            }
            else {
                result = true;
            }
        } else {
            result = false;
        }
        p.y = orgY;
        return result;
    }

    canMovePieceDown(p) {
        return this.canMovePieceVertical(p, 1);
    }

    canMovePieceUp(p) {
        return this.canMovePieceVertical(p, -1);
    }
}
