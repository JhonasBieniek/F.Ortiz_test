import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog } from "@angular/material";
import { DialogBodyRegioesComponent } from './dialog-body/dialog-body-regioes.component';
import { ClientService } from '../../shared/services/client.service.component';
import { DialogConfirmarDeleteComponent } from '../dialog-confirmar-delete/confirmar-delete.component';


@Component({
  selector: 'app-regioes',
  templateUrl: './regioes.component.html',
  styleUrls: ['./regioes.component.scss']
})
export class RegioesComponent implements OnInit {
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
      { prop: 'descricao' },
      { prop: 'status' },

  ];       

  @ViewChild(RegioesComponent, {static: false}) table: RegioesComponent;
  constructor(private clientservice: ClientService, private dialog: MatDialog) {

    this.clientservice.getRegioes().subscribe(res =>{
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
    if( d.descricao.toLowerCase().indexOf(val) !== -1 || !val || d.nome.toLowerCase().indexOf(val) !== -1 || !val  )
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
    let dialogRef = this.dialog.open(
      DialogBodyRegioesComponent, 
    
  );
    dialogRef.afterClosed().subscribe(value => {
        this.refreshTable();
        console.log(`Dialog sent: ${value}`); 
      });
  }
  edit(row){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.data = row
      dialogConfig.data.action = 'edit'
      let dialogRef = this.dialog.open(DialogBodyRegioesComponent,
      dialogConfig   
    );
    dialogRef.afterClosed().subscribe(value => {

     (value != 1) ? this.refreshTable() : null

      });
    }
  
  delete(row){
    const dialogConfig = new MatDialogConfig();
      let tipo = 'regioes'
      dialogConfig.data = row
      dialogConfig.data.tipo = tipo
      let dialogRef = this.dialog.open(DialogConfirmarDeleteComponent,
      dialogConfig   
    );
    dialogRef.afterClosed().subscribe(value => {

     (value != 1) ? this.refreshTable() : null

      });
    }

  refreshTable(){
    this.clientservice.getRegioes().subscribe(res =>{
      this.dados = res;
      this.rows = this.dados.data.sort((a,b)=> a.id - b.id);
      this.temp = [...this.dados.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
      });
      console.log("Rodei")
  }


  ngOnInit() {
   
  }

}