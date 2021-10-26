import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-dialog-delete-nota',
  templateUrl: './dialog-delete-nota.component.html',
  styleUrls: ['./dialog-delete-nota.component.css']
})
export class DialogDeleteNotaComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteNotaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){ 
    }

  Cancelar(): void { 
    this.dialogRef.close(false);
  }
  
  Deletar(){
    this.dialogRef.close(true);
  }

}
