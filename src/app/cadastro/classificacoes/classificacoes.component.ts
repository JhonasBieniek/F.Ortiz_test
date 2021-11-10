import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogConfig, MatDialog } from "@angular/material";
import { ClientService } from '../../shared/services/client.service.component';
import { DialogConfirmarDeleteComponent } from '../dialog-confirmar-delete/confirmar-delete.component';
import { DialogBodyProdutoClassificacaoComponent } from './dialog-body/dialog-body.component';

@Component({
  selector: 'app-classificacoes',
  templateUrl: './classificacoes.component.html',
  styleUrls: ['./classificacoes.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClassificacoesComponent implements OnInit {

  data:any = [];
  dados:any = [];
  editing = {};
  isEditable = {};
  rows = [];
  temp = [...this.data];
  
  loadingIndicator: boolean = true;
  reorderable: boolean = true;          

  @ViewChild(ClassificacoesComponent, {static: false}) table: ClassificacoesComponent;
  constructor(private clientservice: ClientService, private dialog: MatDialog) {
    this.clientservice.getProdutoClassifications().subscribe(res =>{
      this.data = res;
      this.rows = this.data.data.sort((a,b)=> a.id - b.id);
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

    let dialogRef = this.dialog.open(
      DialogBodyProdutoClassificacaoComponent, 
      dialogConfig, 
  );
    dialogRef.afterClosed().subscribe(value => {
        this.refreshTable();
        console.log(`Dialog sent: ${value}`); 
      });
  }

  refreshTable(){
    this.clientservice.getProdutoClassifications().subscribe(res =>{
      this.dados = res;
      this.rows = this.dados.data.sort((a,b)=> a.id - b.id);
      this.temp = [...this.dados.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
      });
  }

  delete(row){
    const dialogConfig = new MatDialogConfig();
      let tipo = 'classifications'
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
    const dialogConfig = new MatDialogConfig();

      dialogConfig.data = row
      dialogConfig.data.action = 'edit'
      let dialogRef = this.dialog.open(DialogBodyProdutoClassificacaoComponent,
      dialogConfig   
    );
    dialogRef.afterClosed().subscribe(value => {
      (value != 1) ? this.refreshTable() : null
      });
  }
  view(row){
    const dialogConfig = new MatDialogConfig();

      dialogConfig.data = row
      dialogConfig.data.action = 'view'
      let dialogRef = this.dialog.open(DialogBodyProdutoClassificacaoComponent,
      dialogConfig   
    );
    dialogRef.afterClosed().subscribe(value => {
      (value != 1) ? this.refreshTable() : null
      });
  }
  ngOnInit() {
  }

}
