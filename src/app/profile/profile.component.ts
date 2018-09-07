import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  name: string;

  photoUrl: string;

  constructor(private router: Router) {
    const email = window.localStorage.getItem('email');
    const aidx = email.indexOf('@');
    this.name = '@' + email.substring(0, aidx);
    this.photoUrl = window.localStorage.getItem('photoUrl');
    if (!this.photoUrl) {
      this.photoUrl = 'NaN';
    }
  }

  signOut() {
    window.localStorage.clear();
    setTimeout(() => this.router.navigate(['/login']), 100);
  }

  ngOnInit() {
  }

}
