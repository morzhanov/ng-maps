import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms'; // <-- NgModel lives here
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {Angular2FontawesomeModule} from 'angular2-fontawesome/angular2-fontawesome';
import {HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './login/login.component';
import {EnterHomeGuard} from './enter-home-guard';
import {EnterLoginGuard} from './enter-login-guard';
import {HomeComponent} from './home/home.component';
import {LocationListComponent} from './location-list/location-list.component';
import {ProfileComponent} from './profile/profile.component';
import {MapsComponent} from './maps/maps.component';
import {AgmCoreModule, GoogleMapsAPIWrapper} from '@agm/core';
import {AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, SocialLoginModule} from 'angular4-social-login';
import {MessagesComponent} from './messages/messages.component';
import {MessageService} from './message.service';
import {MessageTitleComponent} from './message-title/message-title.component';
import {MapContentComponent} from './map-content/map-content.component';
import {environment} from '../environments/environment';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.google_api_id)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.facebook_api_id)
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LocationListComponent,
    ProfileComponent,
    MapsComponent,
    MessagesComponent,
    MessageTitleComponent,
    MapContentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    Angular2FontawesomeModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_maps_api_key
    }),
    SocialLoginModule
  ],
  providers: [EnterHomeGuard, EnterLoginGuard, MessageService, GoogleMapsAPIWrapper, {
    provide: AuthServiceConfig,
    useFactory: provideConfig
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
  // constructor(@Inject(PLATFORM_ID) private platformId: Object,
  //             @Inject(APP_ID) private appId: string) {
  //   const platform = isPlatformBrowser(platformId) ?
  //     'on the server' : 'in the browser';
  //   console.log(`Running ${platform} with appId=${appId}`);
  // }
}
