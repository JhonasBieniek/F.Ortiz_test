import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagamentosLoteComponent } from './pagamentos-lote/pagamentos-lote.component';
import { RouterModule } from '@angular/router';
import { FinanceiroRoutes } from './financeiro.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DemoMaterialModule } from '../demo-material-module';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DateFormatPipe } from '../shared/pipes/dateFormat.pipe';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ContasComponent } from './contas/contas.component';
import { DialogIncluirComponent } from './contas/dialog-incluir/dialog-incluir.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { DialogAlterarComponent } from './contas/dialog-alterar/dialog-alterar.component';
import { DialogConfirmarDeleteContasComponent } from './contas/dialog-confirmar-delete-contas/dialog-confirmar-delete-contas.component';
import { DialogContasImprimirComponent } from './contas/dialog-contas-imprimir/dialog-contas-imprimir.component';

@NgModule({
  declarations: [PagamentosLoteComponent, ContasComponent, DialogIncluirComponent, DialogAlterarComponent, DialogConfirmarDeleteContasComponent, DialogContasImprimirComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(FinanceiroRoutes),
    NgxDatatableModule,
    DemoMaterialModule,
    //CdkTableModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxCurrencyModule,
  ],
  entryComponents: [
    DialogIncluirComponent,
    DialogAlterarComponent,
    DialogConfirmarDeleteContasComponent,
    DialogContasImprimirComponent
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
})
export class FinanceiroModule { }
