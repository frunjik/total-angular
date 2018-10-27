import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.css']
})
export class CurrentComponent implements OnInit {

  test = {
      a: 1,
      b: 'hello',
      q: 'hello',
      w: 'hello',
      f: 'hello',
      z: 'hello',
      get x() {
          return this.a + this.b;
      },
      set x(v) {
          this.a = v;
      },
  };


  constructor() { }

  ngOnInit() {
  }

}
