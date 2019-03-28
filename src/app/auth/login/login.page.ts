import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { AuthService } from '../auth.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private  authService:  AuthService, private  router:  Router, private fcm: FCM, private platform: Platform) { }

  ngOnInit() {
  }

  login(form){
    this.authService.login(form.value).subscribe((res)=>{
      if(this.platform.is('cordova')) {
        this.fcm.getToken().then(token => {
          console.log("Received fcm token - ", token);
          this.authService.registerFCMToken(token).subscribe(() => {
            console.log("Registered the fcm token");
            this.router.navigateByUrl('home');
          });
        });
      } else {
        console.log("On browser");
        console.log(this.platform);
        console.log(this.platform.toString());
        this.router.navigateByUrl('home');
      }
    });
  }

}
