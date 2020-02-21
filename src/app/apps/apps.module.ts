import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { QuillModule } from 'ngx-quill';
import { CalendarModule, DateAdapter, CalendarDateFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DragulaModule } from 'ng2-dragula';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AppsRoutes } from './apps.routing';
import { FullcalendarComponent } from './fullcalendar/fullcalendar.component';
import {
  MailComponent,
  DialogDataExampleDialogComponent
} from './mail/mail.component';
import { ChatComponent } from './chat/chat.component';
import { DialogContent } from './contact/contact.component';
import { TicketDialogContent } from './ticketlist/ticketlist.component';

import { TicketlistComponent } from './ticketlist/ticketlist.component';
import { TicketdetailsComponent } from './ticketdetails/ticketdetails.component';
import { ContactComponent } from './contact/contact.component';
import { CalendarDialogComponent } from './fullcalendar/fullcalendar.component';
import { TaskboardComponent } from './taskboard/taskboard.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AppsRoutes),
    DemoMaterialModule,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    FlexLayoutModule,
    QuillModule.forRoot(),
    DragulaModule.forRoot(),
    PerfectScrollbarModule,
    Ng2SearchPipeModule
  ],
  declarations: [
    FullcalendarComponent,
    MailComponent,
    DialogDataExampleDialogComponent,
    ChatComponent,
    CalendarDialogComponent,
    TaskboardComponent,
    TicketlistComponent,
    TicketdetailsComponent,
    ContactComponent,
    DialogContent,
    TicketDialogContent
  ],
  entryComponents: [CalendarDialogComponent, DialogDataExampleDialogComponent, DialogContent, TicketDialogContent]
})
export class AppsModule {}
