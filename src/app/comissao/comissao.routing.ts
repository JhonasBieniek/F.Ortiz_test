import { Routes } from '@angular/router';
import { ReceberComponent } from './receber/receber.component';
import { RepassesComponent } from './repasses/repasses.component';

export const ComissaoRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'receber',
      component: ReceberComponent
    },{
      path: 'repasses',
      component: RepassesComponent
    }, 
    ]
  }
];
