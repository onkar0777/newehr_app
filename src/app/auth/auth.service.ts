import { Injectable } from  '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';

import { Storage } from  '@ionic/storage';
import { User } from  './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  AUTH_SERVER_ADDRESS:  string  =  'http://192.168.1.7:8000/api';
  authSubject  =  new  BehaviorSubject(false);

  constructor(private  httpClient:  HttpClient, private  storage:  Storage) { }

  register(user: User): Observable<any> {
    return this.httpClient.post<any>(`${this.AUTH_SERVER_ADDRESS}/register`, user).pipe(
      tap(async (res:  any ) => {

        if (res.user) {
          await this.storage.set("ACCESS_TOKEN", res.token);
          this.authSubject.next(true);
        }
      })
    );
  }

  login(user: User): Observable<any> {
    console.log(user);
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/login`, user).pipe(
      tap(async (res: any) => {
        console.log("response from login server - ", res);
        if (res.user) {
          await this.storage.set("ACCESS_TOKEN", res.token);
          this.authSubject.next(true);
        }
      })
    );
  }

  async logout() {
    await this.storage.remove("ACCESS_TOKEN");
    this.authSubject.next(false);
  }

  isLoggedIn() {
    return this.authSubject.asObservable();
  }

  registerToken(token) {
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/devices`, token).pipe(
      tap(async (res: any) => {
        console.log("response from registerToken server - ", res);
      })
    );
  }

}
