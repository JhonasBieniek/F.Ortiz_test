import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyCargosComponent implements OnInit {

  public form: FormGroup;
  dados:any= "";
  dataAux;
  dataAux1;
  pageTitle:string = "";

  constructor(public dialogRef: MatDialogRef<DialogBodyCargosComponent>, 
                                @Inject(MAT_DIALOG_DATA) public data: any,
                                private fb: FormBuilder,
                                private clientservice: ClientService,
                                private notificationService: NotificationService
                                ){}
                              
  ngOnInit() {
    if(this.data != undefined){
      this.pageTitle = 'Editar Cargos'
      console.log(this.data)
      this.form = this.fb.group({
        id: this.data.id,
        nome: [this.data.nome, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      });
    }else{
      this.pageTitle = 'Cadastrar Cargos'
      this.form = this.fb.group({
        nome: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
        hideRequired: true,
        floatLabel: 'auto',
      });
    }
  }

  areaVendasSubmit() { 
    if(this.data != undefined){
      this.clientservice.updateCargo(this.form.value).subscribe( () =>{
        this.notificationService.notify("Atualizado com Sucesso!")
      })
    }else{
      this.clientservice.addCargo(this.form.value)   
    }
     
  }

  close() {
    this.dialogRef.close(
    );
  }

}
