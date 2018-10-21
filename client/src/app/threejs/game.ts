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
  private floor;
  private scene;
  private camera;
  private renderer;
  private sensitivity;
  private controls;

  private mouse = new Mouse();
  private keyboard = new Keyboard();



  createGrassShader(o) {

    // const uniforms1 = {
	// 	time: { value: 1.0 }
	// };

    const vertexShader = `varying vec2 vUv;
void main()
{
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
}`;

    const fragmentShader = `#ifdef GL_ES
precision mediump float;
#endif

//#extension GL_OES_standard_derivatives : enable

varying vec2 vUv;

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;

const float pi = acos(-1.0);

float rand(vec2 n) { 
    // return 0.6;
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	const int res = 16;
	//const float invRes = 1.0 / float(res);
	
	p *= float(res);
	vec2 n = floor(p);
	vec2 f = fract(p);
	
	f = f * f * (3.0 - 2.0 * f);
	
	float n0 = rand(n);
	float n1 = rand(n + vec2(1.0, 0.0));
	float n2 = rand(n + vec2(0.0, 1.0));
	float n3 = rand(n + vec2(1.0, 1.0));
	
	float m0 = mix(n0, n1, f.x);
	float m1 = mix(n2, n3, f.x);
	
	return mix(m0, m1, f.y);
}

void main( void ) {

	// vec2 position = gl_FragCoord.xy / resolution.xy;
	// vec2 position = fragCoord.xy;

	// vec2 position = gl_FragCoord.xy;
	vec2 position = vUv;    // / resolution.xy;
	vec3 color = vec3(0.0,1,0);

	color += noise(position) * 0.5;
	color += noise(position * 2.0) * 0.25;
	color += noise(position * 4.0) * 0.125;
	color += noise(position * 8.0) * 0.064;
	color += noise(position * 16.0) * 0.032;
	color += noise(position * 32.0) * 0.016;
	color += noise(position * 64.0) * 0.008;
	
	color *= 0.1;

	gl_FragColor = vec4(color, 1.0 );

}`;

    const w = 120;
    const h = 120;
    return new THREE.ShaderMaterial( {
        uniforms: {
            time: { value: 1.0 },
            resolution: { value: new THREE.Vector2(w, h) }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    } );
  }


  create() {
    this.sensitivity = 0.01;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.w / this.h, 0.1, 1000);
    this.camera.position.x = 10;  
    this.camera.position.y = 13;  
    this.camera.position.z = -6;  

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
       
    
    var grass = this.createGrassShader(floorMaterial);
console.log('GRASS:', grass);    

    // var floorMaterial = new THREE.MeshBasicMaterial({ color: 0xd5e9cf });

    this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    this.scene.add(this.directionalLight);

    this.light = new THREE.AmbientLight( 0x404040 ); // soft white light
    this.scene.add(this.light);

    this.floor = new THREE.Mesh(geometry, grass);
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
