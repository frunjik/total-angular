import * as THREE from 'three';
import { CameraControls } from './cameracontrols';
import { Keyboard, Mouse } from './input';

export class Game  {

  private w = 640 * 1.5;
  private h = 480 * 1.5;
  private raf;
  private light;
  private directionalLight;
  private canvas;
  private cube;
  private scene;
  private camera;
  private renderer;
  private sensitivity;
  private controls;

  private mouse = new Mouse();
  private keyboard = new Keyboard();

  create() {
    this.sensitivity = 0.01;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.w / this.h, 0.1, 1000);
    this.camera.position.z = -5;  
    this.camera.position.x = -2;  
    this.camera.position.y = 3;  

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshLambertMaterial({ color: 0xfa11cc });
    // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    this.scene.add(this.directionalLight);

    this.light = new THREE.AmbientLight( 0x404040 ); // soft white light
    this.scene.add(this.light);

    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.z = 0.5;  
    this.cube.position.x = 0.5;  
    this.cube.position.y = 0.5;  
    
    this.scene.add(this.cube);

    this.camera.lookAt(this.cube.position);
  }

  init(canvas) {
    this.canvas = canvas;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas } );
    this.renderer.setSize(this.w, this.h);
    this.controls = new CameraControls(this.camera, this.canvas);
    this.start();
  }

  exit() {
    this.stop();
    this.controls = null;
    this.renderer = null;
    this.canvas = null;
  }

  start() {
    this.loop();  
  }

  stop() {
    if (this.raf) {
        cancelAnimationFrame(this.raf);
        this.raf = null;
    }
  }

  destroy() {
      this.exit();
      this.scene.remove(this.cube);
      this.scene.remove(this.light);
      this.scene.remove(this.directionalLight);
      this.cube = null;
      this.light = null;
      this.directionalLight = null;
      this.camera = null;
      this.scene = null;
  }

  loop(now = 0) {
    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame((now) => {
        this.loop(now);
    });
  }

  onEvent(event) {
  }

  onWheelEvent(event) {
      if (event.wheelDelta>0) {
            this.controls.dollyIn(event.wheelDelta * this.sensitivity);
      }
      else {
            this.controls.dollyOut(-event.wheelDelta * this.sensitivity);
      }
      this.controls.update();
  }

  onClickEvent(event) {
  }

  onDblClickEvent(event) {
  }

  onMouseDownEvent(event) {
      this.mouse.onMouseDown(event);
  }

  onMouseUpEvent(event) {
      this.mouse.onMouseUp(event);
  }

  onKeyDownEvent(event) {
      this.keyboard.onKeyDown(event);
      if(this.keyboard.keys[' ']){
        this.controls.reset();
      }
  }

  onKeyUpEvent(event) {
      this.keyboard.onKeyUp(event);
  }

  onMouseMove(event) {
    this.mouse.onMouseMove(event);
    if(this.mouse.left) {
        if (this.keyboard.keys['Shift']) {
            this.controls.rotateLeft(event.movementX * this.sensitivity);
            this.controls.rotateUp(event.movementY * this.sensitivity);
        }
        else {
            this.controls.pan(event.movementX, event.movementY);
        }
        this.controls.update();
    } 
  }

  get keys() {
    return Object.keys(this.keyboard.keys);
  }
}
