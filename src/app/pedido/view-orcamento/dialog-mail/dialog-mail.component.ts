import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-mail',
  templateUrl: './dialog-mail.component.html',
  styleUrls: ['./dialog-mail.component.css']
})
export class DialogMailComponent implements OnInit {

  public form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogMailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder){ 
    }

    ngOnInit() {
      this.form = this.fb.group({
        cc: [''],
        mensagem: ['']
      });
    }

  Cancelar(): void { 
    this.dialogRef.close(null);
  }
  
  enviar(){
    this.dialogRef.close(this.form.value);
  }

}
