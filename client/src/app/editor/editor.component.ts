import { Component, Input, OnInit } from '@angular/core';
import { FsService } from '../fs.service';

import { ActivatedRoute }     from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  status = '';
  filename: string = './client/src/app/components/edit-links/edit-links.component.ts';
  filedata: string = '';

  // todo better name / scheme
  @Input()
  set loadfile(name: string) {
    this.openFile(name);
  }

  @Input()
  set height(value: string) {
    this.editorStyle.height = value;
  }

  editorStyle = {
    height: '550px'
  };
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
    this.setStatus('loaded');
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

  timeString(date) {
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    return `${h}:${m}:${s}`;
  }

  setStatus(state) {
    const now = new Date();
    const time = this.timeString(now);
    this.status = `${state} @ ${time}`;
  }

  getFile() {
    this.fs.getFile(this.filename)
      .subscribe(
        file => this.handleSuccess(file),
        error => this.handleFailure(error)
      );
  }

  putFile(reload) {
    this.fs.putFile(this.filename, this.filedata)
      .subscribe(
        success => {
            this.setStatus('saved');
            if (reload) {
                this.reload(800);
            }
        },
        failure => {}
      );
  }

  reload(timeout) {
    setTimeout(() => {window.location.href = "http://localhost:8000/index.html";}, timeout);
  }

  openFile(filename) {
    this.setFilename(filename);
    this.getFile();
  }

  saveAndReload() {
    this.putFile(true);
  }

}
