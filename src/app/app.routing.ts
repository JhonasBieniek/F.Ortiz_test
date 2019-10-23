import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { AppBlankComponent } from './layouts/blank/blank.component';

import { AuthGuard } from './guards/auth.guard';

export const AppRoutes: Routes = [{
  path: '',
  component: FullComponent,
  canActivate: [AuthGuard],
  children: [{ 
    path: '', 
    redirectTo: '/dashboards', 
    pathMatch: 'full' 
  },{
    path: 'dashboards',
    loadChildren: './dashboards/dashboards.module#DashboardsModule'  
  }, {
    path: 'material',
    loadChildren: './material-component/material.module#MaterialComponentsModule',
  }, {
    path: 'apps',
    loadChildren: './apps/apps.module#AppsModule'
  },{
    path: 'cadastro',
    loadChildren: './cadastro/cadastro.module#CadastroModule'
  },{
    path: 'produto',
    loadChildren: './produto/produto.module#ProdutoModule'
  },{
    path: 'ordem-servico',
    loadChildren: './ordem-servico/ordem-servico.module#OrdemServicoModule'
  },{
    path: 'pedido',
    loadChildren: './pedido/pedido.module#PedidoModule'
  },{
    path: 'venda',
    loadChildren: './venda/venda.module#VendaModule'
  },{
    path: 'credito',
    loadChildren: './credito/credito.module#CreditoModule'
  }, {
    path: 'tables',
    loadChildren: './tables/tables.module#TablesModule'
  }, {
    path: 'datatables',
    loadChildren: './datatables/datatables.module#DataTablesModule'
  }, {
    path: 'pages',
    loadChildren: './pages/pages.module#PagesModule'
  },{
    path: 'widgets',
    loadChildren: './widgets/widgets.module#WidgetsModule'
  }, {
    path: 'charts',
    loadChildren: './charts/chartslib.module#ChartslibModule'
  }]
},{
  path: '',
  component: AppBlankComponent,
  children: [{
    path: 'authentication',
    loadChildren: './authentication/authentication.module#AuthenticationModule'
  }]
}, {
  path: '**',
  redirectTo: 'authentication/404' 
},
{ 
  path: 'login', 
  redirectTo: 'authentication/authentication.module#AuthenticationModule' 
}];
