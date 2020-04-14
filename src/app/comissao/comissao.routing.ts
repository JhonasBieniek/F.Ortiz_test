import { Routes } from '@angular/router';
import { ReceberComponent } from './receber/receber.component';
import { RepassesComponent } from './repasses/repasses.component';
import { RecebimentosComponent } from './recebimentos/recebimentos.component';
import { ImportarComponent } from './importar/importar.component';

export const ComissaoRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'listagem/receber',
      component: ReceberComponent
    },{
      path: 'listagem/repasses',
      component: RepassesComponent
    },{
      path: 'listagem/recebidos',
      component: RepassesComponent
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
