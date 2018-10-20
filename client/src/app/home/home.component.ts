import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
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
  @ViewChild('scene') canvasElement: ElementRef;

  constructor() { }

  draw(ctx) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let rows = 10, cols = 10;
    let w = 20, h = 20;
    let x = 10, y = 10;
    this.drawGrid(ctx, x, y, cols, rows, w, h, 'lightgray');

    // let centerX = 110, centerY = 110;
    // this.drawDot(ctx, centerX, centerY);

    this.drawDot(ctx, this.gridPoint.x, this.gridPoint.y, 5);

    this.drawPoints(ctx, 'black');

    this.paths.forEach(path => {
        ctx.beginPath();
        this.drawPath(ctx, path);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.stroke();
    });
  }

  drawDot(ctx, centerX, centerY, radius = 5) {
    this.drawCircle(ctx, centerX, centerY, radius);
  }

  drawCircle(ctx, centerX, centerY, radius, color = 'green', borderColor= 'black', lw = 1) {
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

  drawPoints(ctx, color, lw = 2) {
    if (this.points.length < 1) { return; }
    ctx.beginPath();
    this.drawPath(ctx, this.points);
    ctx.lineTo(this.gridPoint.x, this.gridPoint.y);
    ctx.lineWidth = lw;
    ctx.strokeStyle = color || 'black';
    ctx.stroke();
    for(let i=0; i<this.points.length; i++) {
        const p = this.points[i];
        this.drawCircle(ctx, p.x, p.y, 4, 'blue');
    }
  }

  drawPath(ctx, path) {
    if (!path || path.length < 1) { return; }
    const p = path[0];
    ctx.moveTo(p.x, p.y);
    for(let i=1; i<path.length; i++) {
        const p = path[i];
        ctx.lineTo(p.x, p.y);
    }
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
  }

  addPoint() {
    this.points.push(this.clampPoint(this.mx, this.my));
  }

  clearPoints() {
    this.points = [];
  }

  addPath() {
    this.paths.push(this.points);
    this.clearPoints();
  }

  onEvent(event: MouseEvent): void {
    this.event = event;
    if ('click' === event.type) {
        // this.clicked();
    }
    else if ('dblclick' === event.type) {
        // this.clearPoints();
        this.addPoint();
    }
    else if ('contextmenu' === event.type) {
        this.addPath();
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
    this.raf = requestAnimationFrame((now) => {
        this.loop(now);
    });      
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
