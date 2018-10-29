import * as THREE from 'three';

export class Engine {
  public w = 640 * 1;
  public h = 480 * 1;
  public raf;
  public light;
  public directionalLight;
  public canvas;
  public bounds;
  public floor;
  public scene;
  public camera;
  public renderer;
  public sensitivity;

  // @TODO resources ?
  public shaders = {};
  public materials  = {};
  public geometries = {};

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

  create() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.w / this.h, 0.1, 1000);

    this.sensitivity = 0.01;
    const away = 15;
    this.camera.position.x =  0 * away;  
    this.camera.position.y =  3 * away;  
    this.camera.position.z =  1 * away;  

    this.light = new THREE.AmbientLight( 0x404040 ); // soft white light
    this.scene.add(this.light);
    this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    this.scene.add(this.directionalLight);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var floorMaterial = new THREE.MeshBasicMaterial({ color: 0x929385 });
    this.floor = new THREE.Mesh(geometry, floorMaterial);
    this.floor.name = 'floor';  
    this.floor.position.y = -0.5;

    const s = 10;
    const w = 4;
    const h = 5;
    this.floor.scale.z = s * h;  
    this.floor.scale.x = s * w;  
    this.floor.scale.y = 1;  
    this.scene.add(this.floor);
    this.camera.lookAt(this.floor.position);
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

      this.floor = null;
      this.light = null;
      this.directionalLight = null;
      this.camera = null;
      this.scene = null;

      this.geometries = null;
      this.materials = null;
      this.shaders = null;
 }

  loop(now = 0) {
    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame((now) => {
        this.loop(now);
    });
  }
}
 