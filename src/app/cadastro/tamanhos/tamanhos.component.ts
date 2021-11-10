import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogConfig, MatDialog } from "@angular/material";
import { DialogTamanhosComponent } from './dialog-tamanhos/dialog-tamanhoscomponent';
import { ClientService } from '../../shared/services/client.service.component';
import { DialogConfirmarDeleteComponent } from '../dialog-confirmar-delete/confirmar-delete.component';


@Component({
  selector: 'app-tamanhos',
  templateUrl: './tamanhos.component.html',
  styleUrls: ['./tamanhos.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TamanhosComponent implements OnInit {
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

  @ViewChild(TamanhosComponent, { static: false }) table: TamanhosComponent;
  constructor(private clientservice: ClientService, private dialog: MatDialog) {

    this.clientservice.getTamanhos().subscribe(res => {
      this.data = res; console.log(this.data.data)
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
    console.log('inline editing rowIndex', rowIndex)
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    console.log('UPDATED!', this.rows[rowIndex][cell]);
  }

  openDialog() {
    let dialogConfig = new MatDialogConfig();
    /*dialogConfig = {
      maxWidth: '75vw',
      maxHeight: '75vh',
      width: '75vw',
      height: '40vh'
    }*/
    //dialogConfig.data = this.dados.data;
    let dialogRef = this.dialog.open(
      DialogTamanhosComponent

    );
    dialogRef.afterClosed().subscribe(value => {
      this.refreshTable();
    });
  }
  edit(row) {
    let dialogConfig = new MatDialogConfig();
    /*dialogConfig = {
      maxWidth: '75vw',
      maxHeight: '75vh',
      width: '75vw',
      height: '40vh'
    }*/
    dialogConfig.data = row
    dialogConfig.data.action = 'edit'
    let dialogRef = this.dialog.open(DialogTamanhosComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(value => {
      (value != 1) ? this.refreshTable() : null
    });
  }
  view(row) {
    let dialogConfig = new MatDialogConfig();
    /*dialogConfig = {
      maxWidth: '75vw',
      maxHeight: '75vh',
      width: '75vw',
      height: '40vh'
    }*/
    dialogConfig.data = row
    dialogConfig.data.action = 'view'
    let dialogRef = this.dialog.open(DialogTamanhosComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(value => {
      (value != 1) ? this.refreshTable() : null
    });
  }
  /*delete(row) {
    const dialogConfig = new MatDialogConfig();
    let tipo = 'grupos'
    dialogConfig.data = row
    dialogConfig.data.tipo = tipo
    let dialogRef = this.dialog.open(DialogConfirmarDeleteComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(value => {

      (value != 1) ? this.refreshTable() : null

    });
  }*/

  refreshTable() {
    this.clientservice.getTamanhos().subscribe(res => {
      this.dados = res;
      this.rows = this.dados.data;
      this.temp = [...this.dados.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
    });
  }


  ngOnInit() {

  }

}