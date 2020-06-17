import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';

import { ListarComponent } from './listar/listar.component';
import { NovoComponent } from './novo/novo.component';
import { PedidoRoutes } from './pedido.routing';
import { RouterModule } from '@angular/router';

import { CadastroModule } from '../cadastro/cadastro.module';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DemoMaterialModule} from '../demo-material-module';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { QuillModule } from 'ngx-quill';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { ItensPedidoComponent } from './itens-pedido/itens-pedido.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { DialogCadastroComponent } from './novo/dialog-cadastro/dialog-cadastro.component';
import { MatDialogModule } from '@angular/material';
import { NgxMaskModule, IConfig} from 'ngx-mask';
import { DialogBodyClienteComponent } from '../cadastro/cliente/dialog-body/dialog-body-cliente.component';
import { DateFormatPipe } from '../shared/pipes/dateFormat.pipe';
import { NgxCurrencyModule } from 'ngx-currency';
import { Novo2Component } from './novo2/novo2.component';
import { OrcamentoComponent } from './orcamento/orcamento.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { ConciliacaoComponent } from './conciliacao/conciliacao.component';
import { OrcListarComponent } from './orc-listar/orc-listar.component';
import { PedidoListarComponent } from './pedido-listar/pedido-listar.component';
import { DialogAddNotaComponent } from './conciliacao/dialog-add-nota/dialog-add-nota.component';
import { DialogSendNotaComponent } from './conciliacao/dialog-add-nota/dialog-send-nota/dialog-send-nota.component';
import { DialogViewNotaComponent } from './conciliacao/dialog-view-nota/dialog-view-nota.component';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DialogEditNotaComponent } from './conciliacao/dialog-edit-nota/dialog-edit-nota.component';
import { DialogEstornarComponent } from './conciliacao/dialog-view-nota/dialog-estornar/dialog-estornar.component';
import { DialogDevolucaoComponent } from './conciliacao/dialog-view-nota/dialog-devolucao/dialog-devolucao.component'; 


export const options: Partial<IConfig> | (() => Partial<IConfig>)=null;

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PedidoRoutes),
    NgxMaskModule.forRoot(options),
    DemoMaterialModule,
    NgxDatatableModule,
    CdkTableModule,
    FormsModule, ReactiveFormsModule,
    FlexLayoutModule,
    QuillModule,
    FileUploadModule,
    MatDialogModule,
    NgxCurrencyModule,
    NgxMaskModule.forRoot(),
    NgxSpinnerModule,
    CadastroModule
  ],
  declarations: [
    ListarComponent, 
    NovoComponent, 
    ItensPedidoComponent, 
    ShoppingCartComponent, 
    DialogCadastroComponent, 
    Novo2Component, 
    OrcamentoComponent, 
    ConciliacaoComponent, 
    OrcListarComponent, 
    PedidoListarComponent, 
    DialogAddNotaComponent, 
    DialogSendNotaComponent, 
    DialogViewNotaComponent, 
    DialogEditNotaComponent, DialogEstornarComponent, DialogDevolucaoComponent
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
  entryComponents: [ 
    DialogCadastroComponent, 
    DialogBodyClienteComponent, 
    DialogAddNotaComponent, 
    DialogViewNotaComponent, 
    DialogSendNotaComponent, 
    DialogEditNotaComponent, 
    Novo2Component, 
    OrcamentoComponent,
    DialogEstornarComponent, 
    DialogDevolucaoComponent
  ],

})
export class PedidoModule { }
