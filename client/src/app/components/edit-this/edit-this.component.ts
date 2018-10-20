import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-this',
  templateUrl: './edit-this.component.html',
  styleUrls: ['./edit-this.component.css']
})
export class EditThisComponent implements OnInit {

  @Input()
  page: string;
  constructor() { }

  ngOnInit() {
  }

  get name() {
      return this.page;
  }

  get filenameTS() {
      const name = this.name;
      return `client/src/app/${name}/${name}.component.ts`;
  }
  get filenameCSS() {
      const name = this.name;
      return `client/src/app/${name}/${name}.component.css`;
  }
  get filenameHTML() {
      const name = this.name;
      return `client/src/app/${name}/${name}.component.html`;
  }

}
