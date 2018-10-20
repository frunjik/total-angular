import { Component } from '@angular/core';
import { app } from './app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Workbench v0.0.1';
  get pages() {
    return app.parts.filter(part => (false !== part.menu) && 'page' === part.kind);
  }
}
