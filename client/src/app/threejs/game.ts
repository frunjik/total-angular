import * as THREE from 'three';
import { CameraControls } from './cameracontrols';
import { Keyboard, Mouse } from './input';
import { grassVertexShader, grassFragmentShader } from './shaders';

export class Game  {
  private w = 640 * 1.5;
  private h = 480 * 1.5;
  private raf;
  private light;
  private directionalLight;
  private canvas;
  private cube;
  private floor;
  private scene;
  private camera;
  private grass;
  private renderer;
  private sensitivity;
  private controls;

  private mouse = new Mouse();
  private keyboard = new Keyboard();
  private ticks=0;

  createGrassShader(o) {
    const w = 120;
    const h = 120;
    return new THREE.ShaderMaterial( {
        uniforms: {
            time: { value: (new Date()).getMilliseconds() },
            resolution: { value: new THREE.Vector2(w, h) }
        },
        vertexShader: grassVertexShader,
        fragmentShader: grassFragmentShader
    } );
  }

  create() {
    this.sensitivity = 0.01;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.w / this.h, 0.1, 1000);

    const away = 6;
    this.camera.position.x = 10 * away;  
    this.camera.position.y = 13 * away;  
    this.camera.position.z = -6 * away;  

    /*
0x224c1a	(34,76,26)
0x505f20	(80,95,32)
0x15a447	(21,164,71)
0x40aeca	(64,174,202)
0xb9bcff	(185,188,255)
    */

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshLambertMaterial({ color: 0xfa11cc });
    var floorMaterial = new THREE.MeshBasicMaterial({ color: 0x929385 });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.z = 0;  
    this.cube.position.x = 0;  
    this.cube.position.y = 5;  
    this.cube.scale.y = 10;  
    this.scene.add(this.cube);
console.log('FLOOR:', floorMaterial);    
       
    
    this.grass = this.createGrassShader(floorMaterial);
console.log('GRASS:', this.grass);    

    // var floorMaterial = new THREE.MeshBasicMaterial({ color: 0xd5e9cf });

    this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    this.scene.add(this.directionalLight);

    this.light = new THREE.AmbientLight( 0x404040 ); // soft white light
    this.scene.add(this.light);

    this.floor = new THREE.Mesh(geometry, this.grass);
    this.floor.position.y = -0.5;
    this.floor.scale.z = 150;  
    this.floor.scale.x = 150;  
    this.floor.scale.y = 1;  
    this.scene.add(this.floor);

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
    this.raf = requestAnimationFrame((now) => {
        this.controls.update();
        this.loop(now);
    });
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
      this.scene.remove(this.floor);
      this.scene.remove(this.light);
      this.scene.remove(this.directionalLight);
      this.cube = null;
      this.floor = null;
      this.light = null;
      this.grass = null;
      this.directionalLight = null;
      this.camera = null;
      this.scene = null;
  }

  loop(now = 0) {
    if (now - this.ticks> 3000) {
    //     this.grass.needsUpdate = true;
    //     this.grass.uniforms.time.value = ((now % 100) * 100);
        this.ticks = now;

    //     console.log(this.grass.uniforms.time.value);
    }

    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame((now) => {
        this.loop(now);
    });
  }

  onEvent(event) {
  }

  onWheelEvent(event) {
// console.log(event.wheelDelta);
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
// console.log(event);
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
    if(this.mouse.right) {
        if (this.keyboard.keys['Shift']) {
            if(event.movementY) {

                if (event.movementY>0) {
                        this.controls.dollyOut(120 * this.sensitivity);
                }
                else {
                        this.controls.dollyIn(120 * this.sensitivity);
                }
                
                this.controls.update();
            }
        }
    } 
  }

  get keys() {
    return Object.keys(this.keyboard.keys);
  }
}
 