import { Component } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { app } from './app';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'Workbench v0.0.1';
  history = app.history;

  public constructor(
      private titleService: Title,
      private router: Router
 ) { 

  router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        // this.history.push(val.url);
        if (val.url !== '/edit') 
            this.history.splice(0, 0, val.url); 
      }
    });
  }

  get pages() {
    return app.parts.filter(part => (false !== part.menu) && 'page' === part.kind);
  }
 
  goBack() {
    window.history.back();
    this.setTitle(window.location.href);
  }
  goForward() {
    window.history.forward();
    this.setTitle(window.location.href);
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }  
}
