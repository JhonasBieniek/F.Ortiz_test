import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DemoMaterialModule} from '../demo-material-module';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DateFormatPipe } from '../shared/pipes/dateFormat.pipe';
import { ComissaoRoutes } from './comissao.routing';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { RouterModule } from '@angular/router';
import { RecebimentosComponent } from './recebimentos/recebimentos.component';
import { NgxMaskModule, IConfig} from 'ngx-mask';
import { NgxCurrencyModule } from 'ngx-currency';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ImportarComponent } from './importar/importar.component';
import { DialogRelatorioPrintComponent } from './dialog-relatorio-print/dialog-relatorio-print.component';
import { RecebidosComponent } from './recebidos/recebidos.component';
import { DialogAcumuladoComissoesPrintComponent } from './relatorios/dialog-acumulado-comissoes-print/dialog-acumulado-comissoes-print.component';


export const options: Partial<IConfig> | (() => Partial<IConfig>)=null;
export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 5,
  prefix: "R$ ",
  suffix: "",
  thousands: ".",
  nullable: true
};


@NgModule({
  declarations: [
    RelatoriosComponent, 
    RecebimentosComponent, 
    ImportarComponent, DialogRelatorioPrintComponent, RecebidosComponent, DialogAcumuladoComissoesPrintComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ComissaoRoutes),
    NgxDatatableModule,
    DemoMaterialModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxMaskModule.forRoot(options),
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),

  ],
  entryComponents: [ 
    DialogAcumuladoComissoesPrintComponent
  ],
  providers: [
    DateFormatPipe,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class ComissaoModule { }
