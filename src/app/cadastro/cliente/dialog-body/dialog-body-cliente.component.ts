import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, FormArray } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';
import { CustomValidators } from 'ng2-validation';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-body-cliente',
  templateUrl: './dialog-body-cliente.component.html',
  styleUrls: ['./dialog-body-cliente.component.css']
})
export class DialogBodyClienteComponent implements OnInit {

  public form: FormGroup;
  cep: any;
  modelCidade: any;
  modelEstado: any;
  modelBairro
  modelLogradouro
  dados: any = [];
  areas: any=[];
  ramos: any=[];
  pageTitle:string = 'Cadastrar Cliente';

  constructor(private fb: FormBuilder, 
              private clientservice: ClientService,
              public dialogRef: MatDialogRef<DialogBodyClienteComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              private notificationService: NotificationService
              ) {
                if(data != null){
                  if(data.action != 'edit'){
                    this.chargeCnpj(data);
                  }else{
                    this.pageTitle = 'Editar Cliente';
                    this.clientservice.getClientesId(data.id).subscribe((res:any) => {
                      this.addEnderecos(res.data.enderecos);
                      this.form.patchValue(res.data);
                    })
                  }
                }
                this.clientservice.getAreaVenda().subscribe((res:any) =>{
                  this.areas = res.data; 
                });
                this.clientservice.getRamos().subscribe((res:any) =>{
                  this.ramos = res.data; 
                });
  }

  ngOnInit() {  
    this.form = this.fb.group({
      id: [null],
      razao_social: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      nome_fantasia: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      cnpj: [null, Validators.compose([Validators.required, Validators.minLength(14), Validators.maxLength(14)])],
      inscricao_estadual: [null, Validators.compose([CustomValidators.digits])],
      email: [null, Validators.compose([CustomValidators.email])],
      telefone: [null],
      celular: [null],
      representante: [null, Validators.compose([Validators.minLength(5), Validators.maxLength(50)])],
      area_venda_id: [null, Validators.compose([Validators.required])],
      ramo_atividade_id: [null],
      obs: [null, Validators.compose([Validators.maxLength(100)])],
      status: true,
      enderecos:this.fb.array([])
    });
  }

  addEndereco (data:any = null ){
    const endereco = this.form.controls.enderecos as FormArray;
    endereco.push(this.fb.group({
      id: data?data.id:null,
      cep: data?data.cep:null,
      logradouro: data?data.logradouro:null,
      numero: data?data.numero:null,
      complemento: data?data.complemento:null,
      bairro: data?data.bairro:null,
      cidade: data?data.cidade:null,
      estado: data?data.estado:null,  
      pais: 'Brasil',  
    }))
  }

  delEndereco(index){
    const endereco = this.form.controls.enderecos as FormArray;
    endereco.removeAt(index);
  }

  addEnderecos(data:any){
    data.forEach( async (e:any) => {
      await this.addEndereco(e);
    })
  }

  chargeForm(data) { 
    this.form.get('razao_social').setValue(data.nome);
    this.form.get('nome_fantasia').setValue(data.fantasia);
    this.form.get('email').setValue(data.email);
    this.form.get('telefone').setValue(this.removeSpecialChar(data.telefone.split("/")[0]));
    this.form.get('celular').setValue(this.addDigitsNumber(this.removeSpecialChar(data.telefone.split("/")[1])));
    let endereco = {
      cep: this.removeSpecialChar(data.cep),
      logradouro: data.logradouro,
      numero: data.numero,
      complemnto: data.complemento,
      bairro: data.bairro,
      cidade: data.municipio,
      estado: data.uf
    };
    this.addEndereco(endereco);
  }
  
  removeSpecialChar(data) {
    return data.toString().replace(/\D+/g, '');
  }

  addDigitsNumber(cell){
    if(cell.length == 10){
      return cell.substr(0, 2) + "9" + cell.substr(2);
    }
  }

  onBlurMethod(index){
    const enderecos = this.form.controls.enderecos as FormArray;
    if( enderecos.at(index).get('cep').value != null && enderecos.at(index).get('cep').value.length == 8 ){
      this.clientservice.getCep(enderecos.at(index).get('cep').value).subscribe( res => {
        this.cep = res
        if(this.cep.data != 'error'){
        this.notificationService.notify(`Cep inserido com sucesso!`)
        enderecos.at(index).get('cidade').setValue(this.cep.data.cidade);
        enderecos.at(index).get('estado').setValue(this.cep.data.estado);
        enderecos.at(index).get('logradouro').setValue(this.cep.data.logradouro);
        enderecos.at(index).get('bairro').setValue(this.cep.data.bairro);
      }else{
        this.notificationService.notify(`Cep Inválido`)
       }
      })
    }
  }

  onBlurCnpj(){
    if(this.data == null){
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
  }

  chargeCnpj(data){
    this.clientservice.getApiCnpj(data).subscribe((res:any) => {
      if(res.status != 'ERROR'){
        this.chargeForm(res);
      }else{
        this.notificationService.notify(`Cnpj Inválido`)
      }
    });
  }
  close() {
    this.dialogRef.close();
  }

  onSubmit(){

    if(this.data != undefined){
      this.clientservice.updateCliente(this.form.value).subscribe( () =>{
        this.notificationService.notify("Atualizado com Sucesso!")
      })
    }else{
      this.clientservice.addCliente(this.form.value).subscribe((res:any) =>{
        if(res.status == 'success'){
          this.notificationService.notify(`Cadastro Efetuado com Sucesso!`)
        }else{
          this.notificationService.notify(`Erro contate o Administrador`)
        }}
      );
    } 
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

  hide = true;
}
