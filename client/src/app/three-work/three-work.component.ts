import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Game } from './game';
import { run as runUnitTests } from '../js/tests/unittest_tests';
import { run } from '../js/tests/unittest';
import { WPTests, PieceTests } from './wp_tests';

@Component({
  selector: 'app-three-work',
  templateUrl: './three-work.component.html',
  styleUrls: ['./three-work.component.css']
})
export class ThreeWorkComponent implements OnInit, AfterViewInit, OnDestroy {
  private game;

  testResult;
  testFailures;

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

  runTests() {
// console.log('TEST', WPTests);

    const results = [
      // runUnitTests(),
      run(WPTests),
      run(PieceTests)
    ];

    this.testResult = results.map(r => r.summary()).join('\n');
    this.testFailures = results.map(r => r.failures.join('\n')).join('\n');
  }  
}
