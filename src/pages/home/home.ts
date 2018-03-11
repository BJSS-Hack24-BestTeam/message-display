import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WebsocketService } from '../../services/websocket';
import { Subscriber } from 'rxjs';
import { PersonalMessageProvider } from '../../providers/personal-message/personal-message';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { RiddleProvider } from '../../providers/riddle/riddle';
import { ObjectProvider } from '../../providers/object/object';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  globalMessages: string[] = [];
  personalMessages: string[] = [];
  pause = false;
  status = '';
  easterEgg = false;
  easterEggRiddle = '';

  constructor(
    public navCtrl: NavController, 
    private personalMessageProvider: PersonalMessageProvider,
    private riddleProvider: RiddleProvider,
    private objectProvider: ObjectProvider) {
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

            if (isEasterEggPlayer) {
              this.riddleProvider.hasRiddle(personId).subscribe((hasRiddle) => {

              if (hasRiddle) {
                this.objectProvider.getObjectIds()
                  .subscribe((objectIds) => {
                    this.easterEggRiddle = <any>objectIds;
                    this.easterEgg = true;

                    this.pause = true;
                    
                    const pauseObs = TimerObservable.create(20000).subscribe(() => {
                      this.pause = false;
                      this.easterEgg = false;
                      pauseObs.unsubscribe();
                    });
                  });
              }
              else {
                this.riddleProvider.getRiddle(personId)
                  .subscribe((messages: any[]) => {

                    this.easterEggRiddle = messages["riddle"];
                    this.easterEgg = true;

                    this.pause = true;
                    
                    const pauseObs = TimerObservable.create(20000).subscribe(() => {
                      this.pause = false;
                      this.easterEgg = false;
                      pauseObs.unsubscribe();
                    });

                  });
                }
              });
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
}
