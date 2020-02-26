import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComissaoRoutes } from './comissao.routing';
import { ReceberComponent } from './receber/receber.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [ReceberComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ComissaoRoutes),
  ]
})
export class ComissaoModule { }
