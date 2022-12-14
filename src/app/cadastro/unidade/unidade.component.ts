import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogConfig, MatDialog } from "@angular/material";
import { DialogBodyUnidadesComponent } from './dialog-body/dialog-body.component';
import { ClientService } from '../../shared/services/client.service.component';
import { DialogConfirmarDeleteComponent } from '../dialog-confirmar-delete/confirmar-delete.component';


@Component({
  selector: 'app-unidade',
  templateUrl: './unidade.component.html',
  styleUrls: ['./unidade.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UnidadeComponent implements OnInit {
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
      { prop: 'sigla' },
      { prop: 'descricao' },
      { prop: 'status' },
      { prop: 'created' },
      { prop: 'modified' },

  ];       

  @ViewChild(UnidadeComponent, {static: false}) table: UnidadeComponent;
  constructor(private clientservice: ClientService, private dialog: MatDialog) {

    this.clientservice.getUnidades().subscribe(res =>{
      this.data = res;
      this.rows = this.data.data;
      this.temp = [...this.data.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500); 
    });                                  
  }
  
  updateFilter(event) {
  const val = event.target.value.toLowerCase();
      
  // filter our data
  const temp = this.temp.filter(function(d) {
    if( d.sigla.toLowerCase().indexOf(val) !== -1 || !val || d.descricao.toLowerCase().indexOf(val) !== -1 || !val  )
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
      maxHeight: '50vh',
    }
    //dialogConfig.data = this.dados.data;
    let dialogRef = this.dialog.open(
      DialogBodyUnidadesComponent, 
      dialogConfig, 
    
  );
    dialogRef.afterClosed().subscribe(value => {
        this.refreshTable();
      });
  }
  edit(row){
    let dialogConfig = new MatDialogConfig();
      dialogConfig.data = row
      dialogConfig.data.action = 'edit';
      let dialogRef = this.dialog.open(DialogBodyUnidadesComponent,
      dialogConfig   
    );
    dialogRef.afterClosed().subscribe(value => {

     (value != 1) ? this.refreshTable() : null

      });
  }
  view(row){
    let dialogConfig = new MatDialogConfig();
      dialogConfig.data = row
      dialogConfig.data.action = 'view';
      let dialogRef = this.dialog.open(DialogBodyUnidadesComponent,
      dialogConfig   
    );
    dialogRef.afterClosed().subscribe(value => {

     (value != 1) ? this.refreshTable() : null

      });
  }
  delete(row){
    const dialogConfig = new MatDialogConfig();
      let tipo = 'unidades'
      dialogConfig.data = row
      dialogConfig.data.nome = row.sigla
      dialogConfig.data.tipo = tipo
      let dialogRef = this.dialog.open(DialogConfirmarDeleteComponent,
      dialogConfig   
    );
    dialogRef.afterClosed().subscribe(value => {

     (value != 1) ? this.refreshTable() : null

      });
    }

  refreshTable(){
    this.clientservice.getUnidades().subscribe(res =>{
      this.dados = res;
      this.rows = this.dados.data;
      this.temp = [...this.dados.data];
      });
  }


  ngOnInit() {
   
  }

}