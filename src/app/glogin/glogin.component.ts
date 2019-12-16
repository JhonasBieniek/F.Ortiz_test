import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from 'ng-gapi';
import { UserService } from '../shared/services/user.service.component';
import { GoogleApiService } from 'ng-gapi';
import { Router, ActivatedRoute } from '@angular/router';
import {NotificationService} from '../shared/messages/notification.service'

@Component({
  selector: 'glogin',
  templateUrl: './glogin.component.html',
})
export class GloginComponent implements OnInit {
  public sheetId: string;
  public sheet: any;
  public foundSheet: any;

  constructor(private userService: UserService,
              //private sheetResource: SheetResource,
              private router: Router, 
              private route: ActivatedRoute,
              private authService: GoogleAuthService,
              private notificationService: NotificationService,
              private gapiService: GoogleApiService) {
     // First make sure gapi is loaded can be in AppInitilizer
      this.gapiService.onLoad().subscribe();
  }

  ngOnInit() {
        this.route.fragment.subscribe((fragment) => {
        console.log(fragment)
    })
  }

  public isLoggedIn() {
    return this.userService.isUserSignedIn();
  }

  public signIn() {
    this.userService.signIn()
  }

  public signOut() {
    this.userService.signOut();
  }
}
