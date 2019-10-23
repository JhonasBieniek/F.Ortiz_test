import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';
import { CustomValidators } from 'ng2-validation';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-body-cliente',
  templateUrl: './dialog-body-cliente.component.html',
  styleUrls: ['./dialog-body-cliente.component.css']
})
export class DialogClienteAddComponent implements OnInit {

  public form: FormGroup;
  cep: any;
  modelCidade: any;
  modelEstado: any;
  modelBairro
  modelLogradouro
  dados: any = [];
  resposta: any;
  areas: any = [];
  ramos: any = [];

  constructor(public dialogRef: MatDialogRef<DialogClienteAddComponent>,
    private fb: FormBuilder,
    private clientservice: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService
  ) {
    if (data != null) {
      this.chargeCnpj(data)
    }
    this.clientservice.getAreaVenda().subscribe((res: any) => {
      this.areas = res.data;
    });
    this.clientservice.getRamos().subscribe((res: any) => {
      this.ramos = res.data;
    });
    dialogRef.disableClose = true;
  }
  ngOnInit() {
    this.form = this.fb.group({
      fname: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
      rsocial: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
      cnpj: [null, Validators.compose([Validators.required])],
      ie: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      cep: [null, Validators.compose([Validators.required, CustomValidators.number])],
      logradouro: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      numero: [null, Validators.compose([Validators.required, CustomValidators.number])],
      complemento: [null, Validators.compose([Validators.minLength(5), Validators.maxLength(50)])],
      bairro: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      cidade: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      estado: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      phonepj: [null, Validators.compose([Validators.required])],
      phonepj2: [null, Validators.compose([CustomValidators.phone('IN')])],
      representante: [null, Validators.compose([Validators.minLength(5), Validators.maxLength(50)])],
      observacao: [null, Validators.compose([Validators.maxLength(100)])],
      active: [1, Validators.required],
      area: [null, Validators.required],
      ramo: [null, Validators.required],
      hideRequired: true,
      floatLabel: 'auto',
    });
  }
  chargeForm(data) {
    this.form = this.fb.group({
      fname: [data.fantasia, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
      rsocial: [data.nome, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
      ie: [null, Validators.compose([Validators.required])],
      cnpj: [data.cnpj, Validators.compose([Validators.required])],
      email: [data.email, Validators.compose([Validators.required, CustomValidators.email])],
      cep: [data.cep, Validators.compose([Validators.required, CustomValidators.numbers])],
      logradouro: [data.logradouro, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      numero: [data.numero, Validators.compose([Validators.required, CustomValidators.number])],
      complemento: [data.complemento, Validators.compose([Validators.minLength(5), Validators.maxLength(50)])],
      bairro: [data.bairro, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      cidade: [data.municipio, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      estado: [data.uf, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(10)])],
      phonepj: [data.telefone.split("/")[0], Validators.compose([Validators.required])],
      phonepj2: [data.telefone.split("/")[1], Validators.compose([CustomValidators.phone('IN')])],
      representante: [null, Validators.compose([Validators.minLength(5), Validators.maxLength(50)])],
      observacao: [null, Validators.compose([Validators.maxLength(100)])],
      active: [1, Validators.required],
      area: [null, Validators.required],
      ramo: [null, Validators.required],
      hideRequired: true,
      floatLabel: 'auto',
    });
  }

  onBlurMethod() {
    this.clientservice.getCep(this.form.value.cep).subscribe(res => {
      this.cep = res
      if (this.cep.data != 'error') {
        this.notificationService.notify(`Cep inserido com sucesso!`)
        this.modelCidade = this.cep.data.cidade
        this.modelEstado = this.cep.data.estado
        this.modelLogradouro = this.cep.data.logradouro
        this.modelBairro = this.cep.data.bairro
      } else {
        this.notificationService.notify(`Cep Inválido`)
      }
    })
  }

  // onBlurCnpj(){
  //   if(this.form.value.cnpj != null){
  //     this.clientservice.getApiCnpj(this.form.value.cnpj).subscribe((res:any) => {
  //       if(res.status != 'ERROR'){
  //         this.chargeForm(res);
  //       }else{
  //         this.notificationService.notify(`Cnpj Inválido`)
  //       }
  //     });
  //   } 
  // }

  chargeCnpj(data) {
    this.clientservice.getApiCnpj(data).subscribe((res: any) => {
      if (res.status != 'ERROR') {
        this.chargeForm(res);
      } else {
        this.notificationService.notify(`Cnpj Inválido`)
      }
    });
  }
  close(data) {
    this.dialogRef.close(data);
  }
  
  addCliente() {
    this.dados = {
      razao_social: this.form.value.rsocial,
      nome_fantasia: this.form.value.fname,
      cnpj: this.form.value.cnpj.toString().replace(/[^0-9]+/g, ''),
      inscricao_estadual: this.form.value.ie,
      email: this.form.value.email,
      telefone: this.form.value.phonepj.toString().replace(/[^0-9]+/g, ''),
      celular: this.form.value.phonepj2 != null ? this.form.value.phonepj2.toString().replace(/[^0-9]+/g, '') : null,
      status: this.form.value.active,
      representante: this.form.value.representante,
      area_venda_id: this.form.value.area,
      ramo_atividade_id: this.form.value.ramo,
      obs: this.form.value.observacao,
      enderecos: {
        cep: this.form.value.cep.toString().replace(/[^0-9]+/g, ''),
        logradouro: this.form.value.logradouro,
        numero: this.form.value.numero,
        bairro: this.form.value.bairro,
        complemento: this.form.value.complemento,
        cidade: this.form.value.cidade,
        estado: this.form.value.estado,
        pais: "Brasil",
      }
    }
    console.log(this.dados)
    this.clientservice.addCliente(this.dados).subscribe((res: any) => {
      if (res.status == 'success') {
        this.notificationService.notify(`Cadastro Efetuado com Sucesso!`)
        setTimeout(() => {
          this.close(res.data);
        }, 1000);
      } else {
        this.notificationService.notify(`Erro contate o Administrador`)
      }
    }
    );
  }
  hide = true;
}
