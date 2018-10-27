import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-object-editor',
  templateUrl: './object-editor.component.html',
  styleUrls: ['./object-editor.component.css']
})
export class ObjectEditorComponent implements OnInit {

  @Input()
  model: any;

  constructor() { }

  ngOnInit() {
  }

  get accessors() {
      return Object.keys(this.model);
  }

}
