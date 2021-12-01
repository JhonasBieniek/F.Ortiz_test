import { Routes } from '@angular/router';
import { ContasComponent } from './contas/contas.component';
import { PagamentosLoteComponent } from './pagamentos-lote/pagamentos-lote.component';


export const FinanceiroRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pagamentosLote',
        component: PagamentosLoteComponent
      },
      {
        path: 'contas',
        component: ContasComponent
      }
    ]
  }
];
