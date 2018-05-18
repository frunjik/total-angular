import { Component, OnInit } from '@angular/core';
import { FsService } from '../fs.service';

export interface File {
  data: string;
}

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {

  filename: string = './README.md';
  filedata: string = '';

  editorOptions = {theme: 'vs-dark', language: 'javascript'};

  constructor(
    private fs: FsService
  ) { }

  ngOnInit() {
    this.getFile();
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
        success => {},
        failure => {}
      );
  }

  selectFile(filename) {
    this.setFilename(filename);
    this.getFile();
  }

}
