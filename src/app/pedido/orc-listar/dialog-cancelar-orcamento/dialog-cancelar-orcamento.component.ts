import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-cancelar-orcamento',
  templateUrl: './dialog-cancelar-orcamento.component.html',
  styleUrls: ['./dialog-cancelar-orcamento.component.css']
})
export class DialogCancelarOrcamentoComponent{

  constructor(
    public dialogRef: MatDialogRef<DialogCancelarOrcamentoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){ 
    }

  fechar(): void { 
    this.dialogRef.close(false);
  }
  
  cancelar(){
    this.dialogRef.close(true);
  }

}
