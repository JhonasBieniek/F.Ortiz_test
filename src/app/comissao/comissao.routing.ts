import { Routes } from '@angular/router';
import { ReceberComponent } from './receber/receber.component';

export const ComissaoRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'receber',
      component: ReceberComponent
    }, 
    ]
  }
];
