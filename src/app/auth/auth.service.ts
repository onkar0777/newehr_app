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
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private  httpClient:  HttpClient, private  storage:  Storage, private platform: Platform) {
    storage.get('currentUser').then((user) => {
      this.currentUserSubject = new BehaviorSubject<User>(user);
      this.currentUser = this.currentUserSubject.asObservable();
    })
   }

  register(user: User): Observable<any> {
    return this.httpClient.post<any>(`${this.AUTH_SERVER_ADDRESS}/register`, user).pipe(
      tap(async (res:  any ) => {

        if (user) {
          await this.storage.set("currentUser", user);
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  login(user: User): Observable<any> {
    console.log(user);
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/login`, user).pipe(
      tap(async (user: any) => {
        console.log("response from login server - ", user);
        user = JSON.parse(user);
        console.log("Updated user - ", user);
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          await this.storage.set('currentUser', user);
          const storedUser= await this.storage.get("currentUser");
          console.log(storedUser);
          this.currentUserSubject.next(user);
      }
      return user;
      })
    );
  }

  async logout() {
    await this.storage.remove("currentUser");
    this.currentUserSubject.next(null);
  }

  public set currentUserValue(user) {
    this.currentUserSubject = new BehaviorSubject<User>(user);
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
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
