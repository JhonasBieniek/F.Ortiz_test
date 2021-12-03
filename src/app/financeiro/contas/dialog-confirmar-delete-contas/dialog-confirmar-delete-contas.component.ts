import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-confirmar-delete-contas',
  templateUrl: './dialog-confirmar-delete-contas.component.html',
  styleUrls: ['./dialog-confirmar-delete-contas.component.css']
})
export class DialogConfirmarDeleteContasComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmarDeleteContasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){ 
    }

  Cancelar(): void { 
    this.dialogRef.close(false);
  }
  
  Deletar(){
    this.dialogRef.close(true);
  }

}
