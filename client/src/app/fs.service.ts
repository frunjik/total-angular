import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FsEntries {
  files: string[];
  folders: string[];
}

@Injectable()
export class FsService {

  constructor(
    private http: HttpClient
  ) { }

  getFile(filename: string): Observable<string> {
    return this.http.get<string>('http://127.0.0.1:8000/api/getfile?name=' + filename);
  }

  putFile(filename: string, filedata: string): Observable<string> {
    return this.http.post<string>('http://127.0.0.1:8000/api/putfile?name=' + filename, filedata);
  }

  getEntries(filter: string): Observable<FsEntries> {
    return this.http.get<FsEntries>('http://127.0.0.1:8000/api/folders?name=' + filter);
  }
}
