import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule} from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GloginRoutes } from './glogin.routing';
import { GloginComponent } from './glogin.component';
@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(GloginRoutes)
  ],
  declarations: [ GloginComponent ]
})

export class GloginModule {
       
    
}
