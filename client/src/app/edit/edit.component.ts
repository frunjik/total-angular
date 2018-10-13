import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {

  panels = [
      { 
        title: 'app',
        filenames: [
            'client/src/app/app.component.ts',
            'client/src/app/app.component.html',
            'client/src/app/app.component.css',
            'client/src/app/home/home.component.ts',
            'client/src/app/home/home.component.html',
            'client/src/app/home/home.component.css',
        ]
      },
      { 
        title: 'edit',
        filenames: [
            'client/src/app/edit/edit.component.ts',
            'client/src/app/edit/edit.component.html',
            'client/src/app/edit/edit.component.css',
            'client/src/app/editor/editor.component.ts',
            'client/src/app/editor/editor.component.html',
            'client/src/app/editor/editor.component.css',
        ]
      },
      { 
        title: 'client',
        filenames: [
            'client/package.json',
            'client/src/index.html',
            'client/src/app/fs.service.ts',
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
        ]
      },
      { 
        title: 'server',
        filenames: [
            './README.md',
            'server/controllers/files.js',
        ]
      },
  ];

  constructor(private router: Router) {
  }  
}
