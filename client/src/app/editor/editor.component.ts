import { Component, OnInit } from '@angular/core';
import { FsService } from '../fs.service';

import { ActivatedRoute }     from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  filename: string = './client/src/app/app.component.html';
  filedata: string = '';

  editorOptions = {theme: 'vs-dark', language: 'javascript'};

  constructor(
    private fs: FsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let filename = params['name'] || this.filename;
      if (filename) {
        this.openFile(filename);
      }
    });
  }

  handleSuccess(file) {
    this.setFileData(file.data);
  }

  handleFailure(error) {
    this.setFileData(error.message);
  }

  setFileData(value) {
    this.filedata = value;
  }

  setFilename(value) {
    this.filename = value;
  }

  getFile() {
    this.fs.getFile(this.filename)
      .subscribe(
        file => this.handleSuccess(file),
        error => this.handleFailure(error)
      );
  }

  putFile() {
    this.fs.putFile(this.filename, this.filedata)
      .subscribe(
        success => {
            // reload ?
            // window.location.assign("http://localhost:8000/index.html");
        },
        failure => {}
      );
  }

  openFile(filename) {
    this.setFilename(filename);
    this.getFile();
  }

}
