import { Routes } from '@angular/router';

import { CategoriaComponent } from './categoria/categoria.component';
import { NovoComponent } from './novo/novo.component';
import { EntradaComponent } from './entrada/entrada.component';
import { ListarComponent } from './listar/listar.component';
import { FilaImpressaoComponent } from './fila-impressao/fila-impressao.component';
import { AjusteEstoqueComponent } from './ajuste-estoque/ajuste-estoque.component';
import { TipoPrecoComponent } from './tipo-preco/tipo-preco.component';
import { ConfigurarComponent } from './configurar/configurar.component';


export const ProdutoRoutes: Routes = [
  { 
    path: '',
    children: [{
      path: 'categoria', 
      component: CategoriaComponent
    },{
      path: 'novo', 
      component: NovoComponent
    },{
      path: 'entrada', 
      component: EntradaComponent
    },{
      path: 'listar', 
      component: ListarComponent
    },{
      path: 'fila-impressao', 
      component: FilaImpressaoComponent
    },{
        path: 'ajuste-estoque', 
        component: AjusteEstoqueComponent
    },{
        path: 'tipo-preco', 
        component: TipoPrecoComponent
    },{
        path: 'configurar', 
        component: ConfigurarComponent
    }]
  }
];
