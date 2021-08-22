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

  filename = './README.md';
  filedata = '';

  editorOptions = {theme: 'vs-light', language: 'javascript'};

  constructor(
    private fs: FsService
  ) { }

  ngOnInit(): void {
    this.getFile();
  }

  handleSuccess(file: any): void {
    this.setFileData(file.data);
  }

  handleFailure(error: Error): void {
    this.setFileData(error.message);
  }

  setFileData(value: string): void {
    this.filedata = value;
  }

  setFilename(value: string): void {
    this.filename = value;
  }

  getFile(): void {
    this.fs.getFile(this.filename)
      .subscribe(
        file => this.handleSuccess(file),
        error => this.handleFailure(error)
      );
  }

  putFile(): void {
    this.fs.putFile(this.filename, this.filedata)
      .subscribe(
        success => {},
        failure => {}
      );
  }

  selectFile(filename: string): void {
    this.setFilename(filename);
    this.getFile();
  }
}
