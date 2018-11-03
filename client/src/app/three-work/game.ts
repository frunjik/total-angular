import * as THREE from 'three';
import { Engine } from './engine';
import { EditorControls } from './three-editorcontrols';
import { Piece, Board } from './wp';

export class Game extends Engine {
    s = 10;
    mouseX = 0;
    mouseY = 0;

    mouseVec;   // = new THREE.Vector2();
    mousePos;   // = new THREE.Vector2();

    distance = 0;

    blocks = [];
    board = new Board();
    controls;
    editControls;

    light;
    directionalLight;

    position = new THREE.Vector3(-15, -20, 0);
    offset = new THREE.Vector3(0, 0, 0);
    
    floor;
    wireframe;
    draggedBlock;
    hoveredBlock;

    ctrl;
    raycaster;
    lastNow = 0;

    createShapes() {
        this.geometry('cube', new THREE.BoxGeometry(1, 1, 1));
        this.geometry('red', new THREE.BoxGeometry(this.s * 2, this.s * 2, 1));
        this.geometry('green', new THREE.BoxGeometry(this.s * 1, this.s * 2, 1));
        this.geometry('blue', new THREE.BoxGeometry(this.s * 2, this.s * 1, 1));
        this.geometry('yellow', new THREE.BoxGeometry(this.s * 1, this.s * 1, 1));
    }

    createMaterials() {
        this.material('floor', new THREE.MeshBasicMaterial({ color: 0x929385 }));
        this.material('red', new THREE.MeshLambertMaterial({ color: 0xff0000 }));
        this.material('green', new THREE.MeshLambertMaterial({ color: 0x00ff00 }));
        this.material('blue', new THREE.MeshLambertMaterial({ color: 0x0000ff }));
        this.material('yellow', new THREE.MeshLambertMaterial({ color: 0xffff00 }));
    }

    resetBlockPosition(b) {
        const p = b.userData.piece;
        this.setBlockPosition(b, p.x, p.y, p.width, p.height);
    }

    setBlockPosition(b, x, y, w, h) {
        b.position.x = this.position.x + (this.s * (x + (w-1)/2));
        b.position.y = -(this.position.y + (this.s * (y + (h-1)/2)));
        b.position.z = this.position.z;
    }

    createBlock(p) {
        const c = p.color;
        const b = new THREE.Mesh(this.geometry(c), this.material(c));
        b.name = c;
        b.userData.piece = p;
        this.resetBlockPosition(b);
        return b;
    }

