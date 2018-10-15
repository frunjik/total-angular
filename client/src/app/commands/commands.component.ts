import { Component, OnInit } from '@angular/core';
import { CommandService } from '../command.service';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.css']
})
export class CommandsComponent implements OnInit {

  cmd = '';
  result = '';
  
  constructor(
      private commandService: CommandService
  ) { }

  ngOnInit() {
  }

  gitCommit() {
    this.execute('git status');
    this.cmd = 'git commit -a -m "commited from Workbench"';
  }

  run() {
    this.execute(this.cmd);
  }

  execute(cmd) {
      this.commandService.execute(cmd)
        .subscribe(response => {
          if (response.result) {
            this.result = response.result.stdout;
          }
          else {
            this.result = response.error;
          }
        });
  }
}
