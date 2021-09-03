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
      }, {
        path: 'comissao',
        loadChildren: './comissao/comissao.module#ComissaoModule'
      }, {
        path: 'ordem-servico',
        loadChildren: './ordem-servico/ordem-servico.module#OrdemServicoModule'
      }, {
        path: 'cotacoes',
        loadChildren: './cotacoes/cotacoes.module#CotacoesModule'
      }, {
        path: 'pedidos',
        loadChildren: './pedido/pedido.module#PedidoModule'
      }, {
        path: 'credito',
        loadChildren: './credito/credito.module#CreditoModule'
      },
      {
        path: 'material',
        loadChildren: './material-component/material.module#MaterialComponentsModule'
      }, {
        path: 'financeiro',
        loadChildren: './financeiro/financeiro.module#FinanceiroModule'
      }, {
        path: 'homologacao',
        loadChildren: './homologacao/homologacao.module#HomologacaoModule'
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
    path: '**',
    redirectTo: 'authentication/404'
  },
  {
    path: 'login',
    redirectTo: './authentication/authentication.module#AuthenticationModule'
  }];
