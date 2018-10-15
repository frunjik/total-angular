import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CommandService {

  constructor(
    private http: HttpClient
  ) { }

  execute(cmd) {
    return this.http.get<string>('http://127.0.0.1:8000/api/command?cmd=' + cmd);
  }
}
