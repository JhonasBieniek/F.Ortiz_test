import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarComponent } from './listar/listar.component';
import { GerarComponent } from './gerar/gerar.component';
import { ConfigurarComponent } from './configurar/configurar.component';
import { RouterModule } from '@angular/router';
import { CreditoRoutes} from './credito.routing'

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CreditoRoutes)
  ],
  declarations: [ListarComponent, 
                  GerarComponent, 
                  ConfigurarComponent]
})
export class CreditoModule { }
