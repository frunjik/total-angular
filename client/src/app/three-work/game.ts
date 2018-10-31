import * as THREE from 'three';
import { Engine } from './engine';
import { EditorControls } from './three-editorcontrols';
import { TransformControls } from './three-transformcontrols';
import { FirstPersonControls } from './three-firstpersoncontrols';

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
    mouseX = 0;
    mouseY = 0;
    position = new THREE.Vector3(-15, 1, -20);
    blocks = [];
    board = new Board();
    controls;
    editControls;
    transformControls;
    firstPersonControls;

    draggedBlock;
    hoveredBlock;

    raycaster;

    lastNow = 0;

    ctrl;

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

    /// @CLEAN
    /// @CLEAN
    /// @CLEAN
    /// @CLEAN
    /// @CLEAN
    /// @CLEAN

    createBlockFromPiece(p) {
        const b = this.createBlock(p.x, p.y, p.width, p.height, p.color);
        b.userData.piece = p;
        this.blocks.push(b);
    }

    resetBlockPosition(b) {
        const p = b.userData.piece;
        this.setBlockPosition(b, p.x, p.y, p.width, p.height);
    }

    setBlockPosition(b, x, y, w, h) {
        b.position.x = this.position.x + (this.s * (x + (w-1)/2));
        b.position.y = 0.5;
        b.position.z = this.position.z + (this.s * (y + (h-1)/2));
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

    /// @CLEAN
    /// @CLEAN
    /// @CLEAN
    /// @CLEAN
    /// @CLEAN

    pick() {
        if (this.draggedBlock) return;

        this.raycaster.setFromCamera({x: this.mouseX, y: this.mouseY}, this.camera);
        var intersects = this.raycaster.intersectObject(this.scene, true);
        let f = intersects.find(i => i.object.name === 'floor');
        if (f) {
            let x = intersects.indexOf(f);
            if (x>=0) {
              intersects.splice(x, 1);
            }
        }

        if (intersects.length) {
            this.hoveredBlock = intersects[0];
        }
    }

    loop(now) {
        const delta = Math.max(now - this.lastNow, 1);
        this.lastNow = now;
        if (this.controls && this.controls.update) {
            this.controls.update(delta);
        }
        this.pick();
        super.loop(delta);
    }

    init(canvas) {
        super.init(canvas);

        this.firstPersonControls = new FirstPersonControls(this.camera, this.canvas);

        this.editControls = new EditorControls(this.camera, this.canvas);
        this.editControls.enabled = true;

        this.transformControls = new TransformControls(this.camera, this.canvas);
        this.transformControls.size = 3;
        this.transformControls.attach(this.blocks[1]);
        this.transformControls.enabled = true;
        // this.scene.add(this.transformControls);

        // this.controls = this.transformControls;

        this.start();
    }

    exit() {
        this.stop();
        this.controls = null;
        this.firstPersonControls.dispose();
        this.firstPersonControls = null;
        this.editControls.dispose();
        this.editControls = null;
        this.scene.remove(this.transformControls);
        this.transformControls.detach(this.blocks[1]);
        this.transformControls.dispose();
        this.transformControls = null;
        super.exit();
    }

    create() {
       super.create();
       this.raycaster = new THREE.Raycaster();
       this.createBlocks();
       this.blocks.forEach(b => this.scene.add(b));
    }

    destroy() {
       this.blocks.forEach(b => this.scene.remove(b));
       this.blocks = [];
       this.raycaster = null;
       super.destroy();
    }

    enableEditControls() {
        this.controls = this.editControls;
    }
    
    enableTransformControls() {
        // this.controls = this.firstPersonControls;
        this.controls = this.transformControls;
    }

    onEvent(event, handler) {
        const controls = this.controls;
        if (controls && controls[handler]) {
            controls[handler](event);
        }
    }

    onMouseEnter(event) {
        this.onEvent(event, 'onMouseEnter');
    }
    onMouseLeave(event){
        this.onEvent(event, 'onMouseLeave');
    }
    onMouseMove(event){
        const mx = this.mouseX;
        const my = this.mouseY;

        this.mouseX = ( (event.clientX-this.bounds.x) / this.canvas.width ) * 2 - 1;
        this.mouseY = - ( (event.clientY-this.bounds.y) / this.canvas.height ) * 2 + 1;

        if (this.draggedBlock) {
            const s = 40;
            const dx = this.mouseX - mx;
            const dy = this.mouseY - my;

            this.draggedBlock.object.position.x += dx * s;
            this.draggedBlock.object.position.z += -dy * s;
        }

        this.onEvent(event, 'onMouseMove');
    }
    onMouseDown(event){
        if (this.hoveredBlock) {
            this.draggedBlock = this.hoveredBlock;
            this.draggedBlock.object.position.y = 3;
        }
        this.onEvent(event, 'onMouseDown');
    }
    onMouseUp(event) {
        if (this.draggedBlock) {
            this.resetBlockPosition(this.draggedBlock.object);
            this.draggedBlock = null;
        }
        this.onEvent(event, 'onMouseUp');
    }
    onKeyDown(event) {
        // if ('Control' === event.key && !this.ctrl) {
        //     this.enableEditControls();
        //     this.ctrl = true;
        // }
        this.onEvent(event, 'onKeyDown');
    }
    onKeyUp(event) {
        // if ('Control' === event.key && this.ctrl) {
        //     this.enableTransformControls();
        //     this.ctrl = false;
        // }
        this.onEvent(event, 'onKeyUp');
    }
    onMouseWheel(event) {
        this.onEvent(event, 'onMouseWheel');
    }
    onClick(event) {
        this.onEvent(event, 'onClick');
    }
    onDblClick(event) {
        this.onEvent(event, 'onDblClick');
    }
    onContextMenu(event) {
        this.onEvent(event, 'onContextMenu');
    }
}
 