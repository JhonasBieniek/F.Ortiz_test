import { Routes } from '@angular/router';

import { ListarComponent } from './listar/listar.component';
import { NovoComponent } from './novo/novo.component';
import { Novo2Component } from './novo2/novo2.component';
import { OrcamentoComponent } from './orcamento/orcamento.component';
import { ConciliacaoComponent } from './conciliacao/conciliacao.component';
import { OrcListarComponent } from './orc-listar/orc-listar.component';
import { PedidoListarComponent } from './pedido-listar/pedido-listar.component';
import { PedidosComponent } from './relatorios/pedidos/pedidos.component';
import { ProdutosVendidosComponent } from './relatorios/produtos-vendidos/produtos-vendidos.component';
import { ProdutosVendidosPorClientesComponent } from './relatorios/produtos-vendidos-por-clientes/produtos-vendidos-por-clientes.component';
import { RankingComponent } from './relatorios/ranking/ranking.component';
import { Component } from '@angular/core';
import { ClientesSemCompraComponent } from './relatorios/clientes-sem-compra/clientes-sem-compra.component';
import { ComparativoVendasComponent } from './relatorios/comparativo-vendas/comparativo-vendas.component';
import { ComparativoVendasClientesComponent } from './relatorios/comparativo-vendas-clientes/comparativo-vendas-clientes.component';
import { NotasComponent } from './relatorios/notas/notas.component';
import { ConsumoComponent } from './relatorios/consumo/consumo.component';
import { FaturamentoComponent } from './relatorios/faturamento/faturamento.component';


export const PedidoRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'pedidos',
      component: PedidoListarComponent
    },
    {
      path: 'conciliacao',
      component: ConciliacaoComponent
    },
    {
      path: 'orcamentos',
      component: OrcListarComponent
    },
    {
      path: 'rel-pedidos',
      component: PedidosComponent
    },
    {
      path: 'produtos-vendidos',
      component: ProdutosVendidosComponent
    },
    {
      path: 'produtos-vendidos-por-clientes',
      component: ProdutosVendidosPorClientesComponent
    },
    {
      path: 'ranking',
      component: RankingComponent
    },
    {
      path: 'clientes-sem-compra',
      component: ClientesSemCompraComponent
    },
    {
      path: 'comparativo-vendas',
      component: ComparativoVendasComponent
    },
    {
      path: 'comparativo-vendas-clientes',
      component: ComparativoVendasClientesComponent
    },
    {
      path: 'notas',
      component: NotasComponent
    },
    {
      path: 'consumo',
      component: ConsumoComponent
    },
    {
      path: 'faturamento',
      component: FaturamentoComponent
    }]
  }
];
