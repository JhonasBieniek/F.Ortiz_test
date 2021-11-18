import { Routes } from '@angular/router';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { RecebimentosComponent } from './recebimentos/recebimentos.component';
import { ImportarComponent } from './importar/importar.component';
import { RecebidosComponent } from './recebidos/recebidos.component';

export const ComissaoRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'relatorios/acumulado',
      component: RelatoriosComponent
    },{
      path: 'relatorios/comissoes',
      component: RelatoriosComponent
    },{
      path: 'relatorios/recebimento',
      component: RelatoriosComponent
    },{
      path: 'relatorios/devolucoes',
      component: RelatoriosComponent
    },{
      path: 'relatorios/estorno',
      component: RelatoriosComponent
    },{
      path: 'recebimentos',
      component: RecebimentosComponent
    },{
      path: 'importar',
      component: ImportarComponent
    }, 
    {
      path: 'recebidos',
      component: RecebidosComponent
    }
    ]
  }
];
