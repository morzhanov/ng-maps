import {Component, OnInit} from '@angular/core';
import {MessageService, OnMessageReceivedListener} from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnMessageReceivedListener {

  messages: string[] = [];

  constructor(private messageService: MessageService) {
  }

  onReceived(message: string) {
    this.messages.push(message);
    setTimeout(() => this.messages.pop(), 5000);
  }

  ngOnInit() {
    this.messageService.setListener(this);
  }
}
