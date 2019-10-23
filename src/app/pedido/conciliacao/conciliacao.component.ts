import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from '../../shared/services/client.service.component';
import { MatDialog } from '@angular/material';
 
@Component({
  selector: 'app-conciliacao',
  templateUrl: './conciliacao.component.html',
  styleUrls: ['./conciliacao.component.css']
})

export class ConciliacaoComponent implements OnInit {
  editing = {};
  rows = [];
  data: any =[];
  temp = [...this.data];
  
  loadingIndicator: boolean = true;
  reorderable: boolean = true;                           
       

  @ViewChild(ConciliacaoComponent) table: ConciliacaoComponent;
  constructor(private clientservice: ClientService, private dialog: MatDialog) {
      this.clientservice.getPedidos().subscribe(res =>{
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
    return d.num_pedido.toLowerCase().indexOf(val) !== -1 || !val ||
    d.cliente.nome_fantasia.toLowerCase().indexOf(val) !== -1 || !val ||
    d.representada.nome_fantasia.toLowerCase().indexOf(val) !== -1 || !val 
           
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


  ngOnInit() {
   
  }

}
