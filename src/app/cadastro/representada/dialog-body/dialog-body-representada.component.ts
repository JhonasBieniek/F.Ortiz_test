import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { FormBuilder, FormGroup, Validators, ValidationErrors} from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-dialog-body-representada',
  templateUrl: './dialog-body-representada.component.html',
  styleUrls: ['./dialog-body-representada.component.css']
})
export class DialogBodyRepresentadaComponent implements OnInit {

  public form: FormGroup;
  cep: any;
  modelCidade: any;
  modelEstado: any;
  modelBairro
  modelLogradouro

  constructor(public dialogRef: MatDialogRef<DialogBodyRepresentadaComponent>,
              private fb: FormBuilder, 
              private clientservice: ClientService,
              private notificationService: NotificationService
              ) {
   
  }
  ngOnInit() {  
    this.form = this.fb.group({
      razao_social: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      nome_fantasia: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      cnpj: [null, Validators.compose([Validators.required, Validators.minLength(14), Validators.maxLength(14)])],
      inscricao_estadual: [null, Validators.compose([CustomValidators.digits])],
      email: [null, Validators.compose([CustomValidators.email])],
      telefone: [null, Validators.compose([CustomValidators.phone('IN')])],
      celular: [null, Validators.compose([CustomValidators.phone('IN')])],
      representante: [null, Validators.compose([Validators.minLength(5), Validators.maxLength(50)])],
      obs: [null, Validators.compose([Validators.maxLength(100)])],
      status: [true],
      endereco: this.fb.group({
        cep: [null, Validators.compose([CustomValidators.number])],
        logradouro: [null, Validators.compose([Validators.minLength(5), Validators.maxLength(50)])],
        numero: [null, Validators.compose([CustomValidators.number])],
        complemento: [null, Validators.compose([Validators.minLength(5), Validators.maxLength(50)])],
        bairro: [null, Validators.compose([Validators.minLength(2), Validators.maxLength(50)])],
        cidade: [null, Validators.compose([Validators.minLength(2), Validators.maxLength(50)])],
        estado: [null, Validators.compose([Validators.minLength(2), Validators.maxLength(50)])],  
      })
    });
  }


  onBlurMethod(){
    if(this.form.get('endereco.cep').value != null){
      this.clientservice.getCep(this.form.get('endereco.cep').value).subscribe( res => {
        this.cep = res
        if(this.cep.data != 'error'){
        this.notificationService.notify(`Cep inserido com sucesso!`)
        this.form.get('endereco.cidade').setValue(this.cep.data.cidade);
        this.form.get('endereco.estado').setValue(this.cep.data.estado);
        this.form.get('endereco.logradouro').setValue(this.cep.data.logradouro);
        this.form.get('endereco.bairro').setValue(this.cep.data.bairro);
      }else{
        this.notificationService.notify(`Cep Inválido`)
       }
      })
    }
  }


  onBlurCnpj(){
    if(this.form.get('cnpj').value != null){
      this.clientservice.getApiCnpj(this.form.get('cnpj').value).subscribe((res:any) => {
        if(res.status != 'ERROR'){
          this.chargeForm(res);
        }else{
          this.notificationService.notify(`Cnpj Inválido`)
        }
      });
    } 
  }

  chargeForm(data) { 
    this.form.get('razao_social').setValue(data.nome);
    this.form.get('nome_fantasia').setValue(data.fantasia);
    this.form.get('email').setValue(data.email);
    this.form.get('telefone').setValue(this.removeSpecialChar(data.telefone.split("/")[0]));
    this.form.get('celular').setValue(this.addDigitsNumber(this.removeSpecialChar(data.telefone.split("/")[1])));
    this.form.get('endereco.cep').setValue(this.removeSpecialChar(data.cep));
    this.form.get('endereco.logradouro').setValue(data.logradouro);
    this.form.get('endereco.numero').setValue(data.numero);
    this.form.get('endereco.complemento').setValue(data.complemento);
    this.form.get('endereco.bairro').setValue(data.bairro);
    this.form.get('endereco.cidade').setValue(data.municipio);
    this.form.get('endereco.estado').setValue(data.uf);
  }
  
  removeSpecialChar(data) {
    return data.toString().replace(/\D+/g, '');
  }

  addDigitsNumber(cell){
    if(cell.length == 10){
      return cell.substr(0, 2) + "9" + cell.substr(2);
    }
  }

  onSubmit(){
    this.clientservice.addRepresenta(this.form.value).subscribe((res:any) =>{
      if(res.success == true){
        this.notificationService.notify(`Cadastro Efetuado com Sucesso!`)
      }else{
        this.notificationService.notify(`Erro contate o Administrador`)
      }}
    );
  }

  getFormValidationErrors() {
    const result = [];
    Object.keys(this.form.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.form.get(key).errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          result.push({
            'control': key,
            'error': keyError,
            'value': controlErrors[keyError]
          });
        });
      }
    });
    console.log(result);
  }

  close() {
    this.dialogRef.close();
  }

  hide = true;
}
