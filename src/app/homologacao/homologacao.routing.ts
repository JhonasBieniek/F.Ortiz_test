import { Routes } from '@angular/router';
import { NovoComponent } from './novo/novo.component';


export const HomologacaoRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'novo',
      component: NovoComponent
    }]
  }
];