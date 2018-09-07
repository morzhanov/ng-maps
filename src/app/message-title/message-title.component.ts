import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-message-title',
  templateUrl: './message-title.component.html',
  styleUrls: ['./message-title.component.css']
})
export class MessageTitleComponent implements OnInit {

  title = null;

  @Input()
  show = false;

  @Output()
  result = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  add() {
    this.result.emit(this.title);
  }

  cancel() {
    this.result.emit(null);
  }

}
