import { Routes } from '@angular/router';

import { NovoComponent } from './novo/novo.component';
import { ListarComponent } from './listar/listar.component';
import { ConfigurarComponent} from './configurar/configurar.component'

export const VendaRoutes: Routes = [
  { 
    path: '',
    children: [{
      path: 'listar', 
      component: ListarComponent
    },{
      path: 'novo', 
      component: NovoComponent
    },
    {  
        path: 'configurar', 
        component: ConfigurarComponent
      }]
  }
];
