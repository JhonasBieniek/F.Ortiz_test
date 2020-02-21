import { Routes } from '@angular/router';

import { BasicTableComponent } from './basic-table/basic-table.component';
import { FilterableComponent } from './filterable/filterable.component';
import { PaginationComponent } from './pagination/pagination.component';
import { SortableComponent } from './sortable/sortable.component';
import { MixComponent } from './mix/mix.component';
import { SmarttableComponent } from './smart-table/smart-table.component';
export const TablesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'basictable',
        component: BasicTableComponent,
		data: {
          title: 'Basic Table',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Basic Table' }
          ]
        }
      },
      {
        path: 'filterable',
        component: FilterableComponent,
		data: {
          title: 'Filter Table',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Filter Table' }
          ]
        }
      },
      {
        path: 'pagination',
        component: PaginationComponent,
		data: {
          title: 'Pagination Table',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Pagination Table' }
          ]
        }
      },
      {
        path: 'sortable',
        component: SortableComponent,
		data: {
          title: 'Sortable',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Sortable' }
          ]
        }
      },
      {
        path: 'mix',
        component: MixComponent,
		data: {
          title: 'Mix Table',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Mix Table' }
          ]
        }
      },
      {
        path: 'smarttable',
        component: SmarttableComponent,
		data: {
          title: 'Smart Table',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Smart Table' }
          ]
        }
      }
    ]
  }
];
