import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog } from "@angular/material";
import { DialogBodyCargosComponent } from './dialog-body/dialog-body.component';
import { ClientService } from '../../shared/services/client.service.component';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { DialogConfirmarDeleteComponent } from '../dialog-confirmar-delete/confirmar-delete.component';


@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.scss']
})


export class CargosComponent implements OnInit {
  data:any = [];
  dados:any = [];
  editing = {};
  isEditable = {};
  rows = [];
  temp = [...this.data];
  
  loadingIndicator: boolean = true;
  reorderable: boolean = true;          



  columns = [
      { prop: 'id' },
      { prop: 'nome' },
      { name: 'Criação', prop: 'created' },
      { prop: 'modified' },

  ];       

  @ViewChild(CargosComponent) table: CargosComponent;
  constructor(private clientservice: ClientService, private dialog: MatDialog
    ) {

    this.clientservice.getCargos().subscribe(res =>{
      this.data = res; console.log(this.data.data)
      this.rows = this.data.data;
      this.temp = [...this.data.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500); 
    });                                  
  }
  
  updateFilter(event) {
  const val = event.target.value.toLowerCase();
      
  // filter our data
  const temp = this.temp.filter(function(d) {
    if( d.nome.toLowerCase().indexOf(val) !== -1 || !val )
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
    dialogConfig = {
      maxWidth: '75vw',
      maxHeight: '45vh',
    
      width: '75vw',
      height: '45vh'
    }
    //dialogConfig.data = this.dados.data;
    let dialogRef = this.dialog.open(
      DialogBodyCargosComponent, 
      dialogConfig, 
    
  );
    dialogRef.afterClosed().subscribe(value => {
        this.refreshTable();
        console.log(`Dialog sent: ${value}`); 
      });
  }

  refreshTable(){
    this.clientservice.getCargos().subscribe(res =>{
      this.dados = res;
      this.rows = this.dados.data;
      this.temp = [...this.dados.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
      });
      console.log("Rodei")
  }
  delete(row){
    const dialogConfig = new MatDialogConfig();
      let tipo = 'cargos'
      dialogConfig.data = row
      dialogConfig.data.tipo = tipo
      let dialogRef = this.dialog.open(DialogConfirmarDeleteComponent,
      dialogConfig   
    );
    dialogRef.afterClosed().subscribe(value => {

     (value != 1) ? this.refreshTable() : null

      });
    }


  ngOnInit() {
   
  }

}