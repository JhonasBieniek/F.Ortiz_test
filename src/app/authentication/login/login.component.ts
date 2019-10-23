import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import {LoginService} from './login.service'
import {NotificationService} from '../../shared/messages/notification.service'

import {User} from '../user.model'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  returnUrl: string;

  public form: FormGroup;
  constructor(
              private fb: FormBuilder, 
              private route: ActivatedRoute,
              private loginService: LoginService, 
              private router: Router, 
              private notificationService: NotificationService) {}

  ngOnInit() {

      // reset login status
      this.loginService.logout();

      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  

    this.form = this.fb.group ( {
      email: this.fb.control('', [Validators.required , Validators.email]) , 
      password: this.fb.control('',[ Validators.required ]),
    } );
  }

  
 
onSubmit() {
  this.loginService.login(
    this.form.value.email,
    this.form.value.password)
    .subscribe(user => 
    this.notificationService.notify(`Bem vindo, ${user.data.usuario.funcionario.nome}`),
  response => 
    this.notificationService.notify('Login ou senha inválido!')
    )   
    setTimeout(()=>{ this.router.navigate ( [ '/dashboards' ] ) }, 1000);
   }
}
