import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {EnterLoginGuard} from './enter-login-guard';
import {EnterHomeGuard} from './enter-home-guard';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [EnterLoginGuard]},
  {path: '', component: HomeComponent, canActivate: [EnterHomeGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
