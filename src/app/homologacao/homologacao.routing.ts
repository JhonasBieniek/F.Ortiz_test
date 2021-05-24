import { Routes } from '@angular/router';
import { NovoComponent } from './novo/novo.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';


export const HomologacaoRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'homologacoes',
      component: NovoComponent
    },
    {
      path: 'relatorios',
      component: RelatoriosComponent
    }]
  }
];
