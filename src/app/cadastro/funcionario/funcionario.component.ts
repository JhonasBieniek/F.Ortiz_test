import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogConfig, MatDialog } from "@angular/material";
import { ClientService } from '../../shared/services/client.service.component';
import { DialogBodyFuncionarioComponent } from './dialog-body/dialog-body-funcionario.component';
import { DialogConfirmarDeleteComponent } from '../dialog-confirmar-delete/confirmar-delete.component';


@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FuncionarioComponent implements OnInit {

  data: any = [];
  dados: any = [];
  editing = {};
  isEditable = {};
  rows = [];
  temp = [...this.data];

  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  columns = [
    { prop: 'nome' },
    { prop: 'usuario.email' },
    { prop: 'id' },
    { prop: 'status' },

  ];

  @ViewChild(FuncionarioComponent, { static: false }) table: FuncionarioComponent;
  constructor(private clientservice: ClientService, private dialog: MatDialog) {

    this.clientservice.getFuncionarios().subscribe((res: any) => {
      this.data = res.data;
      this.rows = this.data.sort((a, b) => a.id - b.id);
      this.temp = [...this.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter name
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
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '100vw',
      maxHeight: '100vh',

      width: '95vw',
      height: '95vh'
    }
    //dialogConfig.data = this.dados.data;
    let dialogRef = this.dialog.open(
      DialogBodyFuncionarioComponent,
      dialogConfig,

    );
    dialogRef.afterClosed().subscribe(value => {
      this.refreshTable();
    });
  }
  edit(row) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '85vw',
      height: '95vh'
    }
    dialogConfig.data = row;
    dialogConfig.data.action = 'edit';
    let dialogRef = this.dialog.open(DialogBodyFuncionarioComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(value => {

      (value != 1) ? this.refreshTable() : null

    });
  }
  view(row) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '85vw',
      height: '95vh'
    }
    dialogConfig.data = row
    dialogConfig.data.action = 'view';
    let dialogRef = this.dialog.open(DialogBodyFuncionarioComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(value => {

      (value != 1) ? this.refreshTable() : null

    });
  }
  delete(row) {
    const dialogConfig = new MatDialogConfig();
    let tipo = 'funcionarios'
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
    this.clientservice.getFuncionarios().subscribe((res: any) => {
      this.rows = res.data.sort((a, b) => a.id - b.id);
      this.temp = [...res.data];
    });
  }


  ngOnInit() {

  }

}