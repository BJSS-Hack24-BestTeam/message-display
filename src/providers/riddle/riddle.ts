import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RiddleProvider {

  riddleApi: string = 'http://51.143.186.87:8080/riddle/';
  hasRiddleApi: string = 'http://51.143.186.87:8080/hasriddle/';
  riddleAnswerApi: string = 'http://51.143.186.87:8080/riddle/3/';

  constructor(public http: HttpClient) {
  
  }

  getRiddle(personId: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    headers.append('Accept','application/json');

    return this.http.get(this.riddleApi + personId, { headers: headers });
  }

  hasRiddle(personId: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    headers.append('Accept','application/json');

    return this.http.get(this.riddleApi + personId, { headers: headers });
  }

  answerRiddle(answers: string[]) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    headers.append('Accept','application/json');

    return this.http.get(this.riddleApi + answers.join(","), { headers: headers });
  }
}
