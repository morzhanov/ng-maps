import {Injectable} from '@angular/core';

export interface OnMessageReceivedListener {
  onReceived(message: string): void;
}

@Injectable()
export class MessageService {

  private listener: OnMessageReceivedListener;

  constructor() {
  }

  addMessage(message: string) {
    this.listener.onReceived(message);
  }

  setListener(listener: OnMessageReceivedListener) {
    this.listener = listener;
  }

}
