import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogConfig, MatDialog } from "@angular/material";
import { DialogBodyComponent } from './dialog-body/dialog-body.component';
import { ClientService } from '../../shared/services/client.service.component';
import { DialogConfirmarDeleteComponent } from '../dialog-confirmar-delete/confirmar-delete.component';

@Component({
  selector: 'app-areavenda',
  templateUrl: './areavenda.component.html',
  styleUrls: ['./areavenda.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AreaVendaComponent implements OnInit {
  data: any = [];
  dados: any = [];
  editing = {};
  isEditable = {};
  rows = [];
  temp = [...this.data];

  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  columns = [
    { prop: 'id' },
    { prop: 'nome' },
    { prop: 'vendedor.nome' },
    { prop: 'auxiliar.nome' },
    { prop: 'regio.nome' },
    { prop: 'status' },
  ];

  @ViewChild(AreaVendaComponent, { static: false }) table: AreaVendaComponent;
  constructor(private clientservice: ClientService, private dialog: MatDialog) {

    this.clientservice.getAreaVenda().subscribe(res => {
      this.data = res;
      this.rows = this.data.data.sort((a, b) => a.id - b.id);
      this.temp = [...this.data.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      if (d.nome.toLowerCase().indexOf(val) !== -1 || !val
        || d.regio.nome.toLowerCase().indexOf(val) !== -1 || !val
        || d.vendedor.nome.toLowerCase().indexOf(val) !== -1 || !val)
        return d
    });
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table = this.data;
  }
  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }

  openDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '75vw',
      maxHeight: '85vh',
      width: '75vw',
    }
    //dialogConfig.data = this.dados.data;
    let dialogRef = this.dialog.open(
      DialogBodyComponent,
      dialogConfig,

    );
    dialogRef.afterClosed().subscribe(value => {
      this.refreshTable();
    });
  }

  refreshTable() {
    this.clientservice.getAreaVenda().subscribe(res => {
      this.dados = res;
      this.rows = this.dados.data.sort((a, b) => a.id - b.id);
      this.temp = [...this.dados.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
    });
  }
  delete(row) {
    const dialogConfig = new MatDialogConfig();
    const tipo = 'area-vendas';
    dialogConfig.data = row
    dialogConfig.data.tipo = tipo
    let dialogRef = this.dialog.open(DialogConfirmarDeleteComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(value => {

      (value != 1) ? this.refreshTable() : null

    });
  }
  edit(row) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '75vw',
      maxHeight: '85vh',
      width: '75vw',
    }
    dialogConfig.data = row
    dialogConfig.data.action = 'edit'
    let dialogRef = this.dialog.open(DialogBodyComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(value => {

      (value != 1) ? this.refreshTable() : null

    });
  }

  view(row) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '75vw',
      maxHeight: '85vh',
      width: '75vw',
    }
    dialogConfig.data = row
    dialogConfig.data.action = 'view'
    let dialogRef = this.dialog.open(DialogBodyComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(value => {

      (value != 1) ? this.refreshTable() : null

    });
  }

  ngOnInit() {

  }

}