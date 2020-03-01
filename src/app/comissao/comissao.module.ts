import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DemoMaterialModule} from '../demo-material-module';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { DateFormatPipe } from '../shared/pipes/dateFormat.pipe';


import { ComissaoRoutes } from './comissao.routing';
import { ReceberComponent } from './receber/receber.component';
import { RouterModule } from '@angular/router';
import { RepassesComponent } from './repasses/repasses.component';
import { RecebimentosComponent } from './recebimentos/recebimentos.component';


@NgModule({
  declarations: [ReceberComponent, RepassesComponent, RecebimentosComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ComissaoRoutes),
    NgxDatatableModule,
    DemoMaterialModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  providers: [
    DateFormatPipe,    
  ],
})
export class ComissaoModule { }
