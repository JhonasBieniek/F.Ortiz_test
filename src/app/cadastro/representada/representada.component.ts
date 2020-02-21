import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog } from "@angular/material";
import { ClientService } from '../../shared/services/client.service.component';
import { DialogBodyRepresentadaComponent } from './dialog-body/dialog-body-representada.component';
import { DialogConfirmarDeleteComponent } from '../dialog-confirmar-delete/confirmar-delete.component';

@Component({
  selector: 'app-representada',
  templateUrl: './representada.component.html',
  styleUrls: ['./representada.component.scss']
})

export class RepresentadaComponent implements OnInit {

  data:any = [];
  dados:any = [];
  editing = {};
  isEditable = {};
  rows = [];
  temp = [...this.data];
  
  loadingIndicator: boolean = true;
  reorderable: boolean = true;                           

  columns = [
      { prop: 'razao_social' },
      { prop: 'cnpj' },
      { prop: 'inscricao_estadual' },
      { prop: 'status' },

  ];       

  @ViewChild(RepresentadaComponent, {static: false}) table: RepresentadaComponent;
  constructor(private clientservice: ClientService, private dialog: MatDialog) {
    this.refreshTable();                               
  }
  
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function(d) {
      if( d.razao_social.toLowerCase().indexOf(val) !== -1 || !val || d.cnpj.toLowerCase().indexOf(val) !== -1 || !val  )
      return d
    }); 
    this.rows = temp;
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
      maxHeight: '95vh',
    
      width: '75vw',
      height: '95vh'
    }
    //dialogConfig.data = this.dados.data;
    let dialogRef = this.dialog.open(
      DialogBodyRepresentadaComponent, 
      dialogConfig,
  );
    dialogRef.afterClosed().subscribe(value => {
      this.refreshTable();
    });
  }
  edit(row){
    let dialogConfig = new MatDialogConfig();
      dialogConfig = {
        maxWidth: '75vw',
        maxHeight: '95vh',
        width: '75vw',
        height: '95vh'
      }
      dialogConfig.data = row
      dialogConfig.data.action = 'edit'
      let dialogRef = this.dialog.open(DialogBodyRepresentadaComponent,
      dialogConfig   
    );
    dialogRef.afterClosed().subscribe(value => {
      (value != 1) ? this.refreshTable() : null
      });
    }

  delete(row){
    const dialogConfig = new MatDialogConfig();
      let tipo = 'representadas'
      dialogConfig.data = row
      dialogConfig.data.nome = row.razao_social
      dialogConfig.data.tipo = tipo
      let dialogRef = this.dialog.open(DialogConfirmarDeleteComponent,
      dialogConfig   
    );
    dialogRef.afterClosed().subscribe(value => {
      (value != 1) ? this.refreshTable() : null
    });
  }

  refreshTable(){
    this.clientservice.getRepresentadas().subscribe(res =>{
      this.dados = res;
      this.rows = this.dados.data;
      this.temp = [...this.dados.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
    });
  }


  ngOnInit() {
   
  }

}