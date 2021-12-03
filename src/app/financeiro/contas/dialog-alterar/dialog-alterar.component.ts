import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import moment from 'moment';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-dialog-alterar',
  templateUrl: './dialog-alterar.component.html',
  styleUrls: ['./dialog-alterar.component.css']
})
export class DialogAlterarComponent implements OnInit {

  public form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private clienteService: ClientService, public dialogRef: MatDialogRef<DialogAlterarComponent>,
  private notificationService: NotificationService, private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [null],
      tipo: [null],
      vendedor_id: [null],
      auxiliar_id: [null],
      representada_id: [null],
      mota_id: [null],
      parcela_id: [null],
      conta_id: [null],
      data_pagamento: [null, Validators.required],
      valor: [null,Validators.required],
      descritivo: [null],
      operacao: [null],
      status_pagamento: [false],
      obs: [null],
    });

    this.form.patchValue(data);
  }

  ngOnInit() {
  }

  onSubmit(){

    if(this.form.valid){

      this.form.get('data_pagamento').setValue(moment(this.form.get('data_pagamento').value).format("YYYY-MM-DD"));
      this.clienteService.editFinanceiro(this.form.value).subscribe((res: any) => {
        if (res.status == true) {
          this.notificationService.notify("Contas alterada com sucesso!");
          this.dialogRef.close();
          //this.criarForm();
        } else {
          this.notificationService.notify("Não foi possivel alterar a conta.");
        }
      },(err) => {
        //this.submit = false;
        this.notificationService.notify(err.message);
      });
    }else{
      this.form.markAllAsTouched();
    }
    
  }

  close(){
    this.dialogRef.close("close");
  }
}
