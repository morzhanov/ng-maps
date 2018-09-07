import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {Injectable} from '@angular/core';

@Injectable()
export class EnterHomeGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const token = window.localStorage.getItem('token');
    console.log('token in a guard = ' + token);
    if (token) {
      if (token.length > 10) {
        return true;
      }
    }
    // const injector = appInjector();
    // const router = injector.get(Router);
    // router.navigate(['/dashboard']);
    this.router.navigate(['login']);
    return false;
  }
}
