import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    const access = route.data.key;
    if (currentUser) {
      if (currentUser.user.userTypeId === 1) {
        return true;
      } else if (currentUser.user.userTypeId === 2) {
        const profile = JSON.parse(currentUser.user.profile.config);
        if (access === "home") {
          return true;
        }
        return profile[access];
      }
    }

    localStorage.removeItem('session');
    this.authService.logout();
    this.router.navigate(['/login']);
    return false;
  }
}