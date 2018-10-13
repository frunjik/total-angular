import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  filenames = [
      './README.md',
      'server/controllers/files.js',
      'client/package.json',
      'client/src/index.html',
      'client/src/app/app.module.ts',
      'client/src/app/app.component.ts',
      'client/src/app/app.component.html',
      'client/src/app/app.component.css',
      'client/src/app/edit/edit.component.ts',
      'client/src/app/edit/edit.component.html',
      'client/src/app/edit/edit.component.css',
      'client/src/app/editor/editor.component.ts',
      'client/src/app/editor/editor.component.html',
      'client/src/app/editor/editor.component.css',
      'client/src/app/home/home.component.ts',
      'client/src/app/home/home.component.html',
      'client/src/app/home/home.component.css',
      'client/src/app/pagenotfound/pagenotfound.component.ts',
      'client/src/app/pagenotfound/pagenotfound.component.html',
      'client/src/app/pagenotfound/pagenotfound.component.css',
  ];

  constructor(private router: Router) {
  }  
}
