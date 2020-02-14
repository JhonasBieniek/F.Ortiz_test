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
export class DialogBodyUnidadesComponent implements OnInit {

  public form: FormGroup;
  pageTitle:string = "";

  constructor(public dialogRef: MatDialogRef<DialogBodyUnidadesComponent>, 
                                @Inject(MAT_DIALOG_DATA) public data: any,
                                private fb: FormBuilder,
                                private clientservice: ClientService,
                                private notificationService: NotificationService
                                ){

                                }
                              
  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      sigla: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      descricao: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      status: [true, Validators.required],
      hideRequired: true,
      floatLabel: 'auto',
    });
    if(this.data == null)
    this.pageTitle = 'Cadastrar unidade'
    else{
      this.pageTitle = 'Editar unidade'
      this.form.patchValue(this.data)
    }
  }

  areaVendasSubmit() { 
    if(this.data == null)
    this.clientservice.addUnidades(this.form.value)  
    else
    this.clientservice.updateUnidade(this.form.value).subscribe( () =>{
      this.notificationService.notify("Atualizado com Sucesso!")
    })
  }

  close() {
    this.dialogRef.close(
    );
  }

}
