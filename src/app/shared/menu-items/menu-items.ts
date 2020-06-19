import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}
export interface Saperator {
  name: string;
  type?: string;
}
export interface SubChildren {
  state: string;
  name: string;
  type?: string;
}
export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
  child?: SubChildren[];
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  saperator?: Saperator[];
  children?: ChildrenItems[];
}

const MENUITEMS = [
  { state: '',
    name: 'Painel de Controle',
    type: 'saperator',
    icon: 'av_timer'  
  },
  {
    state: 'dashboards',
    name: 'Dashboard',
    type: 'link',
    icon: 'av_timer',
    
  },{
    state: 'cadastro',
    name: 'Cadastro',
    type: 'sub',
    icon: 'person',
    children: [
      {state: 'areavenda', name: 'Áreas de Vendas', type: 'link' },
      {state: 'cargos', name: 'Cargos', type: 'link' },
      {state: 'cliente', name: 'Clientes', type: 'link'},
      {state: 'condicoescomerciais', name: 'Condições Comerciais', type: 'link' },
      {state: 'funcionario', name: 'Funcionários', type: 'link' },
      {state: 'grupos', name: 'Grupos', type: 'link' },
      {state: 'produtos', name: 'Produtos', type: 'link' },
      {state: 'ramo-atividade', name: 'Ramo de Atividade', type: 'link' },
      {state: 'regioes', name: 'Regiões', type: 'link' },
      {state: 'representada', name: 'Representadas', type: 'link' },
      {state: 'unidade', name: 'Unidades', type: 'link' },     
      {state: 'conta', name: 'Conta bancária', type: 'link' },     
    ]
  },{
    state: 'pedidos',
    name: 'Pedido e Notas',
    type: 'sub',
    icon: 'dvr',
    children: [
      { state: 'pedidos', name: 'Pedidos', type: 'link' },
      { state: 'orcamentos', name: 'Orçamentos', type: 'link' },
      { state: 'conciliacao', name: 'Conciliação de Notas', type: 'link' },
      {
        state: 'relcomissao',
        name: 'Relatórios',
        type: 'subchild',
        subchildren: [
            {state: 'comissoes', name: 'Pedidos', type: 'link' },
            {state: 'acumulado', name: 'Confirm. Recebimento', type: 'link' },
            {state: 'checkbox', name: 'Pedidos Entregues', type: 'link' },
            {state: 'datepicker', name: 'Produtos Vendidos', type: 'link' },    
            {state: 'editor', name: 'Vendidos por cliente', type: 'link' }
        ]
      }
    ]
  },{
    state: 'comissao',
    name: 'Comissão',
    type: 'sub',
    icon: 'trending_up',
    children: [
      {state: 'importar', name: 'Importar', type: 'link' },
      {state: 'recebimentos', name: 'Recebimentos', type: 'link' },
      {
        state: 'relatorios',
        name: 'Relatórios',
        type: 'subchild',
        subchildren: [
          {state: 'acumulado', name: 'Acumulado', type: 'link' },  
          {state: 'comissoes', name: 'Comissôes', type: 'link' },  
          {state: 'recebimento', name: 'Recebimento', type: 'link' },
          {state: 'devolucoes', name: 'Devoluções', type: 'link' },
          {state: 'estorno', name: 'Estornos', type: 'link' },
        ]
      }
    ]
  },{
    state: 'financeiro',
    name: 'Financeiro',
    type: 'sub',
    icon: 'monetization_on',
    children: [
      {state: 'financeiro', name: 'Caixa e Bancos', type: 'link' },
      {state: 'financeiro', name: 'Criar Banco', type: 'link' },
      {state: 'financeiro', name: 'Grupo Despesa', type: 'link' },
      {state: 'financeiro', name: 'Criar Categoria', type: 'link' },
      {state: 'financeiro', name: 'Contas a Pagar', type: 'link' },
      {state: 'financeiro', name: 'Contas a Receber', type: 'link' },
      {state: 'financeiro', name: 'Configurar', type: 'link' },
    ]
  },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
