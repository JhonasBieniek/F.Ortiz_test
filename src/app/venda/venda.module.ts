import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarComponent } from './listar/listar.component';
import { NovoComponent } from './novo/novo.component';
import { ConfigurarComponent } from './configurar/configurar.component';
import { RouterModule } from '@angular/router';
import { VendaRoutes} from './venda.routing'

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(VendaRoutes)
  ],
  declarations: [ListarComponent, 
                NovoComponent, 
                ConfigurarComponent]
})
export class VendaModule { }
