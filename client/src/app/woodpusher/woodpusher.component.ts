import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-woodpusher',
  templateUrl: './woodpusher.component.html',
  styleUrls: ['./woodpusher.component.css']
})
export class WoodpusherComponent implements OnInit {

  @ViewChild('canvas') canvasElement: ElementRef;

  constructor() { }

  ngOnInit() {
  }

}
