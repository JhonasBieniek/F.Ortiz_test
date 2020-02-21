import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

declare var require: any;
const data: any = require('assets/company.json');
@Component({
  selector: 'app-tipo-preco',
  templateUrl: './tipo-preco.component.html',
  styleUrls: ['./tipo-preco.component.scss']
})
export class TipoPrecoComponent implements OnInit {

  public form: FormGroup;

  editing = {};
  rows = [];
  temp = [...data];
  
  loadingIndicator: boolean = true;
  reorderable: boolean = true;                           

  columns = [
      { prop: 'Tipo de preço' },
      { name: 'Ações' } 
  ];       

  @ViewChild(TipoPrecoComponent, {static: false}) table: TipoPrecoComponent;
  constructor(private fb: FormBuilder) {
      this.rows = data;
      this.temp = [...data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500);                                   
  }
  
  updateFilter(event) {
  const val = event.target.value.toLowerCase();
      
  // filter our data
  const temp = this.temp.filter(function(d) {
    return d.name.toLowerCase().indexOf(val) !== -1 || !val;
  }); 
  // update the rows
  this.rows = temp;
  // Whenever the filter changes, always go back to the first page
  this.table = data;
  }
  updateValue(event, cell, rowIndex) {    
  console.log('inline editing rowIndex', rowIndex)
  this.editing[rowIndex + '-' + cell] = false;
  this.rows[rowIndex][cell] = event.target.value;
  this.rows = [...this.rows];
  console.log('UPDATED!', this.rows[rowIndex][cell]);
  }


  ngOnInit() {
    this.form = this.fb.group({
      fname: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      fname2: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
    });
   
  }

}
