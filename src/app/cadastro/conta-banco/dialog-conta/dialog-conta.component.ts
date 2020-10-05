import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';

@Component({
  selector: 'app-dialog-conta',
  templateUrl: './dialog-conta.component.html',
  styleUrls: ['./dialog-conta.component.css']
})
export class DialogContaComponent implements OnInit {

 
  public form: FormGroup;
  dados:any= "";
  dataAux;
  dataAux1;
  pageTitle:string = "";

  constructor(public dialogRef: MatDialogRef<DialogContaComponent>, 
                                @Inject(MAT_DIALOG_DATA) public data: any,
                                private fb: FormBuilder,
                                private clientservice: ClientService,
                                private notificationService: NotificationService
                                ){}
                              
  ngOnInit() {
    if(this.data != null){
      this.pageTitle = 'Editar Conta Bancária'
      console.log(this.data)
      this.form = this.fb.group({
        id: this.data.id,
        banco: [this.data.banco, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
        agencia: [this.data.agencia, Validators.compose([Validators.required])],
        conta: [this.data.conta, Validators.compose([Validators.required])],
      });
    }else{
      console.log(this.data)
      this.pageTitle = 'Cadastrar Conta Bancária'
      this.form = this.fb.group({
        banco: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
        agencia: [null, Validators.compose([Validators.required])],
        conta: [null, Validators.compose([Validators.required])],
      });
    }
  }

  areaVendasSubmit() { 
    if(this.data != undefined){
      this.clientservice.updateConta(this.form.value).subscribe( () =>{
        this.notificationService.notify("Atualizado com Sucesso!")
      })
    }else{
      this.clientservice.addConta(this.form.value)   
    } 
  }

  close() {
    this.dialogRef.close(
    );
  }

}
