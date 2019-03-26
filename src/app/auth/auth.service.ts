import { Injectable } from  '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject, of, from } from  'rxjs';

import { Storage } from  '@ionic/storage';
import { User } from  './user';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  AUTH_SERVER_ADDRESS:  string  =  'http://192.168.1.7:8000/api';
  authSubject  =  new  BehaviorSubject(false);

  constructor(private  httpClient:  HttpClient, private  storage:  Storage, private platform: Platform) { }

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
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/token`, user).pipe(
      tap(async (res: any) => {
        console.log("response from login server - ", res);
        await this.storage.set("ACCESS_TOKEN", res.access);
        await this.storage.set("ACCESS_REFRESH_TOKEN", res.refresh);
        const storedToken = await this.storage.get("ACCESS_TOKEN");
        console.log(storedToken);
        this.authSubject.next(true);
      })
    );
  }

  getAuthToken(): Observable<any> {
    return from(this.storage.get("ACCESS_TOKEN"));
  }

  async logout() {
    await this.storage.remove("ACCESS_TOKEN");
    this.authSubject.next(false);
  }

  isLoggedIn() {
    return this.authSubject.asObservable();
  }

  registerFCMToken(token): Observable<any> {
    let type = this.platform.toString();
    console.log(type);
    if(this.platform.is('android')) {
      type = 'android';
    }
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/registerFCMToken`, {'registration_id': token, type: type}).pipe(
      tap(async (res: any) => {
        console.log("response from registerToken server - ", res);
      })
    );
  }

}
