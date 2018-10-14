import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { start, stop } from '../js/main';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  private context;

  /** Template reference to the canvas element */
  @ViewChild('scene') canvasElement: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.context = (this.canvasElement.nativeElement as HTMLCanvasElement).getContext('webgl2');
    start(this.context);
  }

  ngOnDestroy() {
    stop(this.context);
    this.context = undefined;
  }
}
