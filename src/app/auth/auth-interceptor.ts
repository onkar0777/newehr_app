import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
 
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
 
  constructor(private authService: AuthService) {}
 
  intercept(req: HttpRequest<any>, next: HttpHandler) {

    return this.authService.getAuthToken().pipe(
        switchMap(token => {
            const headers = req.headers.set('Authorization', 'Bearer ' + token).append('Content-Type', 'application/json');
            const requestClone = req.clone({
                headers 
            });
            return next.handle(requestClone);
        })
    );
  }
}