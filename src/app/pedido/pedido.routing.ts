import { Routes } from '@angular/router';

import { ListarComponent } from './listar/listar.component';
import { NovoComponent } from './novo/novo.component';
import { Novo2Component } from './novo2/novo2.component';
import { OrcamentoComponent } from './orcamento/orcamento.component';
import { ConciliacaoComponent } from './conciliacao/conciliacao.component';
import { OrcListarComponent } from './orc-listar/orc-listar.component';
import { PedidoListarComponent } from './pedido-listar/pedido-listar.component';


export const PedidoRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'listar',
      component: ListarComponent
    }, 
    {
      path: 'novo',
      component: Novo2Component
    },
    {
      path: 'importar',
      component: Novo2Component
    },
    {
      path: 'orcamento',
      component: OrcamentoComponent
    },
    {
      path: 'conciliacao',
      component: ConciliacaoComponent
    },{
      path: 'listar-pedido',
      component: PedidoListarComponent
    },
    {
      path: 'listar-orcamento',
      component: OrcListarComponent
    }]
  }
];
