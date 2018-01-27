import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {Injectable} from '@angular/core';

@Injectable()
export class EnterLoginGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const token = window.localStorage.getItem('token');
    if (token) {
      if (token.length > 10) {
        this.router.navigate(['']);
        return false;
      }
    }
    // const injector = appInjector();
    // const router = injector.get(Router);
    // router.navigate(['/dashboard']);
    return true;
  }
}
