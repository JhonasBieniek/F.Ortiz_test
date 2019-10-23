import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-dialog-body-fornecedor',
  templateUrl: './dialog-body-fornecedor.component.html',
  styleUrls: ['./dialog-body-fornecedor.component.css']
})
export class DialogBodyFornecedorComponent implements OnInit {

  public form: FormGroup;
  cep: any;
  modelCidade: any;
  modelEstado: any;

  constructor(private fb: FormBuilder, 
              private clientservice: ClientService,
              private notificationService: NotificationService
              ) {
   
  }
  ngOnInit() {  
    this.form = this.fb.group({
      fname: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      rsocial: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      cnpj: [null, Validators.compose([Validators.required, CustomValidators.digits])],
      ie: [null, Validators.compose([Validators.required, CustomValidators.digits])],
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      cep: [null, Validators.compose([Validators.required, CustomValidators.number])],
      logradouro: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      numero: [null, Validators.compose([Validators.required, CustomValidators.number])],
      complemento: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      bairro: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      cidade: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      estado: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      phonepj: [null, Validators.compose([Validators.required, CustomValidators.phone('IN')])],
      phonepj2: [null, Validators.compose([Validators.required, CustomValidators.phone('IN')])],
      representante: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      observacao: [null, Validators.compose([Validators.maxLength(100)])],
      active: [null, Validators.required],


    });
  }

  onBlurMethod(){
    this.clientservice.getCep(this.form.value.cep).subscribe( res => {
      this.cep = res
        if(this.cep.data != 'error'){
          this.notificationService.notify(`Cep inserido com sucesso!`)
          this.modelCidade = this.cep.data.city.nome
          this.modelEstado = this.cep.data.state.nome
        }else{
          this.notificationService.notify(`Cep Inválido`)
      }
    })

}
  hide = true;
}