import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarComponent } from './listar/listar.component';
import { NovoComponent } from './novo/novo.component';
import { PedidoRoutes } from './pedido.routing';
import { RouterModule } from '@angular/router';

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
import { DialogClienteAddComponent } from './novo/dialog-body/dialog-body-cliente.component';
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
    NgxSpinnerModule
  ],
  declarations: [ListarComponent, NovoComponent, ItensPedidoComponent, ShoppingCartComponent, DialogCadastroComponent, DialogClienteAddComponent, Novo2Component, OrcamentoComponent, ConciliacaoComponent, OrcListarComponent, PedidoListarComponent, DialogAddNotaComponent, DialogSendNotaComponent],
  providers: [
    DateFormatPipe,    
  ],
  entryComponents: [ DialogCadastroComponent, DialogClienteAddComponent, DialogAddNotaComponent, DialogSendNotaComponent],

})
export class PedidoModule { }
