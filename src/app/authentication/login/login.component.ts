import { Component, OnInit } from '@angular/core';
import {LoginService} from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private loginService: LoginService,) {
      
    }
    signIn(): void {
      this.loginService.signIn();
    };
    ngOnInit() {
      //this.loginService.loadAuth2();
    }
  }
