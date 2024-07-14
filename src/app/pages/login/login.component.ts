declare var google: any;
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string | null = null;
  activationLinkInvalid: boolean = false;
  
  constructor (private route: ActivatedRoute, private router: Router, private http: HttpClient) { }
  

  ngOnInit (): void {
    this.djangoLogin()
    
   // this.googleSignIn()
  }


  private decodeToken (token: string) {
    console.log('token', token);
    return JSON.parse(atob(token.split('.')[1]));
  }

  djangoLogin() {
    
  }


  // handleGoogleLogin (response: any) {
  //   if (response) {
  //     //decode the token
  //     const payLoad = this.decodeToken(response.credential);
  //     //store in session
  //     sessionStorage.setItem('loggedInUser', JSON.stringify(payLoad));
  //     //navigate to home
  //     this.router.navigate(['browse']);
  //   }
  //   console.log('response', response);
  // }


  // googleSignIn () {
  //   google.accounts.id.initialize({
  //     client_id: '711458419890-nqvcm6k1seh5hbm1anbc2t0om2cjblp6.apps.googleusercontent.com',
  //     callback: (resp: any) => this.handleGoogleLogin(resp)
  //   });

  //   google.accounts.id.renderButton(document.getElementById('google-btn'),
  //     {
  //       theme: 'filled_blue',
  //       size: 'large',
  //       shape: 'rectangle',
  //     });
  // }

}
