import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ClientService } from '../../shared/services/client.service.component';



@Component({
  selector: 'app-confirmar-delete',
  templateUrl: './confirmar-delete.component.html',
})
export class DialogConfirmarDeleteComponent {
  resposta:any;
  id: number;

  constructor(
    private clienteService: ClientService,
    public dialogRef: MatDialogRef<DialogConfirmarDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){ }

  Cancelar(): void { 
    this.dialogRef.close(1);
  }
  
  Deletar(){
    this.clienteService.delete('area-vendas', this.data.id)
    this.dialogRef.close();
      }
  }
  
  