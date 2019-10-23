import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NovoComponent } from './novo/novo.component';
import { ListarComponent } from './listar/listar.component';
import { OrdemServicoRoutes } from './ordem-servico.routing';
import { RouterModule } from '@angular/router';

import { DemoMaterialModule} from '../demo-material-module';



@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    RouterModule.forChild(OrdemServicoRoutes)
  ],
  declarations: [NovoComponent, 
                ListarComponent]
})
export class OrdemServicoModule { }
