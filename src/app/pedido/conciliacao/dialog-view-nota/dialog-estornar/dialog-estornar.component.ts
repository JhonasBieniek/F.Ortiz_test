import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dialog-estornar',
  templateUrl: './dialog-estornar.component.html',
  styleUrls: ['./dialog-estornar.component.css']
})
export class DialogEstornarComponent implements OnInit {

  public form: FormGroup;

  rows: any = [];
  selected: any = [];

  isSelected

  @ViewChild(DialogEstornarComponent, { static: false }) table: DialogEstornarComponent;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogEstornarComponent>,
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
