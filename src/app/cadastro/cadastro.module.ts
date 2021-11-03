import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CadastroRoutes } from './cadastro.routing';
import { DemoMaterialModule } from '../demo-material-module';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { QuillModule } from 'ngx-quill';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxMaskModule } from 'ngx-mask';

import { AreaVendaComponent } from './areavenda/areavenda.component';
import { AssistenciaTecnicaComponent } from './assistencia-tecnica/assistencia-tecnica.component'
import { ClienteComponent } from './cliente/cliente.component';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { RepresentanteComponent } from './representante/representante.component';
import { ListarComponent } from './listar/listar.component';
import { RepresentadaComponent } from './representada/representada.component';
import { CargosComponent } from './cargos/cargos.component';
import { UnidadeComponent } from './unidade/unidade.component';
import { FuncionarioComponent } from './funcionario/funcionario.component';
import { ComissoesComponent } from './comissoes/comissoes.component';
import { RegioesComponent } from './regioes/regioes.component';
import { CondicoescomerciaisComponent } from './condicoescomerciais/condicoescomerciais.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { GruposComponent } from './grupos/grupos.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { RamoAtividadeComponent } from './ramo-atividade/ramo-atividade.component'
import { DialogBodyRamoComponent } from './ramo-atividade/dialog-body-ramo/dialog-body-ramo.component';
import { DialogConfirmarDeleteComponent } from './dialog-confirmar-delete/confirmar-delete.component';
import { DialogBodyProdutoComponent } from './produtos/dialog-body-produto/dialog-body-produto.component';
import { DialogBodyComponent } from './areavenda/dialog-body/dialog-body.component';
import { DialogBodyCargosComponent } from './cargos/dialog-body/dialog-body.component';
import { DialogBodyUnidadesComponent } from './unidade/dialog-body/dialog-body.component';
import { DialogBodyRegioesComponent } from './regioes/dialog-body/dialog-body-regioes.component';
import { DialogBodyCondComerciaisComponent } from './condicoescomerciais/dialog-body/dialog-body-condcomerciais.component';
import { DialogBodyComissoesComponent } from './comissoes/dialog-body/dialog-body.component';
import { DialogBodyUsuariosComponent } from './usuarios/dialog-body/dialog-body.component';
import { DialogBodyGruposComponent } from './grupos/dialog-body/dialog-body.component';
import { DialogBodyFornecedorComponent } from './fornecedor/dialog-body/dialog-body-fornecedor.component';
import { DialogBodyRepresentadaComponent } from './representada/dialog-body/dialog-body-representada.component';
import { DialogBodyFuncionarioComponent } from './funcionario/dialog-body/dialog-body-funcionario.component';
import { DialogBodyClienteComponent } from './cliente/dialog-body/dialog-body-cliente.component';
import { TamanhosComponent } from './tamanhos/tamanhos.component';
import { DialogTamanhosComponent } from './tamanhos/dialog-tamanhos/dialog-tamanhoscomponent';
import { NgxCurrencyModule } from 'ngx-currency';
import { ContaBancoComponent } from './conta-banco/conta-banco.component';
import { DialogContaComponent } from './conta-banco/dialog-conta/dialog-conta.component';
import { TipoProdutoComponent } from './tipo-produto/tipo-produto.component';
import { DialogBodyTipoProdutoComponent } from './tipo-produto/dialog-body/dialog-body.component';
import { ProdutoMateriaisComponent } from './produto-materiais/produto-materiais.component';
import { DialogBodyProdutoMateriaisComponent } from './produto-materiais/dialog-body/dialog-body.component';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { DateFormatPipe } from '../shared/pipes/dateFormat.pipe';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { DateAdapter } from 'angular-calendar';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DialogUpdatePriceComponent } from './produtos/dialog-update-price/dialog-update-price.component';
import { ClassificacoesComponent } from './classificacoes/classificacoes.component';
import { DialogBodyProdutoClassificacaoComponent } from './classificacoes/dialog-body/dialog-body.component';




@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(CadastroRoutes),
    FlexLayoutModule,
    QuillModule,
    FileUploadModule,
    NgxDatatableModule,
    NgxCurrencyModule,
    SelectAutocompleteModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [ClienteComponent,
    FornecedorComponent,
    RepresentanteComponent,
    AreaVendaComponent,
    AssistenciaTecnicaComponent,
    ListarComponent,
    RepresentadaComponent,
    DialogBodyComponent,
    DialogBodyCargosComponent,
    DialogBodyUnidadesComponent,
    DialogBodyRegioesComponent,
    DialogBodyCondComerciaisComponent,
    DialogBodyComissoesComponent,
    DialogBodyUsuariosComponent,
    DialogBodyGruposComponent,
    DialogBodyFuncionarioComponent,
    DialogBodyRepresentadaComponent,
    DialogBodyFornecedorComponent,
    DialogBodyRamoComponent,
    DialogConfirmarDeleteComponent,
    CargosComponent,
    TamanhosComponent,
    UnidadeComponent,
    FuncionarioComponent,
    ComissoesComponent,
    RegioesComponent,
    CondicoescomerciaisComponent,
    UsuariosComponent,
    GruposComponent,
    DialogBodyClienteComponent,
    RamoAtividadeComponent,
    ProdutosComponent,
    DialogBodyProdutoComponent,
    DialogTamanhosComponent,
    ContaBancoComponent,
    DialogContaComponent,
    TipoProdutoComponent,
    DialogBodyTipoProdutoComponent,
    DialogBodyProdutoMateriaisComponent,
    DialogBodyProdutoClassificacaoComponent,
    ProdutoMateriaisComponent,
    DialogUpdatePriceComponent,
    ClassificacoesComponent
  ],
  providers: [
    DateFormatPipe,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  entryComponents: [DialogBodyComponent,
    DialogBodyCargosComponent,
    DialogBodyUnidadesComponent,
    DialogBodyRegioesComponent,
    DialogBodyCondComerciaisComponent,
    DialogBodyComissoesComponent,
    DialogBodyUsuariosComponent,
    DialogBodyGruposComponent,
    DialogBodyRepresentadaComponent,
    DialogBodyFuncionarioComponent,
    DialogBodyClienteComponent,
    DialogBodyFornecedorComponent,
    DialogBodyRamoComponent,
    DialogConfirmarDeleteComponent,
    DialogBodyProdutoComponent,
    DialogTamanhosComponent,
    DialogContaComponent,
    DialogBodyProdutoMateriaisComponent,
    DialogBodyProdutoClassificacaoComponent,
    DialogBodyTipoProdutoComponent,
    DialogUpdatePriceComponent,
  ],
  exports: []
})

export class CadastroModule { }
