import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';

import { ListarComponent } from './listar/listar.component';
import { NovoComponent } from './pedido-listar/novo/novo.component';
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
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { DialogCadastroComponent } from './pedido-listar/novo/dialog-cadastro/dialog-cadastro.component';
import { MatDialogModule } from '@angular/material';
import { NgxMaskModule, IConfig} from 'ngx-mask';
import { DialogBodyClienteComponent } from '../cadastro/cliente/dialog-body/dialog-body-cliente.component';
import { DateFormatPipe } from '../shared/pipes/dateFormat.pipe';
import { NgxCurrencyModule } from 'ngx-currency';
import { ImportComponent } from './pedido-listar/import/import.component';
import { OrcamentoComponent } from './orc-listar/orcamento/orcamento.component';
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
import { ViewPedidoOrcamentoComponent } from './view-pedido/view-pedido.component';
import { DialogProdPedidoComponent } from './orc-listar/orcamento/dialog-prod-pedido/dialog-prod-pedido.component';
import { PedidosComponent } from './relatorios/pedidos/pedidos.component';
import { ProdutosVendidosComponent } from './relatorios/produtos-vendidos/produtos-vendidos.component';
import { ProdutosVendidosPorClientesComponent } from './relatorios/produtos-vendidos-por-clientes/produtos-vendidos-por-clientes.component';
import { RankingComponent } from './relatorios/ranking/ranking.component';
import { ClientesSemCompraComponent } from './relatorios/clientes-sem-compra/clientes-sem-compra.component';
import { ComparativoVendasComponent } from './relatorios/comparativo-vendas/comparativo-vendas.component';
import { ComparativoVendasClientesComponent } from './relatorios/comparativo-vendas-clientes/comparativo-vendas-clientes.component';
import { NotasComponent } from './relatorios/notas/notas.component';
import { ConsumoComponent } from './relatorios/consumo/consumo.component';
import { FaturamentoComponent } from './relatorios/faturamento/faturamento.component';
import { BaseComponent } from './relatorios/base/base.component'; 
import { ViewOrcamentoComponent } from './view-orcamento/view-orcamento.component';
import { DialogMailComponent } from './view-orcamento/dialog-mail/dialog-mail.component';
import { FileDragNDropDirective } from './pedido-listar/file-drag-n-drop.directive';
import { DialogPedidosPrintComponent } from './relatorios/pedidos/dialog-pedidos-print/dialog-pedidos-print.component';
import { DialogComparativoPrintComponent } from './relatorios/comparativo-vendas/dialog-comparativo-print/dialog-comparativo-print.component';
import { DialogConsumoPrintComponent } from './relatorios/consumo/dialog-consumo-print/dialog-consumo-print.component';
import { DialogNotasPrintComponent } from './relatorios/notas/dialog-notas-print/dialog-notas-print.component';


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
    ShoppingCartComponent, 
    DialogCadastroComponent, 
    ImportComponent, 
    OrcamentoComponent, 
    ConciliacaoComponent, 
    OrcListarComponent, 
    PedidoListarComponent, 
    DialogAddNotaComponent, 
    DialogSendNotaComponent, 
    DialogViewNotaComponent, 
    DialogEditNotaComponent, 
    DialogEstornarComponent, 
    DialogDevolucaoComponent, 
    ViewPedidoOrcamentoComponent,
    ViewOrcamentoComponent,
    DialogProdPedidoComponent, 
    PedidosComponent, 
    ProdutosVendidosComponent, 
    ProdutosVendidosPorClientesComponent, 
    RankingComponent, 
    ClientesSemCompraComponent, 
    ComparativoVendasComponent, 
    ComparativoVendasClientesComponent, 
    NotasComponent, 
    ConsumoComponent, 
    FaturamentoComponent, 
    BaseComponent, 
    DialogMailComponent,
    FileDragNDropDirective,
    DialogPedidosPrintComponent,
    DialogComparativoPrintComponent,
    DialogConsumoPrintComponent,
    DialogNotasPrintComponent
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
    DialogProdPedidoComponent,
    DialogAddNotaComponent, 
    DialogViewNotaComponent, 
    DialogSendNotaComponent, 
    DialogEditNotaComponent, 
    ImportComponent,
    NovoComponent, 
    OrcamentoComponent,
    DialogEstornarComponent, 
    DialogDevolucaoComponent,
    ViewPedidoOrcamentoComponent,
    ViewOrcamentoComponent,
    DialogMailComponent,
    DialogPedidosPrintComponent,
    DialogComparativoPrintComponent,
    DialogConsumoPrintComponent
  ],

})
export class PedidoModule { }
