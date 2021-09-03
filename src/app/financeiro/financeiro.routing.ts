import { Routes } from '@angular/router';
import { PagamentosLoteComponent } from './pagamentos-lote/pagamentos-lote.component';


export const FinanceiroRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pagamentosLote',
        component: PagamentosLoteComponent
      }
    ]
  }
];
