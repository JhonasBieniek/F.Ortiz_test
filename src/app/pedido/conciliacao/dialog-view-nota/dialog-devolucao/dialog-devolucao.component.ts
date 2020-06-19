import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dialog-devolucao',
  templateUrl: './dialog-devolucao.component.html',
  styleUrls: ['./dialog-devolucao.component.css']
})
export class DialogDevolucaoComponent implements OnInit {

  public form: FormGroup;

  rows: any = [];
  selected: any = [];

  isSelected

  @ViewChild(DialogDevolucaoComponent, { static: false }) table: DialogDevolucaoComponent;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogDevolucaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    setTimeout(() => this.rows = this.data.nota_parcelas.filter(e => 
      e.status_recebimento == true), 300) 

    console.log(this.data)
    this.form = this.fb.group({
      obs: null,
    });
  }
  close(){
    this.dialogRef.close();
  }


}