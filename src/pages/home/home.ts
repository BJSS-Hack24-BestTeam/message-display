import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WebsocketService } from '../../services/websocket';
import { Subscriber } from 'rxjs';
import { PersonalMessageProvider } from '../../providers/personal-message/personal-message';
import { TimerObservable } from "rxjs/observable/TimerObservable";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  globalMessages: string[] = [];
  personalMessages: string[] = [];

  constructor(
    public navCtrl: NavController, 
    private personalMessageProvider: PersonalMessageProvider) {
  }

  ionViewDidLoad() {
    // Global stuff
    const url = "ws://51.143.186.87:8889/ws";
    let blah: Subscriber<any> = new Subscriber();

    const ws = new WebsocketService();
    ws.createObservableSocket(url, blah).subscribe(
      (message) => this.globalMessages.push(message));

    // Personal Stuff
    TimerObservable.create(0, 2000)
      .subscribe(() => {
        this.personalMessageProvider.getPersonIds()
          .subscribe((message) => {

            this.personalMessages = [];
            const personId = message["personId"];

            this.personalMessageProvider.getPersonalMessages(personId)
              .subscribe((messages: any[]) => {
                for(const msg of messages) {
                  this.personalMessages.push(msg["theMessage"]);
                }
              });
          },
         (err) => {
           console.log(err);
           this.personalMessages = [];
         } );
      });
  }
}
