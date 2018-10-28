import * as THREE from 'three';
import { CameraControls } from './cameracontrols';
import { EditorControls } from './three-editorcontrols';
import { Keyboard, Mouse } from './input';
import { grassVertexShader, 
    grassFragmentShader, 
} from './shaders';

export class Engine {
  public w = 640 * 1;
  public h = 480 * 1;
  public raf;
  public light;
  public directionalLight;
  public canvas;
  public bounds;
  public cube;
  public floor;
  public scene;
  public camera;
  public grass;
  public renderer;
  public sensitivity;

  public mouse = new Mouse();
  public keyboard = new Keyboard();
  public ticks=0;

  public materials  = {};
  public geometries = {};
  public shaders = {};

  public mx = 0;
  public my = 0;
  public raycaster;

  getorset(m, name, o) {
    if (o) {
        m[name] = o;
    }
    else {
        o = m[name];
    }
    return o;
  }

  material(name, m=null) {
    return this.getorset(this.materials, name, m);
  }

  geometry(name, g=null) {
    return this.getorset(this.geometries, name, g);
  }

  shader(name, s=null) {
    return this.getorset(this.shaders, name, s);
  }

  createGrassShader() {
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
    const away = 15;
    this.camera.position.x =  0 * away;  
    this.camera.position.y =  3 * away;  
    this.camera.position.z =  1 * away;  
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometry('cube', geometry);
    var material = new THREE.MeshLambertMaterial({ color: 0xfa11cc });
    var floorMaterial = new THREE.MeshBasicMaterial({ color: 0x929385 });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.z = 0;  
    this.cube.position.x = 0;  
    this.cube.position.y = 5;  
    this.cube.scale.y = 10;  
    this.cube.name = 'pole';  
    this.scene.add(this.cube);
    this.grass = this.createGrassShader();
    this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    this.scene.add(this.directionalLight);
    this.light = new THREE.AmbientLight( 0x404040 ); // soft white light
    this.scene.add(this.light);
    // this.floor = new THREE.Mesh(geometry, this.grass);
    this.floor = new THREE.Mesh(geometry, floorMaterial);
    this.floor.position.y = -0.5;
    const s = 10;
    const w = 4;
    const h = 5;
    this.floor.scale.z = s * h;  
    this.floor.scale.x = s * w;  
    this.floor.scale.y = 1;  
    this.floor.name = 'floor';  
    this.scene.add(this.floor);
    this.camera.lookAt(this.cube.position);
    this.raycaster = new THREE.Raycaster();
  }

  init(canvas) {
console.log('ENGINE: init');
    this.canvas = canvas;
    this.bounds = this.canvas.getBoundingClientRect();
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas } );
    this.renderer.setSize(this.w, this.h);
  }

  exit() {
    this.renderer = null;
    this.canvas = null;
console.log('ENGINE: exit');
  }

  start() {
    this.raf = requestAnimationFrame((now) => {
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
      this.stop();
      this.exit();
      while(this.scene.children.length > 0){ 
        this.scene.remove(this.scene.children[0]);
      }

      this.cube = null;
      this.floor = null;
      this.light = null;
      this.grass = null;
      this.directionalLight = null;
      this.camera = null;
      this.scene = null;

      this.geometries = null;
      this.materials = null;
      this.shaders = null;
      this.raycaster = null;
 }

  loop(now = 0) {
    // picking
    // this.raycaster.setFromCamera({x: this.mx, y: this.my}, this.camera);
	// var intersects = this.raycaster.intersectObject(this.scene, true);
    // let f = intersects.find(i => i.object.name === 'floor');
    // if (f) {
    //     let x = intersects.indexOf(f);
    //     if (x>=0) {
    //         intersects.splice(x, 1);
    //     }
    // }
    // if (intersects.length) {
    //     intersects.forEach(i => console.log(i.object.name));
    // }

    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame((now) => {
        this.loop(now);
    });
  }

  get keys() {
    return Object.keys(this.keyboard.keys);
  }
}
 