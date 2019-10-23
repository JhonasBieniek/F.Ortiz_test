import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}
export interface Saperator {
  name: string;
  type?: string;
}
export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
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
      {state: 'areavenda', name: 'Áreas de Vendas'},
      {state: 'cargos', name: 'Cargos'},
      {state: 'cliente', name: 'Clientes'},
      {state: 'representada', name: 'Representadas'},
      {state: 'unidade', name: 'Unidades'},
      {state: 'funcionario', name: 'Funcionários'},
      {state: 'regioes', name: 'Regiões'},
      {state: 'grupos', name: 'Grupos'},
      {state: 'condicoescomerciais', name: 'Condições Comerciais'},
      {state: 'comissoes', name: 'Comissões'},
      {state: 'ramo-atividade', name: 'Ramo de Atividade'},
      
      
      
    ]
  },{
    state: 'produto',
    name: 'Produto',
    type: 'sub',
    icon: 'shop',
    children: [
      {state: 'novo', name: 'Novo'},  
      {state: 'listar', name: 'Listar'},  
    ]
  },{
    state: 'pedido',
    name: 'Pedido e Notas',
    type: 'sub',
    icon: 'dvr',
    children: [
      {state: 'importar', name: 'Importar'},
      {state: 'listar', name: 'Pedidos'},
      {state: 'orcamento', name: 'Orçamento'},
      {state: 'conciliacao', name: 'Conciliação de Notas'},
      {state: 'relatorios', name: 'Relatórios'},
    ]
  },{
    state: 'credito',
    name: 'Crédito',
    type: 'sub',
    icon: 'payment',
    children: [
      {state: 'listar', name: 'Listar'},
      {state: 'gerar', name: 'Gerar'},
      {state: 'configurar', name: 'Configurar'},
    ]
  },{
    state: 'financeiro',
    name: 'Financeiro',
    type: 'sub',
    icon: 'monetization_on',
    children: [
      {state: 'financeiro', name: 'Caixa e Bancos'},
      {state: 'financeiro', name: 'Criar Banco'},
      {state: 'financeiro', name: 'Grupo Despesa'},
      {state: 'financeiro', name: 'Criar Categoria'},
      {state: 'financeiro', name: 'Contas a Pagar'},
      {state: 'financeiro', name: 'Contas a Receber'},
      {state: 'financeiro', name: 'Configurar'},
    ]
  },{
    state: 'relatorio',
    name: 'Relatório',
    type: 'sub',
    icon: 'insert_chart',
    children: [
      {state: 'relatorio', name: 'Crédito'},
      {state: 'relatorio', name: 'Desempenho'},
      {state: 'relatorio', name: 'Divergência'},
      {state: 'relatorio', name: 'Financeiro'},
      {state: 'relatorio', name: 'Pedido'},
      {state: 'relatorio', name: 'Produto'},
      {state: 'relatorio', name: 'Venda'},
    ]
  },/*{
    state: 'configuracao',
    name: 'Configuração',
    type: 'sub',
    icon: 'build',
    children: [
      {state: 'configuracao', name: 'Produto'},
      {state: 'configuracao', name: 'Pedido'},
      {state: 'configuracao', name: 'PDF'},
      {state: 'configuracao', name: 'Venda'},
      {state: 'configuracao', name: 'Crédito'},
      {state: 'configuracao', name: 'Nota Fiscal'},
      {state: 'configuracao', name: 'Financeiro'},
    ]
  },*/ /*
    {
    state: 'material',
    name: 'Material Ui',
    type: 'sub',
    icon: 'bubble_chart',
    badge: [
      {type: 'red', value: '17'}
    ],
    children: [
      {state: 'button', name: 'Buttons'},
      {state: 'cards', name: 'Cards'},
      {state: 'grid', name: 'Grid List'},
      {state: 'lists', name: 'Lists'},
      {state: 'menu', name: 'Menu'},
      {state: 'tabs', name: 'Tabs'},
      {state: 'stepper', name: 'Stepper'},
      {state: 'expansion', name: 'Expansion Panel'},
      {state: 'chips', name: 'Chips'},
      {state: 'toolbar', name: 'Toolbar'},
      {state: 'progress-snipper', name: 'Progress snipper'},
      {state: 'progress', name: 'Progress Bar'},
      {state: 'dialog', name: 'Dialog'},
      {state: 'tooltip', name: 'Tooltip'},
      {state: 'snackbar', name: 'Snackbar'},
      {state: 'slider', name: 'Slider'},
      {state: 'slide-toggle', name: 'Slide Toggle'}     
    ]
  },
  {
    state: 'apps',
    name: 'Apps',
    type: 'sub',
    icon: 'apps',
    children: [
      {state: 'calendar', name: 'Calendar'},
      {state: 'messages', name: 'Mail box'},
      {state: 'chat', name: 'Chat'},
      {state: 'taskboard', name: 'Taskboard'}    
    ]
  },
    {
    state: '',    
    name: 'Forms, Table & Widgets',
    type: 'saperator',
    icon: 'av_timer'    
  },{
    state: 'forms',
    name: 'Forms',
    type: 'sub',
    icon: 'insert_drive_file',
    
    children: [
      
      {state: 'form-layout', name: 'Form-Layout'},
      {state: 'autocomplete', name: 'Autocomplete'},
      {state: 'checkbox', name: 'Checkbox'},
      {state: 'datepicker', name: 'Datepicker'},    
      {state: 'editor', name: 'Editor'},
      {state: 'form-validation', name: 'Form Validation'},
      {state: 'file-upload', name: 'File Upload'},
      {state: 'wizard', name: 'Wizard'}        
          
    ]
  },{
    state: 'tables',
    name: 'Tables',
    type: 'sub',
    icon: 'web',
     
    children: [
      
      {state: 'basictable', name: 'Basic Table'},
      {state: 'filterable', name: 'Filterable Table'},
      {state: 'pagination', name: 'Pagination Table'},
      {state: 'sortable', name: 'Sortable Table'},
      {state: 'mix', name: 'Mix Table'}    
          
    ]
  },{
    state: 'datatables',
    name: 'Data Tables',
    type: 'sub',
    icon: 'border_all',
    
    children: [
      {state: 'basicdatatable', name: 'Basic Data Table'},
      {state: 'filter', name: 'Filterable'},
      {state: 'editing', name: 'Editing'},
    ]
  },{
    state: 'widgets',
    name: 'Widgets',
    type: 'link',
    icon: 'widgets'
  },{
    state: '',    
    name: 'Extra Component',
    type: 'saperator',
    icon: 'av_timer'    
  },
    {
    state: 'authentication',
    name: 'Authentication',
    type: 'sub',
    icon: 'perm_contact_calendar',
    
    children: [
      {state: 'login', name: 'Login'},    
      {state: 'register', name: 'Register'},      
      {state: 'forgot', name: 'Forgot'},
      {state: 'lockscreen', name: 'Lockscreen'},
      {state: '404', name: 'Error'}      
          
    ]
  },{
    state: 'charts',
    name: 'Charts',
    type: 'sub',
    icon: 'insert_chart',
    
    children: [
      {state: 'chartjs', name: 'Chart Js'},    
      {state: 'chartistjs', name: 'Chartist Js'},
      {state: 'ngxchart', name: 'Ngx Charts'}       
      
    ]
  },{
    state: 'pages',
    name: 'Pages',
    type: 'sub',
    icon: 'content_copy',
    
    children: [
      {state: 'icons', name: 'Material Icons'}, 
      {state: 'timeline', name: 'Timeline'},
      {state: 'invoice', name: 'Invoice'}, 
      {state: 'pricing', name: 'Pricing'},
      {state: 'helper', name: 'Helper Classes'}  
    ]
  }*/
    
];

@Injectable()

export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }

}
