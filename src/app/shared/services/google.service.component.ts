// import {Injectable, NgZone} from "@angular/core";
// import * as _ from "lodash";
// import {GoogleAuthService} from "ng-gapi/lib/GoogleAuthService";
// import GoogleUser = gapi.auth2.GoogleUser;
// import GoogleAuth = gapi.auth2.GoogleAuth;
// import { Router } from '@angular/router';
// import { Observable } from "rxjs";

// @Injectable()
// export class GoogleService{
//     public static readonly SESSION_STORAGE_KEY: string = "accessToken";
//     private user: GoogleUser = undefined;

//     constructor(
//         private googleAuthService: GoogleAuthService,
//         private ngZone: NgZone,
//         private router: Router
//         ) {}

// }



// import { Component, OnInit, Inject } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";


// @Component({
//   selector: 'app-dialog-confirmar-email',
//   templateUrl: './dialog-confirmar-email.component.html',
//   styleUrls: ['./dialog-confirmar-email.component.css']
// })
// export class DialogConfirmarEmail implements OnInit {

//   constructor(public dialogRef: MatDialogRef<DialogConfirmarEmail>, 
//                                 @Inject(MAT_DIALOG_DATA) public data: any,
//                                 )
//     {}

//   initClient(){
//     gapi.load('client', () => {
//         console.log('loaded client')          
//         gapi.client.init({
//             apiKey: 'AIzaSyBQu_6CDuExZymyNKT2G8v_q6zF2U1TYxg',
//             clientId: '193796461952-6ui364glmacfadkg5c3nmrm1d68l7a1j.apps.googleusercontent.com',
//             discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
//             scope: 'https://mail.google.com/ \
//                     https://www.googleapis.com/auth/gmail.modify \
//                     https://www.googleapis.com/auth/gmail.compose \
//                     https://www.googleapis.com/auth/gmail.send'

//         });
//         gapi.client.load('gmail', 'v1', () => console.log('loaded calendar'))
//       }); 
//     }


//   enviar(){
//     gapi.auth.setToken({ access_token: localStorage.getItem('TOKEN_NAME')})


//     const message = document.getElementById("teste").innerHTML;

//     var teste2 = 
//     "From: 'me'\r\n" +
//     "To: " + 'Diogenes <berssa.net@gmail.com>' + "\r\n" +
//     "Subject: " + 'VAGABUNDOOOOOO !!!' + "\r\n" +
//     "Content-Type: text/html; charset='UTF-8'\r\n" +
//     "Content-Transfer-Encoding: base64\r\n\r\n" +
//     "<html><body>" +
//     message +
//     "</body></html>";

//     var request = gapi.client.gmail.users.messages.send({
//       'userId': 'me',
//       'resource': {
//         'raw': window.btoa(teste2).replace(/\+/g, '-').replace(/\//g, '_')
//       }
//     });
//     request.execute((res:any) => {
//       if(res.labelIds[0] == "SENT" || res.labelIds[1] == "SENT"){
//         this.data.forEach((element:any) => {
//           this.firebaseService.updateOrdens(element.uid, 'enviada').then(res =>{
//             console.log(element.uid+' - Enviado');
//           })
//         })
//           this.dialogRef.close(true);
//       }
//     });
//   }


// }