import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.css']
})
export class LocationListComponent implements OnInit {

  @Input()
  locations: any[];

  @Output() removeMarker = new EventEmitter<number>();

  @Output() centerMarker = new EventEmitter<number>();
  @Output() clearAll = new EventEmitter<number>();

  constructor() {
  }

  onClearAllClicked() {
    this.clearAll.emit();
  }

  onItemClicked(idx) {
    console.log('item = ' + idx);
    this.centerMarker.emit(idx);
  }

  onCloseClicked(idx) {
    this.removeMarker.emit(idx);
  }

  ngOnInit() {
  }

}
