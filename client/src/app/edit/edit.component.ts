import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { app as appDefinition} from '../app';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {
  app = appDefinition;
  constructor(private router: Router) {
  }  

  goto(url) {
    this.router.navigateByUrl(url);
  }
}
