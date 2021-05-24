import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomologacaoRoutes } from './homologacao.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DemoMaterialModule } from '../demo-material-module';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NovoComponent } from './novo/novo.component';
import { DialogBodyComponent } from './novo/dialog-body/dialog-body.component';
import { NgxMaskModule } from 'ngx-mask';
import { DateFormatPipe } from '../shared/pipes/dateFormat.pipe';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { DialogRelatoriosPrintComponent } from './relatorios/dialog-relatorios-print/dialog-relatorios-print.component';



@NgModule({
  declarations: [NovoComponent, DialogBodyComponent, RelatoriosComponent, DialogRelatoriosPrintComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(HomologacaoRoutes),
    NgxDatatableModule,
    DemoMaterialModule,
    CdkTableModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    ReactiveFormsModule,
    FlexLayoutModule,
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
  ],
  entryComponents: [ DialogBodyComponent, DialogRelatoriosPrintComponent]
})
export class HomologacaoModule { }
