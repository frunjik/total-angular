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

  set setCmd(value) {
      this.cmd = value;
      this.focusInput();
  }

  ngOnInit() {
  }

  focusInput() {
      const e = document.querySelector('input');
      e.focus();
  }

  gitCommit() {
    this.execute('git status');
    this.cmd = 'git commit -a -m "commited from Workbench"';
    this.focusInput();
  }

  run(cmd = null) {
    if (cmd) {
      this.cmd = cmd;      
    }
    this.execute(this.cmd);
    this.focusInput();
  }

  execute(cmd) {
      if (!cmd) return;
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
