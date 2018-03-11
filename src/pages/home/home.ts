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
  pause = false;
  status = '';

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
      (message) => {
        this.globalMessages.pop();
        this.globalMessages.push(message);
      });

    // Personal Stuff
    TimerObservable.create(0, 5000)
      .subscribe(() => {
        if (this.pause === true) {
          return;
        }

        this.personalMessageProvider.getPersonIds()
          .subscribe((message) => {

            if (this.pause === true) {
              return;
            }

            this.personalMessages = [];
            const personId = message["personId"];
            const isEasterEggPlayer = !!message["isEasterEggPlayer"]
            this.status = "Is EasterEgg " + isEasterEggPlayer;

            if (isEasterEggPlayer === true) {
              this.playEasterEggGame();
            }
            else {
              this.personalMessageProvider.getPersonalMessages(personId)
                .subscribe((messages: any[]) => {
                  
                  for(const msg of messages) {
                    this.personalMessages.push(msg["theMessage"]);
                  }

                  this.pause = true;
                  
                  const pauseObs = TimerObservable.create(20000).subscribe(() => {
                    this.pause = false;
                    pauseObs.unsubscribe();
                  });
                });
            }
          },
         (err) => {
           console.log(err);
           this.personalMessages = [];
         } );
      });
  }

  playEasterEggGame(): any {
    
    this.globalMessages.push("Looks like you are playing the Easter Egg game!!");
    this.globalMessages.pop();

    this.pause = true;
                  
    const pauseObs = TimerObservable.create(20000).subscribe(() => {
      this.pause = false;
      pauseObs.unsubscribe();
    });
  }
}
