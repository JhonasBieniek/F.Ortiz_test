import { Component, ViewChild } from '@angular/core';

declare var require: any;
const data: any = require('assets/company.json');

@Component({
  selector: 'app-table-editing',
  templateUrl: './table-editing.component.html',
  styleUrls: ['./table-editing.component.scss']
})
export class TableEditingComponent {
  editing = {};
  rows = [];
  temp = [...data];

  loadingIndicator = true;
  reorderable = true;

  columns = [{ prop: 'name' }, { name: 'Gender' }, { name: 'Company' }];

  @ViewChild(TableEditingComponent, {static:true}) table: TableEditingComponent;
  constructor() {
    this.rows = data;
    this.temp = [...data];
    setTimeout(() => {
      this.loadingIndicator = false;
    }, 1500);
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // update the rows

    // Whenever the filter changes, always go back to the first page
    this.table = data;
  }
  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }
}
