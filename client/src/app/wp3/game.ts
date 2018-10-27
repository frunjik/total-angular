import * as THREE from 'three';
import { Engine } from './engine';

class Piece {
    x;
    y;
    width;
    height;
    color;
    constructor(c, x, y, w, h) {
        this.x = x;
        this.y = y;
        this.color = c;
        this.width = w;
        this.height = h;
    }
}

class Board {
    pieces = [];

    constructor() {
        this.createPieces();
    }

    createPieces() {
        this.createPiece('red',   1, 0, 2, 2);
        // this.createPiece('green', 0, 0, 1, 2);
        // this.createPiece('green', 3, 0, 1, 2);

        // this.createPiece('green', 0, 2, 1, 2);
        // this.createPiece('blue',  1, 2, 2, 1);
        // this.createPiece('green', 3, 2, 1, 2);

        // this.createPiece('yellow',0, 4, 1, 1);
        // this.createPiece('yellow',1, 3, 1, 1);
        // this.createPiece('yellow',2, 3, 1, 1);
        // this.createPiece('yellow',3, 4, 1, 1);
    }

    createPiece(c, x, y, w, h) {
        this.pieces.push(new Piece(c, x, y, w, h));
    }
}

export class Game extends Engine {

    s = 10;
    position = new THREE.Vector3(-15, 1, -20);
    blocks = [];
    board = new Board();

    createShapes() {
        this.geometry('red', new THREE.BoxGeometry(this.s * 2, 1, this.s * 2));
        this.geometry('green', new THREE.BoxGeometry(this.s * 1, 1, this.s * 2));
        this.geometry('blue', new THREE.BoxGeometry(this.s * 2, 1, this.s * 1));
        this.geometry('yellow', new THREE.BoxGeometry(this.s * 1, 1, this.s * 1));
    }

    createMaterials() {
        // const m = new THREE.LineBasicMaterial({ 
        //     color: 0xff0000,
        //     opacity: 0,
        //     linewidth: 10,
        //     scale: 2,
        //     dashSize: 4,
        //     gapSize: 4
        // });


// var m = new THREE.LineDashedMaterial( {
// 	color: 0xffffff,
// 	linewidth: 1,
// 	scale: 1,
// 	dashSize: 3,
// 	gapSize: 1,
// } );        

// var m = new THREE.MeshBasicMaterial( { wireframe: true } );
var m = new THREE.MeshNormalMaterial( { color: 0x00ff00 } );

console.log(m);
        // this.material('red', new THREE.MeshLambertMaterial({ color: 0xff0000 }));
        // this.material('green', new THREE.MeshLambertMaterial({ color: 0x00ff00 }));
        // this.material('blue', new THREE.MeshLambertMaterial({ color: 0x0000ff }));
        // this.material('yellow', new THREE.MeshLambertMaterial({ color: 0xffff00 }));
        this.material('red', m);
    }

    createBlockFromPiece(p) {
        this.blocks.push(
            this.createBlock(p.x, p.y, p.width, p.height, p.color)
        );
    }

    createBlock(x, y, w, h, color) {

        const m = this.material(color);
        const g = this.geometry(color);
        // g.computeLineDistances();
        // console.log('M', m);

        const b = new THREE.Mesh(g, m);
        b.position.x = this.position.x + (this.s * (x + (w-1)/2));
        b.position.y = 0.5;
        b.position.z = this.position.z + (this.s * (y + (h-1)/2));
        b.name = color;

        return b;
    }

    createBlocks() {
        this.createShapes();
        this.createMaterials();
        this.board.pieces.forEach(p => this.createBlockFromPiece(p));
    }

    create() {

console.log('wp3.game');


       super.create();
       this.createBlocks();
       this.blocks.forEach(b => this.scene.add(b));
    }

    destroy() {
       this.blocks.forEach(b => this.scene.remove(b));
       this.blocks = [];
       super.destroy();
    }
}
 