import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardsRoutes } from './dashboards.routing';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';

import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CadastroModule } from '../cadastro/cadastro.module';
import { DashProdutosIndisponiveisComponent } from './dashboard2/dash-produtos-indisponiveis/dash-produtos-indisponiveis.component';
import { PedidoModule } from '../pedido/pedido.module';
import { ViewPedidoOrcamentoComponent } from '../pedido/view-pedido/view-pedido.component';
@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    RouterModule.forChild(DashboardsRoutes),
    NgxMaskModule.forRoot(),
    NgxDatatableModule,
  ],
  declarations: [Dashboard1Component, Dashboard2Component, DashProdutosIndisponiveisComponent],
})
export class DashboardsModule {}
