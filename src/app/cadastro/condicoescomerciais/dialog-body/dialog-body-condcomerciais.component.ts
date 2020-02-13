import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';

@Component({
  selector: 'app-dialog-body-condcomerciais',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyCondComerciaisComponent implements OnInit {

  public form: FormGroup;
  dados:any= "";
  pageTitle:string = "";
  

  constructor(public dialogRef: MatDialogRef<DialogBodyCondComerciaisComponent>, 
                                @Inject(MAT_DIALOG_DATA) public data: any,
                                private fb: FormBuilder,
                                private clientservice: ClientService,
                                private notificationService: NotificationService
                                ){}
                              
  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      nome: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      prazo: [null, Validators.compose([Validators.required ])],
      dias: [null, Validators.compose([Validators.required ])],
    });
    if(this.data == null){
      this.pageTitle = 'Cadastrar Condição Comercial'
    }else{
      this.pageTitle = 'Editar Condição Comercial'
      this.chargeForm();
    }
  }

  private chargeForm(){
    this.form.patchValue(this.data)
  }

  regioesSubmit() {
    if(this.data != undefined){
      this.clientservice.updateCondComerciais(this.form.value).subscribe( () =>{
        this.notificationService.notify("Atualizado com Sucesso!")
      })
    }else{
      this.clientservice.addCondComerciais(this.form.value)  
    }
  }

  close() {
    this.dialogRef.close();
  }

}
