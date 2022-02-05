import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ClientService } from '../../shared/services/client.service.component';


//declare var require: any;
//const data: any = require('assets/company.json');
@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {

  data:any = [];
  data2:any = [];
  editing = {};
  rows = [];
  rows2 = [];
  temp = [...this.data];
  temp2 = [...this.data2];
  
  loadingIndicator: boolean = true;
  reorderable: boolean = true;                           

  columns = [
      { prop: 'id' },
      { prop: 'razao_social' },
      { prop: 'nome_fantasia' },
      { prop: 'cnpj' },
      { prop: 'representante' },

  ];       
  columns2 = [
      { prop: 'id' },
      { prop: 'razao_social' },
      { prop: 'nome_fantasia' },
      { prop: 'cnpj' },
      { prop: 'representante' },

  ];       

  @ViewChild(ListarComponent, {static: false}) table: ListarComponent;
  constructor(private clientservice: ClientService) {

    this.clientservice.getRepresentadas().subscribe(
      res =>{
      this.data = res;
      this.rows = this.data.data;
      this.temp = [...this.data.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500); 
    },
    (erro: any) => console.log('Erro', erro)); 

    this.clientservice.getClientes().subscribe(
      res =>{
      this.data2 = res;
      this.rows2 = this.data2.data;
      this.temp2 = [...this.data2.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500); 
    },
    (erro: any) => console.log('Erro', erro));                                  
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
  this.editing[rowIndex + '-' + cell] = false;
  this.rows[rowIndex][cell] = event.target.value;
  this.rows = [...this.rows];
  }


  ngOnInit() {
   
  }

}