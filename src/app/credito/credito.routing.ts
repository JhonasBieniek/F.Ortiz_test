import { Routes } from '@angular/router';

import { GerarComponent } from './gerar/gerar.component';
import { ListarComponent } from './listar/listar.component';
import { ConfigurarComponent} from './configurar/configurar.component'

export const CreditoRoutes: Routes = [
  { 
    path: '',
    children: [{
      path: 'listar', 
      component: ListarComponent
    },{
      path: 'gerar', 
      component: GerarComponent
    },
    {  
        path: 'configurar', 
        component: ConfigurarComponent
      }]
  }
];
