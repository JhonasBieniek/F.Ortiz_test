import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { AppBlankComponent } from './layouts/blank/blank.component';

import { AuthGuard } from './guards/auth.guard';


export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboards',
        pathMatch: 'full'
      },
      {
        path: 'dashboards',
        loadChildren: './dashboards/dashboards.module#DashboardsModule'
      },
      {
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
        path: 'credito',
        loadChildren: './credito/credito.module#CreditoModule'
      },
      {
        path: 'material',
        loadChildren:
          './material-component/material.module#MaterialComponentsModule'
      },
      {
        path: 'apps',
        loadChildren: './apps/apps.module#AppsModule'
      },
      {
        path: 'forms',
        loadChildren: './forms/forms.module#FormModule'
      },
      {
        path: 'tables',
        loadChildren: './tables/tables.module#TablesModule'
      },
      {
        path: 'datatables',
        loadChildren: './datatables/datatables.module#DataTablesModule'
      },
      {
        path: 'pages',
        loadChildren: './pages/pages.module#PagesModule'
      },
      {
        path: 'widgets',
        loadChildren: './widgets/widgets.module#WidgetsModule'
      },
      {
        path: 'charts',
        loadChildren: './charts/chartslib.module#ChartslibModule'
      },
      {
        path: 'multi',
        loadChildren: './multi-dropdown/multi-dd.module#MultiModule'
      }
    ]
  },
  {
    path: '',
    component: AppBlankComponent,
    children: [
      {
        path: 'glogin',
        loadChildren: './glogin/glogin.module#GloginModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'authentication/404'
  },
  { 
    path: 'glogin', 
    redirectTo: './glogin/glogin.module#GloginModule' 
  }];
