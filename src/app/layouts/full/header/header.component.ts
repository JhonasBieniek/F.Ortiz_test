import { Component } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { LoginService } from '../../../authentication/login/login.service';
import { Session } from 'autobahn';

declare const ab: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {
  public config: PerfectScrollbarConfigInterface = {};
  currentUser: any;

  // This is for Notifications
  public notifications: Object[] = [
    {
      round: 'round-danger',
      icon: 'ti-link',
      title: 'Launch Admin',
      subject: 'Just see the my new admin!',
      time: '9:30 AM'
    }
  ];

  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM'
    },
    {
      useravatar: 'assets/images/users/4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  constructor(
    private loginService: LoginService,
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.startSocket()
  }

  startSocket(){
    this.notifications
    var conn = new ab.Session('ws://test2.fortiz.com.br:8080',
          function() {
              conn.subscribe('kittensCategory', function(topic, data) {
                console.log(data)
                console.log('New article published to category "' + topic + '" : ' + data.title);
                return data;
                
                // this.notifications.push({
                //   round: 'round-danger',
                //   icon: 'ti-calendar',
                //   title: data.title,
                //   subject: data.category,
                //   time: '9:30 AM'
                // })
                  // This is where you would add the new article to the DOM (beyond the scope of this tutorial)

              });
          },
          function() {
            console.warn(conn)
              console.warn('WebSocket connection closed');
          },
          {'skipSubprotocolCheck': true}
      );
      console.log(conn)
  }

  public signOut(): void {
    this.loginService.signOut()
  }
}
