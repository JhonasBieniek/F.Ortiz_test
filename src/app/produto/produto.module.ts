import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaComponent } from './categoria/categoria.component';
import { NovoComponent } from './novo/novo.component';
import { EntradaComponent } from './entrada/entrada.component';
import { ListarComponent } from './listar/listar.component';
import { FilaImpressaoComponent } from './fila-impressao/fila-impressao.component';
import { AjusteEstoqueComponent } from './ajuste-estoque/ajuste-estoque.component';
import { TipoPrecoComponent } from './tipo-preco/tipo-preco.component';
import { ConfigurarComponent } from './configurar/configurar.component';
import { RouterModule } from '@angular/router';
import { ProdutoRoutes} from './produto.routing'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


import { DemoMaterialModule} from '../demo-material-module';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { QuillModule } from 'ngx-quill';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { DialogCadastroComponent } from '../pedido/novo/dialog-cadastro/dialog-cadastro.component';
import { NgxMaskModule } from 'ngx-mask'

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ProdutoRoutes),
    DemoMaterialModule,
    CdkTableModule,
    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    QuillModule,
    FileUploadModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [CategoriaComponent, 
                NovoComponent, 
                EntradaComponent, 
                ListarComponent, 
                FilaImpressaoComponent, 
                AjusteEstoqueComponent, 
                TipoPrecoComponent, 
                ConfigurarComponent],

})
export class ProdutoModule { }
