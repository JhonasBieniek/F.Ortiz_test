import { Routes } from '@angular/router';
import { ReceberComponent } from './receber/receber.component';
import { RecebimentosComponent } from './recebimentos/recebimentos.component';
import { ImportarComponent } from './importar/importar.component';

export const ComissaoRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'relatorios/acumulado',
      component: ReceberComponent
    },{
      path: 'relatorios/comissoes',
      component: ReceberComponent
    },{
      path: 'relatorios/recebimento',
      component: ReceberComponent
    },{
      path: 'relatorios/devolucoes',
      component: ReceberComponent
    },{
      path: 'relatorios/estorno',
      component: ReceberComponent
    },{
      path: 'recebimentos',
      component: RecebimentosComponent
    },{
      path: 'importar',
      component: ImportarComponent
    }, 
    ]
  }
];
