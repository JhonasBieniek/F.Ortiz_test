import { Routes } from '@angular/router';
import { ConciliacaoComponent } from './conciliacao/conciliacao.component';
import { OrcListarComponent } from './orc-listar/orc-listar.component';
import { PedidoListarComponent } from './pedido-listar/pedido-listar.component';
import { BaseComponent } from './relatorios/base/base.component';


export const PedidoRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'pedidos',
      component: PedidoListarComponent
    },
    {
      path: 'conciliacao',
      component: ConciliacaoComponent
    },
    {
      path: 'cotacoes',
      component: OrcListarComponent
    },
    {
      path: 'relatorios',
      component: BaseComponent
    }]
  }
];
