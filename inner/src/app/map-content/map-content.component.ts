import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { GoogleMapsAPIWrapper } from '@agm/core';

@Component({
  selector: 'app-core-map-content',
  template: '',
})
export class MapContentComponent implements OnInit {
  @Output() onMapLoad: EventEmitter<{}> = new EventEmitter<{}>();

  constructor(public gMaps: GoogleMapsAPIWrapper) {}

  ngOnInit() {
    this.gMaps.getNativeMap().then((map) => {
      this.onMapLoad.emit(map);
    });
  }
}
