import { Component } from '@angular/core';
import { Router } from '@angular/router';

function sourceFilenames(elem, path='') {
    return [
        `client/src/app/${path}${elem}/${elem}.component.ts`,
        `client/src/app/${path}${elem}/${elem}.component.html`,
        `client/src/app/${path}${elem}/${elem}.component.css`,
    ];
}

function pageFilenames(page) {
    return sourceFilenames(page);
}

function componentFilenames(component) {
    return sourceFilenames(component, 'components/');
}

function componentPanel(component) {
    return {
        title: component,
        filenames: componentFilenames(component)
    };
}

function pagePanel(page) {
    return {
        title: page,
        filenames: pageFilenames(page)
    };
}

/*
const pages = [];
const components = [];
const app = {
    title: 'Workbench v0.0.2',
    topics: [
        {
            title: 'Todo',
            filenames: [
            ],
        }
    ],
    client: {
        pages: [],
        components: [],
        services: [],
    },
    server: {
    },
};
*/

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {

  todo = [
    'make side menu nested',
    'make side menu global',
    'todo items better place',
    'remembering state',
    'set editor height',
    'cmd new component',
    'cmd new file',
    'cmd new folder',
    'folder/ file searching',
    'authentication',
    '-------------------',
    'DONE console (commands)',
    'DONE better file navigation',
    'DONE flex layout',
    'DONE better navigation',
    'DONE editor.filename*',
  ];

  topics = [
      { 
        title: 'current',
        filenames: [
            'client/src/app/home/home.component.ts',
            'client/src/app/home/home.component.html',
            'client/src/app/home/home.component.css',
        ]
      },
      { 
        title: 'svg',
        filenames: [
            'client/src/assets/prompt.svg',
            'client/src/assets/bluerect.svg',
            'client/src/assets/example.svg',
            'client/src/app/edit/edit.component.ts',
            'client/src/app/edit/edit.component.html',
            'client/src/app/home/home.component.ts',
            'client/src/app/home/home.component.html',
            'client/src/app/home/home.component.css',
        ]
      },
      pagePanel('home'),
      { 
        title: 'app',
        filenames: [
            'client/src/app/app.component.ts',
            'client/src/app/app.component.html',
            'client/src/app/app.component.css',
        ]
      },
      pagePanel('woodpusher'),
      pagePanel('commands'),
      pagePanel('edit'),
      pagePanel('editor'),
      componentPanel('canvas'),
      componentPanel('edit-links'),
      { 
        title: 'services',
        filenames: [
            'client/src/app/fs.service.ts',
            'client/src/app/command.service.ts',
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
            'server/controllers/commands.js',
        ]
      },
  ];

  constructor(private router: Router) {
  }  
}
