import { Routes } from '@angular/router';

import { FullcalendarComponent } from './fullcalendar/fullcalendar.component';
import { MailComponent } from './mail/mail.component';
import { ChatComponent } from './chat/chat.component';
import { TaskboardComponent } from './taskboard/taskboard.component';
import { TicketlistComponent } from './ticketlist/ticketlist.component';
import { TicketdetailsComponent } from './ticketdetails/ticketdetails.component';
import { ContactComponent } from './contact/contact.component';
export const AppsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'calendar',
        component: FullcalendarComponent,
		data: {
          title: 'Calendar',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Calendar' }
          ]
        }
      },
      {
        path: 'messages',
        component: MailComponent,
		data: {
          title: 'Email',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Email' }
          ]
        }
      },
      {
        path: 'chat',
        component: ChatComponent,
		data: {
          title: 'Chat',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Chat' }
          ]
        }
      },
      {
        path: 'taskboard',
        component: TaskboardComponent,
		    data: {
          title: 'Taskboard',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Taskboard' }
          ]
        }
      },
      {
        path: 'ticketlist',
        component: TicketlistComponent,
        data: {
          title: 'Ticket List',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Ticket List' }
          ]
        }
      },
      {
        path: 'ticketdetails',
        component: TicketdetailsComponent,
        data: {
          title: 'Ticket Details',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Ticket Details' }
          ]
        }
      },
      {
        path: 'contact',
        component: ContactComponent,
        data: {
          title: 'Contact',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Contact' }
          ]
        }
      }
    ]
  }
];
