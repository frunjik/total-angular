import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Game } from './game';

@Component({
  selector: 'app-three-work',
  templateUrl: './three-work.component.html',
  styleUrls: ['./three-work.component.css']
})
export class ThreeWorkComponent implements OnInit, AfterViewInit, OnDestroy {
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
}
