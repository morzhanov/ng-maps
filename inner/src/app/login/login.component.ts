import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser} from 'angular4-social-login';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  clicked = false;

  email: string;
  password: string;
  token: string;
  private user: SocialUser;

  constructor(private messageService: MessageService,
              private authService: AuthService,
              private http: HttpClient,
              private router: Router) {
  }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      if (!this.clicked) {
        return;
      } else {
        this.clicked = false;
      }

      this.user = user;
      console.log(this.user);

      if (!user) {
        return;
      }

      if (!user.provider) {
        return;
      }

      if (user.provider === 'GOOGLE') {
        this.performGoogleAuth(user);
      } else {
        this.performFBAuth(user);
      }
    });
  }

  onAuth() {
    this.clicked = true;
    this.http.get(environment.api_url + 'health-check')
      .subscribe(d => console.log(d));

    const route: string = environment.api_url + 'login';
    try {
      this.http.post(
        route,
        null,
        {
          headers: {
            'x-email': this.email,
            'x-pwd': this.password
          }
        }
      ).subscribe(data => {
          const d: any = data;
          console.log(d);
          if (d.token) {
            window.localStorage.setItem('token', d.token);
            window.localStorage.setItem('email', d.email);
            window.localStorage.setItem('lat', d.lat);
            window.localStorage.setItem('lng', d.lng);
            window.localStorage.setItem('photoUrl', d.photoUrl);
            this.router.navigate(['']);
          } else {
            alert(d.body);
          }
        },
        e => {
          this.messageService.addMessage(e.error.error);
          this.clicked = false;
        });
    } catch (e) {
      this.messageService.addMessage(e);
      this.clicked = false;
      console.log(e);
    }

    console.log(this.email);
    console.log(this.password);
  }

  signInWithGoogle(): void {
    this.clicked = true;
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.clicked = true;
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  private performGoogleAuth(user: SocialUser) {
    const route: string = environment.api_url + 'google-auth';
    try {
      this.http.post(
        route,
        null,
        {
          headers: {
            'x-email': user.email,
            'x-google-id': user.id,
            'x-photo': user.photoUrl
          }
        }
      ).subscribe(data => {
          const d: any = data;
          console.log(d);
          if (d.token) {
            window.localStorage.setItem('token', d.token);
            window.localStorage.setItem('email', d.email);
            window.localStorage.setItem('lat', d.lat);
            window.localStorage.setItem('lng', d.lng);
            window.localStorage.setItem('photoUrl', d.photoUrl);
            this.router.navigate(['']);
          } else {
            alert(d.body);
          }
        },
        e => {
          this.messageService.addMessage(e.error.error);
          this.clicked = false;
        });
    } catch (e) {
      this.clicked = false;
      this.messageService.addMessage(e.error.error);
      console.log(e);
    }
  }

  private performFBAuth(user: SocialUser) {
    const route: string = environment.api_url + 'facebook-auth';
    try {
      this.http.post(
        route,
        null,
        {
          headers: {
            'x-email': user.email,
            'x-facebook-id': user.id,
            'x-photo': user.photoUrl
          }
        }
      ).subscribe(data => {
          const d: any = data;
          console.log(d);
          if (d.token) {
            window.localStorage.setItem('token', d.token);
            window.localStorage.setItem('email', d.email);
            window.localStorage.setItem('lat', d.lat);
            window.localStorage.setItem('lng', d.lng);
            window.localStorage.setItem('photoUrl', d.photoUrl);
            this.router.navigate(['']);
          } else {
            alert(d.body);
          }
        },
        e => {
          this.messageService.addMessage(e.error.error);
          this.clicked = false;
        });
    } catch (e) {
      this.clicked = false;
      this.messageService.addMessage(e);
      console.log(e);
    }
  }

}
