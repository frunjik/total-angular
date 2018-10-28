import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Game } from './game';

@Component({
  selector: 'app-wp3',
  templateUrl: './wp3.component.html',
  styleUrls: ['./wp3.component.css']
})
export class Wp3Component implements OnInit, AfterViewInit, OnDestroy {
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
