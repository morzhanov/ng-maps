import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as DG from '2gis-maps';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

declare var google: any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

  readonly MAP_TYPE_GOOGLE: boolean = false;
  readonly MAP_TYPE_DG: boolean = true;

  googleZoom = 13;

  googleMap: any;

  mapType = true;

  titlePopUp = false;

  markers: any[] = [];

  lat: number;
  lng: number;

  dgMap: any;
  @Output() addMarker = new EventEmitter<any>();
  private currentMarker: any;

  constructor(private http: HttpClient) {
  }

  onGoogleMapCenterChanged(e) {
    this.changeCenter(e, this);
  }

  onGoogleMapClicked(e) {
    this.currentMarker = DG.marker([e.coords.lat, e.coords.lng]);
    this.titlePopUp = true;
  }

  assignMarker(marker: any) {
    const m = DG.marker([marker.lat, marker.lng]);

    if (marker.title) {
      m.bindLabel(marker.title);
    }

    this.markers.push(m);
    if (this.dgMap) {
      m.addTo(this.dgMap);
    }
  }

  center(marker: any) {
    if (this.mapType === this.MAP_TYPE_DG) {
      this.dgMap.panTo(marker);
    } else {
      this.centerGoogleMap(marker);
    }
  }

  removeMarker(id: number) {
    this.markers[id].remove();
    this.markers.splice(id, 1);
  }

  onChangeMapType() {
    console.log('in on change map type');

    this.mapType = !this.mapType;

    window.localStorage.setItem('mapType', this.mapType + '');

    const route = environment.api_url + 'user';
    const token = window.localStorage.getItem('token');
    this.http.put(
      route,
      {
        mapType: this.mapType
      },
      {
        headers: {
          'x-token': token
        }
      }
    ).subscribe(data => {
      console.log(data);
    });
    if (this.mapType === this.MAP_TYPE_DG) {
      setTimeout(() => this.initDgMap(), 50);
    }
  }

  loadGoogleAPIWrapper(map) {
    this.googleMap = map;
  }

  centerGoogleMap(center: any) {
    const self = this;
    if (this.mapType === this.MAP_TYPE_GOOGLE) {
      try {
        const position = new google.maps.LatLng(center.lat, center.lng);
        self.googleMap.panTo(position);
      } catch (e) {
        console.log(e);
      }
    }
  }

  ngOnInit() {
    console.log('in on init');
    let lat = parseFloat(window.localStorage.getItem('lat'));
    let lng = parseFloat(window.localStorage.getItem('lng'));
    const type: boolean = window.localStorage.getItem('mapType') === 'true';

    if (!lat) {
      lat = 46.443;
    }

    if (!lng) {
      lng = 30.773;
    }

    this.lat = lat;
    this.lng = lng;

    this.mapType = type;

    if (this.mapType === this.MAP_TYPE_DG && !this.dgMap) {
      setTimeout(() => this.initDgMap(), 50);
    }
  }

  addTitle(title: string) {
    this.titlePopUp = false;
    if (title) {
      this.currentMarker.bindLabel(title);
    }
    if (this.mapType === this.MAP_TYPE_DG) {
      this.currentMarker.addTo(this.dgMap);
    }
    this.markers.push(this.currentMarker);
    this.addMarker.emit({
      lat: this.currentMarker._latlng.lat,
      lng: this.currentMarker._latlng.lng,
      title: title
    });
  }

  private changeCenter(center, self) {
    if (this.mapType === this.MAP_TYPE_GOOGLE) {
      this.centerGoogleMap(center);
    }

    window.localStorage.setItem('lat', center.lat);
    window.localStorage.setItem('lng', center.lng);

    this.lat = center.lat;
    this.lng = center.lng;

    const route = environment.api_url + 'user';
    const token = window.localStorage.getItem('token');

    self.http.put(
      route,
      {
        lat: center.lat,
        lng: center.lng
      },
      {
        headers: {
          'x-token': token
        }
      }
    ).subscribe(data => {
      console.log(data);
    });
  }

  private initDgMap() {
    try {
      this.dgMap = DG.map('dg-map', {
        center: [this.lat, this.lng],
        zoom: 13
      });

      for (let i = 0; i < this.markers.length; ++i) {
        this.markers[i].remove();
        this.markers[i].addTo(this.dgMap);
      }

    } catch (e) {
      console.log(e);
    }

    const self = this;

    this.dgMap.on('click', function (e) {
      console.log('карту, координаты ' + e.latlng.lat + ', ' + e.latlng.lng);

      self.currentMarker = DG.marker([e.latlng.lat, e.latlng.lng]);
      self.titlePopUp = true;
    });

    self.dgMap.on('moveend', function (e) {
      const center = self.dgMap.getCenter();
      console.log('map moved ' + center.lat + ', ' + center.lng);
      self.changeCenter(center, self);
    });
  }

}
