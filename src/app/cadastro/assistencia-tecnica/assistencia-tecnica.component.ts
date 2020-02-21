import { Component, OnInit, ViewChild } from '@angular/core';

import { ClientService } from '../../shared/services/client.service.component';

@Component({
  selector: 'app-assistencia-tecnica',
  templateUrl: './assistencia-tecnica.component.html',
  styleUrls: ['./assistencia-tecnica.component.scss']
})
export class AssistenciaTecnicaComponent implements OnInit {
  data:any = [];
  editing = {};
  rows = [];
  temp = [...this.data];
  
  loadingIndicator: boolean = true;
  reorderable: boolean = true;                           

  columns = [
      { prop: 'Nome' },
      

  ];       

  @ViewChild(AssistenciaTecnicaComponent, {static: false}) table: AssistenciaTecnicaComponent;
  constructor(private clientservice: ClientService) {

    this.clientservice.getClientes().subscribe(res =>{
      this.data = res;
      this.rows = this.data;
      this.temp = [...this.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500); 
    });                                  
  }
  
  updateFilter(event) {
  const val = event.target.value.toLowerCase();
      
  // filter our data
  const temp = this.temp.filter(function(d) {
    if( d.cpf.toLowerCase().indexOf(val) !== -1 || !val || d.nome.toLowerCase().indexOf(val) !== -1 || !val  )
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


  ngOnInit() {
   
  }

}