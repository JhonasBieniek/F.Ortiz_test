import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog } from "@angular/material";
import { DialogBodyCondComerciaisComponent } from './dialog-body/dialog-body-condcomerciais.component';
import { ClientService } from '../../shared/services/client.service.component';


@Component({
  selector: 'app-condicoescomerciais',
  templateUrl: './condicoescomerciais.component.html',
  styleUrls: ['./condicoescomerciais.component.scss']
})
export class CondicoescomerciaisComponent implements OnInit {
  data:any = [];
  dados:any = [];
  editing = {};
  rows = [];
  temp = [...this.data];
  
  loadingIndicator: boolean = true;
  reorderable: boolean = true;                           

  columns = [
      { prop: 'id' },
      { prop: 'nome' },
      { prop: 'prazo' },
      { prop: 'dias' },

  ];       

  @ViewChild(CondicoescomerciaisComponent) table: CondicoescomerciaisComponent;
  constructor(private clientservice: ClientService, private dialog: MatDialog) {

    this.clientservice.getCondComerciais().subscribe(res =>{
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
    if( d.prazo.toLowerCase().indexOf(val) !== -1 || !val || d.nome.toLowerCase().indexOf(val) !== -1 || !val  )
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
      maxHeight: '75vh',
    
      width: '75vw',
      height: '45vh'
    }
    //dialogConfig.data = this.dados.data;
    let dialogRef = this.dialog.open(
      DialogBodyCondComerciaisComponent, 
      dialogConfig, 
    
  );
    dialogRef.afterClosed().subscribe(value => {
        this.refreshTable();
        console.log(`Dialog sent: ${value}`); 
      });
  }

  refreshTable(){
    this.clientservice.getCondComerciais().subscribe(res =>{
      this.dados = res;
      this.rows = this.dados.data;
      this.temp = [...this.dados.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
      });
      console.log("Rodei")
  }


  ngOnInit() {
   
  }

}