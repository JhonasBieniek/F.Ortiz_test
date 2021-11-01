import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-cancelar-nota',
  templateUrl: './dialog-cancelar-nota.component.html',
  styleUrls: ['./dialog-cancelar-nota.component.css']
})
export class DialogCancelarNotaComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogCancelarNotaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){ 
    }

  fechar(): void { 
    this.dialogRef.close(false);
  }
  
  cancelar(){
    this.dialogRef.close(true);
  }


}
