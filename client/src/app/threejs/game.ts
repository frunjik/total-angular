import * as THREE from 'three';
import { CameraControls } from './cameracontrols';
import { Keyboard, Mouse } from './input';
import { grassVertexShader, 
    grassFragmentShader, 
    sobelFragmentShader, 
    contourFragmentShader, 
    blackFragmentShader, 
    starFragmentShader,
    cosFragmentShader } from './shaders';

export class Game  {
  private w = 640 * 1.5;
  private h = 480 * 1.5;
  private raf;
  private light;
  private directionalLight;
  private canvas;
  private bounds;
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

  private materials  = {};
  private geometries = {};
  private shaders = {};

  private mx = 0;
  private my = 0;
  private raycaster;

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

  createOrbiter() {

    const x = 4, z = 4, y = 1;
    const w = 0.4, h = 20, o = 0.1;

    let box = new THREE.BoxBufferGeometry( 1, 1, 1 );
    // let xaxis = new THREE.BoxBufferGeometry( h, w, w );
    // let yaxis = new THREE.BoxBufferGeometry( w, h, w );
    // let zaxis = new THREE.BoxBufferGeometry( w, w, h );
    let material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    let red = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    let green = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    let blue = new THREE.MeshBasicMaterial( {color: 0x0000ff} );

    let cubeA = new THREE.Mesh( box, red );
    cubeA.position.set( x+(h/2)+o, y+0, z+0 );
    cubeA.scale.x = h;
    cubeA.scale.y = w;
    cubeA.scale.z = w;
    cubeA.name = 'red';

    // let cubeX = new THREE.Mesh( box, this.shader('contour') );
    // cubeX.position.set( x+0.5, y+(h/2)+o, z+0.5 );
    // cubeX.scale.x = w+0.3;
    // cubeX.scale.y = h+0.3;
    // cubeX.scale.z = w+0.3;
    // cubeX.name = 'greenX';

    let cubeB = new THREE.Mesh( box, green );
    cubeB.position.set( x+0, y+(h/2)+o, z+0 );
    cubeB.scale.x = w;
    cubeB.scale.y = h;
    cubeB.scale.z = w;
    cubeB.name = 'green';


    // let cubeC = new THREE.Mesh( box, blue );
    let cubeC = new THREE.Mesh( box, this.shader('cos') );
    cubeC.position.set( x+0, y+0, z+(h/2)+o );
    cubeC.scale.x = w;
    cubeC.scale.y = w;
    cubeC.scale.z = h;
    cubeC.name = 'blue';

    //create a group and add the three axis
    let group = new THREE.Group();
    group.add( cubeA );
    group.add( cubeB );
    group.add( cubeC );
    // group.add( cubeX );

    return group;
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

  createShader(fs) {
    const w = 120;
    const h = 120;
    return new THREE.ShaderMaterial( {
        uniforms: {
            time: { value: (new Date()).getMilliseconds() },
            resolution: { value: new THREE.Vector2(w, h) }
        },
        vertexShader: grassVertexShader,
        fragmentShader: fs
    } );
  }

  create() {
    this.shader('star', this.createShader(starFragmentShader));
    this.shader('BLACK', this.createShader(blackFragmentShader));
    this.shader('sobel', this.createShader(sobelFragmentShader));
    // this.shader('contour', this.createShader(contourFragmentShader));
    this.shader('cos', this.createShader(cosFragmentShader));

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

    this.floor = new THREE.Mesh(geometry, this.grass);
    this.floor.position.y = -0.5;
    this.floor.scale.z = 150;  
    this.floor.scale.x = 150;  
    this.floor.scale.y = 1;  
    this.floor.name = 'floor';  
    this.scene.add(this.floor);
    this.scene.add(this.createOrbiter());

    this.camera.lookAt(this.cube.position);

    this.raycaster = new THREE.Raycaster();
    //mouse = new THREE.Vector2();    
    

    console.log(this.shaders);
  }

  init(canvas) {
    this.canvas = canvas;

    this.bounds = this.canvas.getBoundingClientRect();
    
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
      while(this.scene.children.length > 0){ 
        this.scene.remove(this.scene.children[0]);
      }
    //   this.scene.remove(this.cube);
    //   this.scene.remove(this.floor);
    //   this.scene.remove(this.light);
    //   this.scene.remove(this.directionalLight);
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
    // if (now - this.ticks> 3000) {
    //     this.grass.needsUpdate = true;
    //     this.grass.uniforms.time.value = ((now % 100) * 100);
    //     this.ticks = now;

    // //     console.log(this.grass.uniforms.time.value);
    // }

const s = this.shader('cos');
// console.log('S', s);
    s.uniforms.time.value = ((now/5000) % 100) / 100;
    s.needsUpdate = true;



    // this.raycaster = new THREE.Raycaster();
	// 			mouse = new THREE.Vector2();

    // this.raycaster.setFromCamera(this.mouse.position, this.camera);
    this.raycaster.setFromCamera({x: this.mx, y: this.my}, this.camera);
	var intersects = this.raycaster.intersectObject(this.scene, true);


    let f = intersects.find(i => i.object.name === 'floor');
    if (f) {
        let x = intersects.indexOf(f);
        if (x>=0) {
            intersects.splice(x, 1);
        }
    }

    if (intersects.length) {
        intersects.forEach(i => console.log(i.object.name));
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



    this.mx = ( (event.clientX-this.bounds.x) / this.canvas.width ) * 2 - 1;
	this.my = - ( (event.clientY-this.bounds.y) / this.canvas.height ) * 2 + 1;

// console.log(mx, my);

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
 