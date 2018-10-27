import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-property-editor',
  templateUrl: './property-editor.component.html',
  styleUrls: ['./property-editor.component.css']
})
export class PropertyEditorComponent implements OnInit {

  @Input()
  model: any = null;

  @Input()
  accessor: string = 'name';

  constructor() { }

  ngOnInit() {
  }

  getValue() {
      return this.model[this.accessor];
  }

  setValue(v) {
      this.model[this.accessor] = v;
  }

  get value() {
      return this.getValue();
  }

  set value(v) {
      this.setValue(v);
  }
}
