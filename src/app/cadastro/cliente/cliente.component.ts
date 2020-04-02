import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog } from "@angular/material";
import { ClientService } from '../../shared/services/client.service.component';
import { DialogBodyClienteComponent } from './dialog-body/dialog-body-cliente.component';
import { DialogConfirmarDeleteComponent } from '../dialog-confirmar-delete/confirmar-delete.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})

export class ClienteComponent implements OnInit {

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
      { prop: "cnpj" },
      { prop: 'inscricao_estadual' },
      { prop: 'status' },
  ];       

  @ViewChild(ClienteComponent, {static: false}) table: ClienteComponent;
  constructor(private clientservice: ClientService, private dialog: MatDialog) {

    this.clientservice.getClientes().subscribe(res =>{
      this.data = res; 
      console.log(this.data)
      this.rows = this.data.data.sort((a,b)=> a.id - b.id);
      this.temp = [...this.data.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500); 
    });                                  
  }
  
  updateFilter(event) {
  const val = event.target.value.toLowerCase();
      
  // filter our data
  const temp = this.temp.filter(function(d) {
    if( d.razao_social.toLowerCase().indexOf(val) !== -1 || !val || d.cnpj.toLowerCase().indexOf(val) !== -1 || !val  )
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
      maxWidth: '100vw',
      maxHeight: '100vh',
    
      width: '95vw',
      height: '95vh'
    }
    let dialogRef = this.dialog.open(
      DialogBodyClienteComponent, 
      dialogConfig, 
    
  );
    dialogRef.afterClosed().subscribe(value => {
        this.refreshTable();
        console.log(`Dialog sent: ${value}`); 
      });
  }
  edit(row){
    let dialogConfig = new MatDialogConfig();
      dialogConfig = {
        maxWidth: '75vw',
        maxHeight: '100vh', 
        width: '75vw',
        height: '90vh'
      }
      dialogConfig.data = row
      dialogConfig.data.action = 'edit'
      let dialogRef = this.dialog.open(DialogBodyClienteComponent,
      dialogConfig   
    );
    dialogRef.afterClosed().subscribe(value => {
      (value != 1) ? this.refreshTable() : null
      });
    }
  delete(row){
    const dialogConfig = new MatDialogConfig();
      let tipo = 'clientes'
      dialogConfig.data = row
      dialogConfig.data.nome = row.razao_social
      dialogConfig.data.tipo = tipo
      let dialogRef = this.dialog.open(DialogConfirmarDeleteComponent,
      dialogConfig   
    );
    dialogRef.afterClosed().subscribe(value => 
      { (value != 1) ? this.refreshTable() : null });
    }

  refreshTable(){
    this.clientservice.getClientes().subscribe(res =>{
      this.dados = res;
      this.rows = this.dados.data.sort((a,b)=> a.id - b.id);
      this.temp = [...this.dados.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
      });
  }
  ngOnInit() {
   
  }

}