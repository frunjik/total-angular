import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { start, stop } from '../js/main';
import { run } from '../js/unittest_tests';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  private context;
  private testResult;

  /** Template reference to the canvas element */
  @ViewChild('scene') canvasElement: ElementRef;

  constructor() { }

  ngOnInit() {
    this.runTests();
  }

  ngAfterViewInit() {
    this.context = (this.canvasElement.nativeElement as HTMLCanvasElement).getContext('webgl2');
    start(this.context);
  }

  ngOnDestroy() {
    stop(this.context);
    this.context = undefined;
  }

  runTests() {
      const results = [
          run(),
      ];

      this.testResult = results.map(r => r.summary()).join('\n');
      this.testFailures = results.map(r => r.failures.join('\n')).join('\n');
  }
}
