import { TestSuite, TestCase, assert, assertEqual } from '../js/tests/unittest';
import { Piece, Board } from './wp';

export class PieceTests extends TestCase {

    testPieceIntersection() {
        const p0 = new Piece('a', 0, 0, 1, 1);
        const p1 = new Piece('b', 0, 0, 2, 2);
        const r = p0.intersection(p1);
        assertEqual(r.x, 0, 'x');
        assertEqual(r.y, 0, 'y');
        assertEqual(r.width, 1, 'w');
        assertEqual(r.height, 1, 'h');
    }

    testPieceIntersection2() {
        const p0 = new Piece('a', 0, 0, 2, 2);
        const p1 = new Piece('b', 1, 1, 2, 2);
        const r = p0.intersection(p1);
        assertEqual(r.x, 1, 'x');
        assertEqual(r.y, 1, 'y');
        assertEqual(r.width, 1, 'w');
        assertEqual(r.height, 1, 'h');
    }
}

export class WPTests extends TestCase {

    board: Board;

    setUp() {
        this.board = new Board()
    }

    testOverlap() {
        const red = this.board.pieces[1];
        red.moveVertical(2);
        const others = this.board.overlaps(red);
        assert(others.length === 3, 'expected 3 others');
    }

    testGreenBlockCantMoveDown() {
        const green = this.board.pieces[0];
        assert(!this.board.canMovePieceDown(green));
    }

    testRedBlockCanMoveDown() {
        const red = this.board.pieces[1];
        assert(this.board.canMovePieceDown(red));
    }

    testYellowBlockCanMoveDown() {
        const yellow = this.board.pieces[7];

        assertEqual(yellow.x, 1, 'x');
        assertEqual(yellow.y, 3, 'y');
        assertEqual(yellow.width, 1, 'w');
        assertEqual(yellow.height, 1, 'h');
        assert(this.board.canMovePieceDown(yellow));
    }

    testRedBlockCantMoveUp() {
        const red = this.board.pieces[1];
        assert(!this.board.canMovePieceUp(red));
    }

}
