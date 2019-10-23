import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule} from '../demo-material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TablesRoutes } from './tables.routing';



import { BasicTableComponent } from './basic-table/basic-table.component';
import { FilterableComponent } from './filterable/filterable.component';
import { PaginationComponent } from './pagination/pagination.component';
import { SortableComponent } from './sortable/sortable.component';
import { MixComponent } from './mix/mix.component'; 
 
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TablesRoutes),
    DemoMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
   ],
  declarations: [
    BasicTableComponent,
    FilterableComponent,
    PaginationComponent,
    SortableComponent,
    MixComponent  
    
  ],
})

export class TablesModule {}
