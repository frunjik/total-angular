import { Component, OnInit } from '@angular/core';
import { FsService, FsEntries } from '../../fs.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-find-file',
  templateUrl: './find-file.component.html',
  styleUrls: ['./find-file.component.css']
})
export class FindFileComponent implements OnInit {

  entries = {
      files: [],
      folders: [],
  };
  
  constructor(
      private fs: FsService,
      private router: Router
  ) { }

  ngOnInit() {
  }

  onEnter(value) {
    this.fs.getEntries(value)
        .subscribe(
            (entries) => {
                this.entries = entries;
            }
        );      
  }

  edit(filename) {
    this.router.navigateByUrl(`/edit?name=${filename}`);
  }
}
