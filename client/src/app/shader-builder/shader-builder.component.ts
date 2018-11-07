import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
class ThreeView {
    canvas;
    
    light;
    directionalLight;

    cube;
    floor;
    scene;
    camera;
    renderer;
    raycaster;

    geometry = {};
    material = {};

    create(canvas) {
        this.canvas = canvas;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.width / this.canvas.height, 0.1, 1000);

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas } );
        this.renderer.setSize(this.canvas.width, this.canvas.height);

        const away = 0.2;
        this.camera.position.x = 10 * away;  
        this.camera.position.y = 13 * away;  
        this.camera.position.z = -6 * away;  

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshLambertMaterial({ color: 0xfa11cc });
        var floorMaterial = new THREE.MeshBasicMaterial({ color: 0x929385 });

        this.cube = new THREE.Mesh(geometry, material);
        this.cube.name = 'cube';  
        this.cube.position.y = 1;
        this.scene.add(this.cube);

        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        this.scene.add(this.directionalLight);

        this.light = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.scene.add(this.light);

        this.floor = new THREE.Mesh(geometry, floorMaterial);
        // this.floor.position.y = -0.5;
        this.floor.scale.z = 150;  
        this.floor.scale.x = 150;  
        this.floor.scale.y = 1;  
        this.floor.name = 'floor';  
        this.scene.add(this.floor);

        this.camera.lookAt(this.cube.position);
        this.raycaster = new THREE.Raycaster();
    }

    destroy() {
        while(this.scene.children.length > 0){ 
            this.scene.remove(this.scene.children[0]);
        }

        this.renderer = null;
        this.scene = null;
        this.camera = null;

        this.floor = null;
        this.cube = null;
        
        this.raycaster  = null;
        this.canvas = null;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

@Component({
  selector: 'app-shader-builder',
  templateUrl: './shader-builder.component.html',
  styleUrls: ['./shader-builder.component.css']
})
export class ShaderBuilderComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('scene') canvasElement: ElementRef;

  codeVS = `
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
  codeFS = `
void main() {
    gl_FragColor = vec4( 1.0, 0.0, 0.0, 0.5 );
}  
`;
  editorOptions = {theme: 'vs-dark', language: 'javascript'};

  view = new ThreeView();

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.view.create(this.canvasElement.nativeElement as HTMLCanvasElement);
    this.view.render();
  }

  ngOnDestroy() {
    this.view.destroy();
    this.view = null;
  }

  build() {
    const w = 120;
    const h = 120;
    const m = new THREE.ShaderMaterial({
        uniforms: {
        },
        vertexShader: this.codeVS,
        fragmentShader: this.codeFS
    });

    console.log('MATERIAL', m);
    this.view.cube.material = m;
    this.view.render();
  }

}
