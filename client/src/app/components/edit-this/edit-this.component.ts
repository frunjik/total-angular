import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-this',
  templateUrl: './edit-this.component.html',
  styleUrls: ['./edit-this.component.css']
})
export class EditThisComponent implements OnInit {

  @Input()
  page: string;

  @Input()
  component: string;

  @Input()
  file: string;

  @Input()
  height: string;

  constructor() { }

  ngOnInit() {
  }

  get filename() {
      return this.file || this.pagenameTS || this.componentnameTS;
  }
  // @TODO Cleanup ...
  get pagenameTS() {
      const name = this.page;
      return `client/src/app/${name}/${name}.component.ts`;
  }
  get pagenameCSS() {
      const name = this.page;
      return `client/src/app/${name}/${name}.component.css`;
  }
  get pagenameHTML() {
      const name = this.page;
      return `client/src/app/${name}/${name}.component.html`;
  }
  get componentnameTS() {
      const name = this.component;
      return `client/src/app/components/${name}/${name}.component.ts`;
  }
  get componentnameCSS() {
      const name = this.component;
      return `client/src/app/components/${name}/${name}.component.css`;
  }
  get componentnameHTML() {
      const name = this.component;
      return `client/src/app/components/${name}/${name}.component.html`;
  }
}
