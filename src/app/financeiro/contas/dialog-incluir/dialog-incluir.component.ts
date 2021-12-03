import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import moment from 'moment';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-dialog-incluir',
  templateUrl: './dialog-incluir.component.html',
  styleUrls: ['./dialog-incluir.component.css'],
  encapsulation : ViewEncapsulation.None
})
export class DialogIncluirComponent implements OnInit {

  public form: FormGroup;

  constructor(private clienteService: ClientService, public dialogRef: MatDialogRef<DialogIncluirComponent>,
  private notificationService: NotificationService, private fb: FormBuilder) {
    this.form = this.fb.group({
      tipo: ['saida'],
      data_pagamento: [null, Validators.required],
      valor: [0],
      descritivo: [null, Validators.required],
      operacao: ['lancamento manual'],
      status_pagamento: [false],
      obs: [null],
      lancamento: ['unico'],
      multiplos: [null]
    });    
  }

  ngOnInit() {
  }

  onSubmit(){
    if(this.form.valid){
      if(this.form.controls['lancamento'].value == "multiplos"){
        if(this.form.controls['multiplos'].value > 1){
          var vencimentoInicial: Date = new Date( this.form.controls['data_pagamento'].value);
          var contas = [];
          for(let i = 0; i < this.form.controls['multiplos'].value; i++){
            var vencimento: Date = new Date(vencimentoInicial);
            if(i>0){
              vencimento.setMonth(vencimento.getMonth() + i);
              if(vencimentoInicial.getDate() != vencimento.getDate()){
                vencimento.setFullYear(vencimento.getFullYear(), vencimento.getMonth(), 0);
              }
            }
            var conta = {
              tipo: this.form.get('tipo').value,
              data_pagamento : moment(vencimento).format("YYYY-MM-DD"),
              status_pagamento : this.form.get('status_pagamento').value,
              valor: this.form.get('valor').value,
              descritivo: this.form.get('descritivo').value,
              operacao: this.form.get('operacao').value,
              obs: this.form.get('obs').value,
            }
            contas.push(conta);
          }
          this.clienteService.addContasAvulsas(contas).subscribe((user: any) => {
            if (user.data.status == true) {
              this.notificationService.notify("Contas Cadastrada com sucesso!");
              this.dialogRef.close();
              //this.criarForm();
            } else {
              this.notificationService.notify("informe ao administrador o erro informado diferente do padrão.");
            }
          },(err) => {
            //this.submit = false;
            this.notificationService.notify(err.message);
            console.log(err)
          });
        }else{
          this.notificationService.notify("É preciso informar a quantidade de meses a ser lançado !");
        }
      }else{

        var contas = [];
        var conta = {
          tipo: this.form.get('tipo').value,
          data_pagamento : moment(this.form.get('data_pagamento').value).format("YYYY-MM-DD"),
          status_pagamento : this.form.get('status_pagamento').value,
          valor: this.form.get('valor').value,
          descritivo: this.form.get('descritivo').value,
          operacao: this.form.get('operacao').value,
          obs: this.form.get('obs').value,
        }
        contas.push(conta);
        this.clienteService.addContasAvulsas(contas).subscribe((user: any) => {
          if (user.data.status == true) {
            this.notificationService.notify("Conta Cadastrada com sucesso!");
            this.dialogRef.close();
            //this.criarForm();
          } else {
            this.notificationService.notify("informe ao administrador o erro informado diferente do padrão.");
          }
        },(err) => {
          //this.submit = false;
          this.notificationService.notify(err.message);
          console.log(err)
        });
      }
    }else{
      this.form.markAllAsTouched();
    }
  }

  close(){
    this.dialogRef.close("close");
  }

}
