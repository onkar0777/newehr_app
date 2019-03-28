import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
 
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
 
  constructor(private authService: AuthService) {}
 
  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const currentUser = this.authService.currentUserValue;
    console.log(currentUser);
    if(currentUser && currentUser.token && currentUser.token.access) {
      const headers = req.headers.set('Authorization', 'Bearer ' + currentUser.token.access).append('Content-Type', 'application/json');
      const requestClone = req.clone({ headers });
      return next.handle(requestClone);
    } else {
      return next.handle(req);
    }
  }
}