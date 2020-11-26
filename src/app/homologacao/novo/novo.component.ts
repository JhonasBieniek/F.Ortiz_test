import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogConfirmarDeleteComponent } from '../../cadastro/dialog-confirmar-delete/confirmar-delete.component';
import { ClientService } from '../../shared/services/client.service.component';
import { DialogBodyComponent } from './dialog-body/dialog-body.component';

@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html',
  styleUrls: ['./novo.component.css']
})
export class NovoComponent implements OnInit {
  data:any = [];
  dados:any = [];
  editing = {};
  isEditable = {};
  rows = [];
  temp = [...this.data];
  
  loadingIndicator: boolean = true;
  reorderable: boolean = true;                           

  @ViewChild(NovoComponent, {static: false}) table: NovoComponent;
  constructor(private clientservice: ClientService, private dialog: MatDialog) {

    this.clientservice.getHomologacoes().subscribe(res =>{
      this.data = res; console.log(this.data.data)
      this.rows = this.data.data.sort((a,b)=> a.id - b.id);
      this.temp = [...this.data.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500); 
    });                                  
  }
  
  updateFilter(event) {
  const val = event.target.value.toLowerCase();
      
  // filter our data
  const temp = this.temp.filter(function(d) {
    if( d.nome.toLowerCase().indexOf(val) !== -1 || !val 
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
  console.log('inline editing rowIndex', rowIndex)
  this.editing[rowIndex + '-' + cell] = false;
  this.rows[rowIndex][cell] = event.target.value;
  this.rows = [...this.rows];
  console.log('UPDATED!', this.rows[rowIndex][cell]);
  }

  openDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: '90vw',
      height: '70vh'
    }
    //dialogConfig.data = this.dados.data;
    let dialogRef = this.dialog.open(
      DialogBodyComponent, 
      dialogConfig, 
    
  );
    dialogRef.afterClosed().subscribe(value => {
        this.refreshTable();
        console.log(`Dialog sent: ${value}`); 
      });
  }

  refreshTable(){
    this.clientservice.getHomologacoes().subscribe(res =>{
      this.dados = res;
      this.rows = this.dados.data.sort((a,b)=> a.id - b.id);
      this.temp = [...this.dados.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
      });
      console.log("Rodei")
  }
  delete(row){
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
    edit(row){
      let dialogConfig = new MatDialogConfig();
      dialogConfig = {
        maxWidth: '75vw',
        maxHeight: '85vh',
        width: '75vw',
        height: '75vh'
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

  ngOnInit() {
   
  }

}