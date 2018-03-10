import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  globalMessages: string[] = [];

  constructor(public navCtrl: NavController) {
    this.globalMessages.push("8 beds available in the shelter on Queen's Street");
    this.globalMessages.push("Small and large jumpers available");
    this.globalMessages.push("Some other message");
  }

}
