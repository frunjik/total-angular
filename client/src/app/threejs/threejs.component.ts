import * as THREE from 'three';
import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CameraControls } from './cameracontrols';
import { Keyboard, Mouse } from './input';
import { Game } from './game';

@Component({
  selector: 'app-threejs',
  templateUrl: './threejs.component.html',
  styleUrls: ['./threejs.component.css']
})
export class ThreejsComponent implements OnInit, AfterViewInit, OnDestroy {
  private game;

  @ViewChild('scene') canvasElement: ElementRef;
  constructor() { }

  ngOnInit() {
    this.game = new Game();
    this.game.create();
  }

  ngAfterViewInit() {
    this.game.init(this.canvasElement.nativeElement as HTMLCanvasElement);
  }

  ngOnDestroy() {
    this.game.destroy();
    this.game = null;
  }

  onEvent(event) {
  }

  onWheelEvent(event) {
      this.game.onWheelEvent(event);
  }

  onClickEvent(event) {
  }

  onDblClickEvent(event) {
  }

  onMouseDownEvent(event) {
    this.game.onMouseDownEvent(event);
  }

  onMouseUpEvent(event) {
    this.game.onMouseUpEvent(event);
  }

  onKeyDownEvent(event) {
    this.game.onKeyDownEvent(event);
  }

  onKeyUpEvent(event) {
    this.game.onKeyUpEvent(event);
  }

  onMouseMove(event) {
    this.game.onMouseMove(event);
  }
}