    createBlocks() {
        this.board.pieces.forEach(p => this.blocks.push(this.createBlock(p)));
    }

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
            this.hoveredBlock = intersects[0].object;
        }
        else {
            this.hoveredBlock = null;
        }
    }

    loop(now) {
        const delta = Math.max(now - this.lastNow, 1);
        this.lastNow = now;
        this.distance = this.camera.position.distanceTo(this.floor.position);            
        if (this.controls && this.controls.update) {
            this.controls.update(delta);
        }
        this.pick();
        super.loop(delta);
    }

    init(canvas) {
        super.init(canvas);
        this.editControls = new EditorControls(this.camera, this.canvas);
        this.editControls.enabled = false;
        this.controls = this.editControls;
        this.start();
    }

    exit() {
        this.stop();
        this.controls = null;
        this.editControls.dispose();
        this.editControls = null;
        super.exit();
    }

    create() {
        super.create();
        this.createShapes();
        this.createMaterials();
        this.light = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.scene.add(this.light);
        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
        this.directionalLight.position.z = 0;
        this.directionalLight.position.y = 5;
        this.directionalLight.position.z = 5;
        this.scene.add(this.directionalLight);
        this.floor = new THREE.Mesh(this.geometry('cube'), this.material('floor'));
        this.floor.name = 'floor';  
        this.floor.position.z = -1;
        const s = 10;
        const w = 4;
        const h = 5;
        this.floor.scale.x = s * w;  
        this.floor.scale.y = s * h;  
        this.floor.scale.z = 1;  
        this.scene.add(this.floor);
        this.camera.position.x = 1;
        this.camera.position.y = -2;
        this.camera.position.z = 47;
        this.camera.lookAt(this.floor.position);
        this.mouseVec = new THREE.Vector3();
        this.mousePos = new THREE.Vector3();
        this.raycaster = new THREE.Raycaster();
        this.createBlocks();
        this.blocks.forEach(b => this.scene.add(b));
    }

    destroy() {
       this.blocks.forEach(b => this.scene.remove(b));
       this.blocks = [];
       this.raycaster = null;
       this.floor = null;
       this.position = null;
       this.offset = null;
       super.destroy();
    }

    enableEditControls() {
        this.controls = this.editControls;
    }
    
    placeWireframe(b) {
        const g = b.geometry;

        var geo = new THREE.EdgesGeometry( g ); // or WireframeGeometry( geometry )
        var mat = new THREE.MeshLambertMaterial( { color: b.material.color, opacity: 0.65, transparent: true } );
        this.wireframe = new THREE.Mesh( g, mat );

        this.wireframe.userData.piece = b.userData.piece;
        this.resetBlockPosition(this.wireframe);
        this.scene.add( this.wireframe );
    }

    removeWireframe() {
        this.scene.remove( this.wireframe );
        this.wireframe = null;
    }

    mousePos3D(event) {
        const vec = this.mouseVec;
        const pos = this.mousePos;
        const camera = this.camera;
        vec.set(
            this.mouseX,
            this.mouseY,
            0.5 );
        vec.unproject( camera );
        vec.sub( camera.position ).normalize();
        var distance = - camera.position.z / vec.z;
        pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );
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
        const mx = this.mousePos.x;
        const my = this.mousePos.y;

        this.mouseX = ( (event.clientX-this.bounds.x) / this.canvas.width ) * 2 - 1;
        this.mouseY = -( (event.clientY-this.bounds.y) / this.canvas.height ) * 2 + 1;

        this.mousePos3D(event);

        if (this.draggedBlock) {

            const s = 1;
            const dx = this.mousePos.x - mx;
            const dy = this.mousePos.y - my;

            this.draggedBlock.position.x += dx * s;
            this.draggedBlock.position.y += dy * s;

            let o = this.offset;
            o.copy(this.draggedBlock.position);
            o.sub (this.wireframe.position);
            o.divideScalar(this.s);

            o = o.clone();
            // o.normalize();
            o.round();

            const p = this.wireframe.userData.piece;
            if(o.x || o.y) {
                if (Math.abs(o.x) > Math.abs(o.y)) {
                    if (this.board.canMovePieceHorizontal(p, o.x)) {
                        p.moveHorizontal(o.x > 0 ? 1 : -1);
                    }
                } else {
                    if (this.board.canMovePieceVertical(p, -o.y)) {
                        p.moveVertical(o.y > 0 ? -1 : 1);
                    }
                }
                this.resetBlockPosition(this.wireframe);
            }
        }
        this.onEvent(event, 'onMouseMove');
    }
    onMouseDown(event){
        if (!this.ctrl && !this.draggedBlock && this.hoveredBlock) {
            this.placeWireframe(this.hoveredBlock);
            this.draggedBlock = this.hoveredBlock;
            this.draggedBlock.position.z = 1;
        }
        this.onEvent(event, 'onMouseDown');
    }
    onMouseUp(event) {
        if (this.draggedBlock) {
            this.removeWireframe();
            this.resetBlockPosition(this.draggedBlock);
            this.draggedBlock = null;
            this.offset.set(0, 0, 0);
        }
        this.onEvent(event, 'onMouseUp');
    }
    onKeyDown(event) {
        if ('Control' === event.key && !this.ctrl) {
            this.editControls.enabled = true;
            this.ctrl = true;
        }
        this.onEvent(event, 'onKeyDown');
    }
    onKeyUp(event) {
        if ('Control' === event.key && this.ctrl) {
            this.editControls.enabled = false;
            this.ctrl = false;
        }
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
        event.preventDefault();
    }
}
 