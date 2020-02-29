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
      path: 'pedido/listar',
      component: PedidoListarComponent
    }, 
    {
      path: 'pedido/novo',
      component: Novo2Component
    },
    {
      path: 'pedido/:id/edit',
      component: Novo2Component
    },
    {
      path: 'pedido/importar',
      component: Novo2Component
    },
    {
      path: 'orcamento/novo',
      component: OrcamentoComponent
    },
    {
      path: 'conciliacao',
      component: ConciliacaoComponent
    },
    {
      path: 'orcamento/listar',
      component: OrcListarComponent
    }]
  }
];
