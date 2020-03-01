import { Routes } from '@angular/router';
import { ReceberComponent } from './receber/receber.component';
import { RepassesComponent } from './repasses/repasses.component';
import { RecebimentosComponent } from './recebimentos/recebimentos.component';

export const ComissaoRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'receber',
      component: ReceberComponent
    },{
      path: 'repasses',
      component: RepassesComponent
    },{
      path: 'recebidos',
      component: RepassesComponent
    },{
      path: 'recebimentos',
      component: RecebimentosComponent
    }, 
    ]
  }
];
