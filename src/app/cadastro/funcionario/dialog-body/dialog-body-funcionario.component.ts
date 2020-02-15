import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';
import { CustomValidators } from 'ng2-validation';
import { DatePipe } from '@angular/common';
import { MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-dialog-body-funcionario',
  templateUrl: './dialog-body-funcionario.component.html',
  styleUrls: ['./dialog-body-funcionario.component.css']
})
export class DialogBodyFuncionarioComponent implements OnInit {

  grupos;
  cargos;
  funcionario: FormGroup;
  usuario: FormGroup;
  isLinear: boolean = true

  isOn = true;
  isOn2 = false;


  constructor(
    public dialogRef: MatDialogRef<DialogBodyFuncionarioComponent>,
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private datePipe : DatePipe
  ){ 
    this.clientservice.getGrupos().subscribe((res:any) =>{
      this.grupos = res.data;
    });
    this.clientservice.getCargos().subscribe((res:any) =>{
      this.cargos = res.data;
    });            
  }    
  ngOnInit() {
    this.funcionario = this.fb.group({
      nome: [null, Validators.compose([Validators.required])],
      cpf: [null, Validators.compose([Validators.required])],
      rg: [null],
      oe: [null],
      sexo: [null],
      nascimento: [null],
      celular: [null],
      telefone: [null],
      cargo_id: [null, Validators.compose([Validators.required])],
      status: [true],
      endereco: this.fb.group({
        cep: [null, Validators.compose([Validators.required, CustomValidators.number])],
        logradouro: [null],
        numero: [null],
        complemento: [null],
        bairro: [null],
        cidade: [null],
        estado: [null],
        pais: ['Brasil']
      })
    });
    this.usuario = this.fb.group({
      email: [null, Validators.compose([Validators.required])],
      senha: [null, Validators.compose([Validators.required])],
      grupo_id: [null, Validators.compose([Validators.required])],
      status: [null, Validators.compose([Validators.required])],
    });
  }
  removeSpecialChar(data) {
    return data.toString().replace(/\D+/g, '');
  }
  chargeCep(){
    let cep = this.funcionario.get('endereco.cep').value;
    if(cep != null && cep.length == 8){
      this.clientservice.getCep(cep).subscribe((res:any) => {
        if(res.data != 'error'){
        this.notificationService.notify(`Cep inserido com sucesso!`)
        this.funcionario.get('endereco.cidade').setValue(res.data.cidade);
        this.funcionario.get('endereco.estado').setValue(res.data.estado);
        this.funcionario.get('endereco.logradouro').setValue(res.data.logradouro);
        this.funcionario.get('endereco.bairro').setValue(res.data.bairro);
      }else{
        this.notificationService.notify(`Cep Inválido`)
       }
      })
    }
  }
  onSubmit(){
    let data = this.funcionario.value;
    data.nascimento = this.datePipe.transform(data.nascimento, 'yyyy-MM-dd');
    if(this.isOn == true){
      data.usuario = this.usuario.value;
    }
    this.clientservice.addFuncionario(data).subscribe((res:any) => {
      if(res.success == true){
        this.notificationService.notify(`Cadastro Efetuado com Sucesso!`)
      }else{
        this.notificationService.notify(`Erro contate o Administrador`)
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
  
  getFormValidationErrors() {
    const result = [];
    Object.keys(this.funcionario.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.funcionario.get(key).errors;
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

}