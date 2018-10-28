import * as THREE from 'three';
import { Engine } from './engine';
import { EditorControls } from './three-editorcontrols';

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
        // var m = new THREE.MeshNormalMaterial( { color: 0x00ff00 } );
        // this.material('red', m);
        this.material('red', new THREE.MeshLambertMaterial({ color: 0xff0000 }));
        this.material('green', new THREE.MeshLambertMaterial({ color: 0x00ff00 }));
        this.material('blue', new THREE.MeshLambertMaterial({ color: 0x0000ff }));
        this.material('yellow', new THREE.MeshLambertMaterial({ color: 0xffff00 }));
    }

    createBlockFromPiece(p) {
        this.blocks.push(
            this.createBlock(p.x, p.y, p.width, p.height, p.color)
        );
    }

    createBlock(x, y, w, h, color) {
        const m = this.material(color);
        const g = this.geometry(color);

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

    init(canvas) {
        super.init(canvas);
        this.controls = new EditorControls(this.camera, this.canvas);
        this.start();
    }

    exit() {
        this.stop();
        this.controls.dispose();
        this.controls = null;
        super.exit();
    }

    create() {
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
 