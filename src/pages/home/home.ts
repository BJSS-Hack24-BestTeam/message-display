import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WebsocketService } from '../../services/websocket';
import { Subscriber } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  globalMessages: string[] = [];

  constructor(public navCtrl: NavController) {
    const url = "ws://51.143.186.87:8889/ws";
    let blah: Subscriber<any> = new Subscriber();

    const ws = new WebsocketService();
    ws.createObservableSocket(url, blah).subscribe(
      (message) => this.globalMessages.push(message));
  }

}
