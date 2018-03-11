import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class PersonalMessageProvider {

  faceCheckUrl = "http://127.0.0.1:5000/display/check_face";
  messageApi: string = 'http://51.143.186.87:8080/message/';

  constructor(public http: HttpClient) {
  
  }

  getPersonIds() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    headers.append('Accept','application/json');

    return this.http.get(this.faceCheckUrl, { headers: headers });
  }

  getPersonalMessages(personId: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    headers.append('Accept','application/json');

    return this.http.get(this.messageApi + personId, { headers: headers });
  }
  

}

