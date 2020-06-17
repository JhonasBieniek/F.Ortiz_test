import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-estornar',
  templateUrl: './dialog-estornar.component.html',
  styleUrls: ['./dialog-estornar.component.css']
})
export class DialogEstornarComponent implements OnInit {

  rows:any = [];

  editing = {};
  selected:any = [];

  itemSelected

  columns = [{ prop: 'parcela', name: 'Núm parcela', width: "200" }, 
             { prop: 'data_vencimento',name: 'Data Vencimento',width: "300" }, 
             { prop: 'valor',name: 'Valor', width: "200"},
             { name: 'Estornado', width: "400"}]

@ViewChild(DialogEstornarComponent, {static: false}) table: DialogEstornarComponent;
  constructor(
    public dialogRef: MatDialogRef<DialogEstornarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.rows = this.data.nota_parcelas
   }

  ngOnInit() {
    console.log(this.data)
  }

}
