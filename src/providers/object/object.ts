import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ObjectProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ObjectProvider {

  objectsCheckUrl = "http://127.0.0.1:5000/display/objects";

  constructor(public http: HttpClient) {
    
  }
  
  getObjects() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    headers.append('Accept','application/json');

    return this.http.get(this.objectsCheckUrl, { headers: headers });
  }

}
