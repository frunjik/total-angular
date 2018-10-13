import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showFiller = false;
  title = 'app';
  links = [
      'server/controllers/files.js',
      'client/package.json',
      'client/src/app/app.module.ts',
      'client/src/app/app.component.ts',
      'client/src/app/app.component.html',
      'client/src/app/app.component.css',
      'client/src/app/editor/editor.component.ts',
      'client/src/app/editor/editor.component.html',
      'client/src/app/editor/editor.component.css',
      'client/src/app/pagenotfound/pagenotfound.component.ts',
      'client/src/app/pagenotfound/pagenotfound.component.html',
      'client/src/app/pagenotfound/pagenotfound.component.css',
  ];

    constructor(private router: Router) {
    }  

    gotoLink(l) {
        //this.router.navigate('/edit', {name: l});
        this.router.navigateByUrl("/edit?name="+l);
        this.panelOpenState = false;
    }
}
