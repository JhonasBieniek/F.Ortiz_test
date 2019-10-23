import { Routes } from '@angular/router';

import { NovoComponent } from './novo/novo.component';
import { ListarComponent } from './listar/listar.component';

export const OrdemServicoRoutes: Routes = [
  { 
    path: '',
    children: [{
      path: 'listar', 
      component: ListarComponent
    },{
      path: 'novo', 
      component: NovoComponent
    }]
  }
];
