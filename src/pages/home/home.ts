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
  showEasterEgg = false;
  easterEggRiddle = '';
  easterEggResults = '';
  easterEggTags = [];
  easterEggWon = false;

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
              this.easterEggResults = '';
              this.easterEggWon = false;

              this.riddleProvider.hasRiddle(personId).subscribe((res) => {

                const hasRiddle = !!res;

                if (hasRiddle) {
                  this.objectProvider.getObjects()
                    .subscribe((objectIds) => {
                      this.easterEggTags = objectIds["description"]["tags"];
                      this.showEasterEgg = true;

                      this.riddleProvider.answerRiddle(this.easterEggTags).subscribe((res) => {
                        
                        const correctAnswer = !!res;

                        if (correctAnswer) {
                          this.easterEggResults = "Yeah, you got it right! Glasses!";
                          this.easterEggWon = true;
                        }
                        else {
                          this.easterEggResults = "Sorry, it is not the right answer.";
                        }
                        this.pause = true;

                        const pauseObs = TimerObservable.create(20000).subscribe(() => {
                          this.pause = false;
                          this.showEasterEgg = false;
                          pauseObs.unsubscribe();
                        });

                      });

                      
                    });
                }
                else {
                  this.riddleProvider.getRiddle(personId)
                    .subscribe((messages: any[]) => {

                      this.easterEggRiddle = messages["riddle"];
                      this.easterEggResults = '';
                      this.showEasterEgg = true;

                      this.pause = true;

                      const pauseObs = TimerObservable.create(20000).subscribe(() => {
                        this.pause = false;
                        this.showEasterEgg = false;
                        pauseObs.unsubscribe();
                      });

                    });
                }
              });
            }
            else {
              this.personalMessageProvider.getPersonalMessages(personId)
                .subscribe((messages: any[]) => {

                  for (const msg of messages) {
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
            });
      });
  }
}
