import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogConfig, MatDialog } from "@angular/material";
import { ClientService } from '../../shared/services/client.service.component';
import { DialogBodyRamoComponent } from './dialog-body-ramo/dialog-body-ramo.component';
import { DialogConfirmarDeleteComponent } from '../dialog-confirmar-delete/confirmar-delete.component';

@Component({
  selector: 'app-ramo-atividade',
  templateUrl: './ramo-atividade.component.html',
  styleUrls: ['./ramo-atividade.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RamoAtividadeComponent implements OnInit {
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
    { prop: 'created' },
    { prop: 'modified' },
  ];

  @ViewChild(RamoAtividadeComponent, { static: false }) table: RamoAtividadeComponent;
  constructor(private clientservice: ClientService, private dialog: MatDialog) {

    this.clientservice.getRamos().subscribe(res => {
      this.data = res;
      this.rows = this.data.data;
      this.temp = [...this.data.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      if (d.nome.toLowerCase().indexOf(val) !== -1 || !val)
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
    let dialogRef = this.dialog.open(
      DialogBodyRamoComponent,
    );
    dialogRef.afterClosed().subscribe(value => {
      this.refreshTable();
    });
  }
  edit(row) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = row
    dialogConfig.data.action = 'edit'
    let dialogRef = this.dialog.open(DialogBodyRamoComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(value => {

      (value != 1) ? this.refreshTable() : null

    });
  }
  view(row) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = row
    dialogConfig.data.action = 'view'
    let dialogRef = this.dialog.open(DialogBodyRamoComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(value => {

      (value != 1) ? this.refreshTable() : null

    });
  }
  delete(row) {
    const dialogConfig = new MatDialogConfig();
    let tipo = 'ramoAtividades'
    dialogConfig.data = row
    dialogConfig.data.tipo = tipo
    let dialogRef = this.dialog.open(DialogConfirmarDeleteComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(value => {

      (value != 1) ? this.refreshTable() : null

    });
  }

  refreshTable() {
    this.clientservice.getRamos().subscribe(res => {
      this.dados = res;
      this.rows = this.dados.data;
      this.temp = [...this.dados.data];
    });
  }


  ngOnInit() {

  }

}