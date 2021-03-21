import { Routes } from '@angular/router';
import { OrcListarComponent } from '../pedido/orc-listar/orc-listar.component';

export const CotacoesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'listar',
        component: OrcListarComponent,
		data: {
          title: 'Basic Table',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Basic Table' }
          ]
        }
      },
    ]
  }
];
