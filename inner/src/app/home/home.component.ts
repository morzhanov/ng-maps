import {Component, OnInit, ViewChild} from '@angular/core';
import {MapsComponent} from '../maps/maps.component';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild(MapsComponent) maps: MapsComponent;

  locations: any[] = [];

  constructor(private http: HttpClient) {
  }

  getMarkers() {
    const route: string = environment.api_url + 'marker';
    const token = window.localStorage.getItem('token');
    this.http.get(
      route,
      {
        headers: {
          'x-token': token
        }
      }
    ).subscribe(data => {
      console.log(data);
      const d: any = data;
      for (let i = 0; i < d.length; ++i) {
        this.locations.push(d[i]);
        this.maps.assignMarker(d[i]);
      }
    });
  }

  centerMarker(idx) {
    const mark = this.locations[idx];
    this.maps.center(mark);
  }

  removeMarker(id: number) {
    const route: string = environment.api_url + 'marker';
    const token = window.localStorage.getItem('token');
    const mark = this.locations[id];
    this.http.delete(
      route,
      {
        headers: {
          'x-lng': '' + mark.lng,
          'x-lat': '' + mark.lat,
          'x-token': token
        }
      }
    ).subscribe(data => {
      console.log(data);
      this.locations.splice(id, 1);
      this.maps.removeMarker(id);
    });
  }

  clearAll() {
    const route: string = environment.api_url + 'marker';
    const token = window.localStorage.getItem('token');

    const size = this.locations.length;

    const temp = this.locations.slice(0, this.locations.length);

    for (let i = 0; i < temp.length; ++i) {
      const mark = temp[i];
      this.http.delete(
        route,
        {
          headers: {
            'x-lng': '' + mark.lng,
            'x-lat': '' + mark.lat,
            'x-token': token
          }
        }
      ).subscribe(data => {
        console.log(data);
      });
    }

    for (let i = 0; i < size; ++i) {
      this.locations.splice(0, 1);
      this.maps.removeMarker(0);
    }
  }

  addMarker(mark: any) {
    this.locations.push(mark);

    const route: string = environment.api_url + 'marker';
    const token = window.localStorage.getItem('token');
    this.http.post(
      route,
      mark,
      {
        headers: {
          'x-token': token
        }
      }
    ).subscribe(data => {
      console.log(data);
    });
  }

  ngOnInit() {
    this.getMarkers();
  }

}
