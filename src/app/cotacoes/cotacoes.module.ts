import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CotacoesRoutes } from './cotacoes.routing';

import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';

import { OrcListarComponent } from '../pedido/orc-listar/orc-listar.component';
import { NgxMaskModule, IConfig} from 'ngx-mask';
import { CdkTableModule } from '@angular/cdk/table';
import { QuillModule } from 'ngx-quill';
import { MatDialogModule } from '@angular/material';
import { NgxCurrencyModule } from 'ngx-currency';
import { FileUploadModule } from 'ng2-file-upload';

export const options: Partial<IConfig> | (() => Partial<IConfig>)=null;

export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 5,
  prefix: "R$ ",
  suffix: "",
  thousands: ".",
  nullable: true
};


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CotacoesRoutes),
    NgxMaskModule.forRoot(options),
    DemoMaterialModule,
    CdkTableModule,
    FormsModule, ReactiveFormsModule,
    FlexLayoutModule,
    QuillModule,
    FileUploadModule,
    MatDialogModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    NgxMaskModule.forRoot(),
  ],
  declarations: [
    OrcListarComponent, 
  ]
})
export class CotacoesModule {}
