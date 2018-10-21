import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-threejs',
  templateUrl: './threejs.component.html',
  styleUrls: ['./threejs.component.css']
})
export class ThreejsComponent implements OnInit, AfterViewInit, OnDestroy {

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

  @ViewChild('scene') canvasElement: ElementRef;
  constructor() { }

  ngOnInit() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.w / this.h, 0.1, 1000);
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    this.scene.add(this.directionalLight);

    this.light = new THREE.AmbientLight( 0x404040 ); // soft white light
    this.scene.add(this.light);

    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    this.camera.position.z = 5;  
  }

  ngAfterViewInit() {
    this.canvas = (this.canvasElement.nativeElement as HTMLCanvasElement);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas } );
    this.renderer.setSize(this.w, this.h);
    this.loop();  
  }

  ngOnDestroy() {
      if (this.raf) {
          cancelAnimationFrame(this.raf);
          this.raf = null;
      }
      this.scene.remove(this.cube);
      this.scene.remove(this.light);
      this.scene.remove(this.directionalLight);
      this.cube = null;
      this.light = null;
      this.directionalLight = null;
      this.renderer = null;
      this.camera = null;
      this.scene = null;
      this.canvas = null;
  }

  loop() {
    this.cube.rotation.x += 0.01;
	  this.cube.rotation.y += 0.01;    
    this.renderer.render(this.scene, this.camera);

    this.raf = requestAnimationFrame(() => {
        this.loop();
    });
  }  
}
