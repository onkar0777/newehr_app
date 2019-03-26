import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { AuthService } from '../auth.service';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private  authService:  AuthService, private  router:  Router, private fcm: FCM) { }

  ngOnInit() {
  }

  login(form){
    this.authService.login(form.value).subscribe((res)=>{
      this.fcm.getToken().then(token => {
        console.log("Received fcm token - ", token);
        this.authService.registerToken(token).subscribe(() => {
          console.log("Registered the fcm token");
          this.router.navigateByUrl('home');
        });
      });
    });
  }

}
