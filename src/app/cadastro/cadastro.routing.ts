import { Routes } from '@angular/router';

import { ClienteComponent } from './cliente/cliente.component';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { RepresentanteComponent } from './representante/representante.component';
import { AreaVendaComponent } from './areavenda/areavenda.component';
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
      path: 'unidade', 
      component: UnidadeComponent
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
}]
  }
];
