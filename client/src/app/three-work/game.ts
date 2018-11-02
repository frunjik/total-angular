import * as THREE from 'three';
import { Engine } from './engine';
import { EditorControls } from './three-editorcontrols';
import { TransformControls } from './three-transformcontrols';
import { FirstPersonControls } from './three-firstpersoncontrols';
import { Piece, Board } from './wp';

export class Game extends Engine {

    s = 10;
    mouseX = 0;
    mouseY = 0;

    mouseVec;   // = new THREE.Vector2();
    mousePos;   // = new THREE.Vector2();

    position = new THREE.Vector3(-15, -20, 0);
    blocks = [];
    board = new Board();
    controls;
    editControls;
    transformControls;
    firstPersonControls;

    light;
    directionalLight;

    floor;
    wireframe;
    draggedBlock;
    hoveredBlock;

    raycaster;

    lastNow = 0;

    ctrl;

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
            this.hoveredBlock = intersects[0];
        }
        else {
            this.hoveredBlock = null;
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
        this.editControls.enabled = false;

        this.transformControls = new TransformControls(this.camera, this.canvas);
        this.transformControls.size = 3;
        this.transformControls.attach(this.blocks[1]);
        this.transformControls.enabled = true;
        // this.scene.add(this.transformControls);
        // this.controls = this.transformControls;
        this.controls = this.editControls;

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
       super.destroy();
    }

    enableEditControls() {
        this.controls = this.editControls;
    }
    
    enableTransformControls() {
        // this.controls = this.firstPersonControls;
        this.controls = this.transformControls;
    }

    placeWireframe(b) {
        const g = b.object.geometry;
        var geo = new THREE.EdgesGeometry( g ); // or WireframeGeometry( geometry )
        var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
        this.wireframe = new THREE.LineSegments( geo, mat );
        this.wireframe.userData.piece = b.object.userData.piece;
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
            ( event.clientX / window.innerWidth ) * 2 - 1,
            - ( event.clientY / window.innerHeight ) * 2 + 1,
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
        const mx = this.mouseX;
        const my = this.mouseY;
        // const mx = this.mousePos.x;
        // const my = this.mousePos.y;

        this.mousePos3D(event);

        this.mouseX = ( (event.clientX-this.bounds.x) / this.canvas.width ) * 2 - 1;
        this.mouseY = - ( (event.clientY-this.bounds.y) / this.canvas.height ) * 2 + 1;

        if (this.draggedBlock) {
            const s = 40;
            const dx = this.mouseX - mx;
            const dy = this.mouseY - my;
            // const dx = this.mousePos.x - mx;
            // const dy = this.mousePos.y - my;

            this.draggedBlock.object.position.x += dx * s;
            this.draggedBlock.object.position.y += dy * s;
        }

        this.onEvent(event, 'onMouseMove');
    }
    onMouseDown(event){
        if (!this.ctrl && !this.draggedBlock && this.hoveredBlock) {
            this.placeWireframe(this.hoveredBlock);
            this.draggedBlock = this.hoveredBlock;
            this.draggedBlock.object.position.z = 1;
        }
        this.onEvent(event, 'onMouseDown');
    }
    onMouseUp(event) {
        if (this.draggedBlock) {
            this.removeWireframe();
            this.resetBlockPosition(this.draggedBlock.object);
            this.draggedBlock = null;
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
 