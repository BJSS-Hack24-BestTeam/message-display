import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//var Stomp = require('stompjs');

//var Stomp: any;

import { StompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { StompState } from '@stomp/ng2-stompjs';

import "rxjs/add/operator/map";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  globalMessages: string[] = [];

  // Stream of messages
  private subscription: Subscription;
  public messages: Observable<Message>;
  public state: Observable<string>;
  public stomp_subscription;

  // Subscription status
  public subscribed: boolean;
  

  // var socket = new WebSocket("ws://localhost:8080/messaging-example/portfolio/websocket");
  // var stompClient = Stomp.over(socket);

  // var headers = {};
  // var connectCallback = function(frame) {
  //     stompClient.subscribe("/exchange/testExchange/testQueue", function(message) {
  //         document.body.innerHTML += "<p>" + message + "</p>";
  //     }, { });
  // };
  // var errorCallback = function(frame) {
  //     console.log("Connection Error"); 
  // };
  // stompClient.connect(headers, connectCallback, errorCallback);

  constructor(
    public navCtrl: NavController,
    private stompService: StompService) {

      this.state = this.stompService.state
        .map((state: number) => StompState[state]);


      this.stomp_subscription = this.stompService.subscribe('/exchange/hack24topic/testQueue');

      this.stomp_subscription.map((message: Message) => {
        return message.body;
      }).subscribe((msg_body: string) => {
        console.log(`Received: ${msg_body}`);
      });

      //this.stompService.publish('/hack24topic/testQueue', 'blah');
  }

  ngOnInit() {
    //this.subscribed = false;

    // const x = this.stompService.subscribe('/hack24topic/testQueue');
    // x.subscribe(console.log);

    // console.log("Subscribed");

    // Store local reference to Observable
    // for use with template ( | async )
    //this.subscribe();
  }

  public subscribe() {
    if (this.subscribed) {
      return;
    }

    console.log("About to subscribe");

    // Stream of messages
    const x = this.stompService.subscribe('/hack24topic/testQueue');
    x.subscribe(console.log);

    console.log("Subscribed");
    
    // Subscribe a function to be run on_next message
    this.subscription = this.messages.subscribe(this.onNextMessage);

    this.subscribed = true;
  }

  public unsubscribe() {
    if (!this.subscribed) {
      return;
    }

    // This will internally unsubscribe from Stomp Broker
    // There are two subscriptions - one created explicitly, the other created in the template by use of 'async'
    this.subscription.unsubscribe();
    this.subscription = null;
    this.messages = null;

    this.subscribed = false;
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  onNextMessage(message: Message) {

    // Store message in "historic messages" queue
    //this.mq.push(message.body + '\n');

    // Count it
    //this.count++;

    // Log it to the console
    console.log(message);
  }

}
