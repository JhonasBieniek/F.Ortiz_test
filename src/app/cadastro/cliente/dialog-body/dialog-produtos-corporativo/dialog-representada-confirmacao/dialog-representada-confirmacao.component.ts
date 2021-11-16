import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-representada-confirmacao',
  templateUrl: './dialog-representada-confirmacao.component.html',
  styleUrls: ['./dialog-representada-confirmacao.component.css']
})
export class DialogRepresentadaConfirmacaoComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogRepresentadaConfirmacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){ 
      console.log(this.data)
    }

  cancelar(): void { 
    this.dialogRef.close(false);
  }
  
  alterar(){
    this.dialogRef.close(true);
  }

}
