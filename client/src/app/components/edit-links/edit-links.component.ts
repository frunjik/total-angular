import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-links',
  templateUrl: './edit-links.component.html',
  styleUrls: ['./edit-links.component.css']
})
export class EditLinksComponent implements OnInit {

  @Input()
  component: string = 'components/edit-links/edit-links';

  componentRoot = './client/src/app';

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  edit(extension) {
    this.router.navigateByUrl(`/edit?name=${this.componentRoot}/${this.component}.component.${extension}`);
  }
}
