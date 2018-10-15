import { Component, OnInit } from '@angular/core';
import { CommandService } from '../command.service';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.css']
})
export class CommandsComponent implements OnInit {

  cmd = '';
  result = {
    stderr: '',
    stdout: '',
    error:  '',
  }
  
  constructor(
      private commandService: CommandService
  ) { }

  ngOnInit() {
  }

  gitCommit() {
    this.execute('git status');
    this.cmd = 'git commit -a -m "commited from Workbench"';
  }

  run(cmd = null) {
    if (cmd) {
      this.cmd = cmd;      
    }
    this.execute(this.cmd);
  }

  execute(cmd) {
      this.commandService.execute(cmd)
        .subscribe(response => {
          if (response.result) {
            this.result = response.result;
          }
          else {
            this.result = {
                stdout: '',
                stderr: '',
                error: response.error
            };
          }
        });
  }
}
