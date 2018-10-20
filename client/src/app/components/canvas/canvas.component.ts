import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  private raf;
  private context;
  private canvas;
  private bounds;

  event: MouseEvent;
  clientX = 0;
  clientY = 0;
  mx = 0;
  my = 0;
  paths = [];
  points = [];
  gridPoint = {
      x: 0,
      y: 0,
  };

  /** Template reference to the canvas element */
  @ViewChild('canvas') canvasElement: ElementRef;

  constructor() { }

  draw(ctx) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let rows = 10, cols = 10;
    let w = 20, h = 20;
    let x = 10, y = 10;
    this.drawGrid(ctx, x, y, cols, rows, w, h, 'lightgray');
    this.drawDot(ctx, this.gridPoint.x, this.gridPoint.y);
  }

  drawDot(ctx, centerX, centerY, r = 7) {
    let radius = r;
    this.drawCircle(ctx, centerX, centerY, radius, 'green', 'black', 2);
  }

  drawCircle(ctx, centerX, centerY, radius, color, borderColor, lw = 1) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = lw;
    ctx.strokeStyle = borderColor;
    ctx.stroke();    
  }

  drawGrid(ctx, x, y, cols, rows, w, h, color) {
    ctx.beginPath();
    for(let c=0; c<cols; c++) {
        ctx.moveTo(c * w + x, 0 + y);
        ctx.lineTo(c * w + x, (rows-1) * h + y);
    }
    for(let r=0; r<rows; r++) {
        ctx.moveTo(0 + x, r * h + y);
        ctx.lineTo((cols-1) * w + x, r * h + y);
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  update(now) {
  }
  
  clampPoint(x, y) {
    return {
        x: (Math.floor((20 + x) / 20) * 20) - 10,
        y: (Math.floor((20 + y) / 20) * 20) - 10,
    }
  }

  clicked() {
    this.points.push(this.clampPoint(this.mx, this.my));
  }

  onEvent(event: MouseEvent): void {
    this.event = event;
    if ('click' === event.type) {
        this.clicked();
    }
    else if ('dblclick' === event.type) {
    }
    else if ('contextmenu' === event.type) {
    }
  }

  coordinates(event: MouseEvent): void {
    this.clientX = event.clientX;
    this.clientY = event.clientY;
    this.mx = this.clientX - this.bounds.left;
    this.my = this.clientY - this.bounds.top;
    this.gridPoint = this.clampPoint(this.mx, this.my);
  }  

  ngOnInit() {
  }

  start() {
    this.loop(new Date());
  }

  stop() {
      if (this.raf) {
        cancelAnimationFrame(this.raf);
        this.raf = null;
      }
  }

  loop(now) {
    this.update(now);
    this.draw(this.context);
    this.raf = requestAnimationFrame((now) => {
        this.loop(now);
    });      
  }

  ngAfterViewInit() { 
    this.canvas = (this.canvasElement.nativeElement as HTMLCanvasElement);
    this.bounds = this.canvas.getBoundingClientRect();
    this.context = this.canvas.getContext('2d');
    this.start();
  }

  ngOnDestroy() {
    this.stop();
    this.context = undefined;
    this.bounds = undefined;
    this.canvas = undefined;
  }
}
