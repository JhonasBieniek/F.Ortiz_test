import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatCardModule, MatInputModule, MatCheckboxModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AuthenticationRoutes } from './authentication.routing';
import { ErrorComponent } from './error/error.component';
import { ForgotComponent } from './forgot/forgot.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginService } from './login/login.service';

import {
  GoogleApiModule, 
  GoogleApiService, 
  GoogleAuthService, 
  NgGapiClientConfig, 
  NG_GAPI_CONFIG,
  GoogleApiConfig
} from "ng-gapi";

let gapiClientConfig: NgGapiClientConfig = {
  client_id: "1078742420525-80sm10jeu87n9bd445bkjaeusdroofer.apps.googleusercontent.com",
  discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
  scope: [
    "https://mail.google.com/",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.compose",
    "https://www.googleapis.com/auth/gmail.send"
  ].join(" ")
};


@NgModule({
  imports: [ 
    CommonModule,
    RouterModule.forChild(AuthenticationRoutes),
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    }),
  ],
  providers:[
    LoginService
  ],
  declarations: [
    ErrorComponent,
    ForgotComponent,
    LockscreenComponent,
    LoginComponent,
    RegisterComponent
  ]
})

export class AuthenticationModule {}
