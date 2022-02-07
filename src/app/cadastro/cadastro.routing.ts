import { Routes } from '@angular/router';

import { ClienteComponent } from './cliente/cliente.component';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { RepresentanteComponent } from './representante/representante.component';
import { AreaVendaComponent } from './areavenda/areavenda.component';
import { AreaVendaGruposComponent } from './areavendagrupos/areavendagrupos.component';
import { ListarComponent } from './listar/listar.component';
import { RepresentadaComponent } from './representada/representada.component';
import { CargosComponent } from './cargos/cargos.component';
import { UnidadeComponent } from './unidade/unidade.component';
import { ComissoesComponent } from './comissoes/comissoes.component';
import { FuncionarioComponent } from './funcionario/funcionario.component';
import { RegioesComponent } from './regioes/regioes.component';
import { CondicoescomerciaisComponent } from './condicoescomerciais/condicoescomerciais.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { GruposComponent } from './grupos/grupos.component';
import { RamoAtividadeComponent } from './ramo-atividade/ramo-atividade.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { TamanhosComponent } from './tamanhos/tamanhos.component';
import { ContaBancoComponent } from './conta-banco/conta-banco.component';
import { TipoProdutoComponent } from './tipo-produto/tipo-produto.component';
import { ProdutoMateriaisComponent } from './produto-materiais/produto-materiais.component';
import { ClassificacoesComponent } from './classificacoes/classificacoes.component';


export const CadastroRoutes: Routes = [
  { 
    path: '',
    children: [{
      path: 'cliente', 
      component: ClienteComponent
    },{
      path: 'listar', 
      component: ListarComponent
    },{
      path: 'representada', 
      component: RepresentadaComponent
    },{
      path: 'fornecedor', 
      component: FornecedorComponent
    },{
      path: 'representante', 
      component: RepresentanteComponent
    },{
      path: 'areavenda', 
      component: AreaVendaComponent
    },{
      path: 'areavendagrupos', 
      component: AreaVendaGruposComponent
    },{
      path: 'unidade', 
      component: UnidadeComponent
    },{
      path: 'tamanhos', 
      component: TamanhosComponent
    },{
      path: 'funcionario', 
      component: FuncionarioComponent
    },{
      path: 'comissoes', 
      component: ComissoesComponent
    },{
      path: 'usuarios', 
      component: UsuariosComponent
    },{
      path: 'grupos', 
      component: GruposComponent
    },{
      path: 'condicoescomerciais', 
      component: CondicoescomerciaisComponent
    },{
      path: 'regioes', 
      component: RegioesComponent
    },{
      path: 'cargos', 
      component: CargosComponent
    },{
    path: 'ramo-atividade', 
    component: RamoAtividadeComponent
    },{
    path: 'produtos', 
    component: ProdutosComponent
    },{
      path: 'produto-tipos', 
      component: TipoProdutoComponent
    },{
      path: 'produto-materiais', 
      component: ProdutoMateriaisComponent
    },{
      path: 'produto-classificacao', 
      component: ClassificacoesComponent
    },{
    path: 'conta', 
    component: ContaBancoComponent
    }]
  }
];
