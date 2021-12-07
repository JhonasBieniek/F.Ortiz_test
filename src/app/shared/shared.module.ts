import { NgModule } from '@angular/core';

import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';
import { SnackbarComponent } from './messages/snackbar/snackbar.component';
import { NotificationService } from './messages/notification.service';
import { ClientService } from './services/client.service.component';
import { OrderService } from './services/order.service.component';
import { GoogleService } from './services/google.service.component';
import { ImportService } from './services/import.service';
import { ExcelExportService } from './services/excel-export.service';

@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    SnackbarComponent
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    SnackbarComponent
  ],
  providers: [ 
    MenuItems,
    NotificationService,
    ClientService,
    OrderService,
    GoogleService,
    ImportService,
    ExcelExportService
  ]
})
export class SharedModule {}
