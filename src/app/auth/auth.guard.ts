import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Storage } from '@ionic/storage';



@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private storage: Storage
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.storage.get("currentUser").then((user) => {
            if (user) {
                return true;
              } else {
                this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
                return false;
              }
        });
    }
}