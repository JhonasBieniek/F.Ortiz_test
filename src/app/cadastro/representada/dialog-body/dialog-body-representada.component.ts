import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { FormBuilder, FormGroup, Validators, ValidationErrors} from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';
import { CustomValidators } from 'ng2-validation';
import { AlertComponent } from '../../../alert/alert.component';


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
  modelBairro;
  modelLogradouro;
  pageTitle:string = "";
  bancos: any=[];


  constructor(public dialogRef: MatDialogRef<DialogBodyRepresentadaComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder, 
              private clientservice: ClientService,
              private notificationService: NotificationService,
              private dialog: MatDialog
              ) {
              this.clientservice.getContas().subscribe((res:any) =>{
                this.bancos = res.data; 
              });
  }
  ngOnInit() {  
    this.form = this.fb.group({
      id: [null],
      razao_social: [null, Validators.compose([Validators.required])],
      nome_fantasia: [null, Validators.compose([Validators.required])],
      cnpj: [null, Validators.compose([Validators.required])],
      inscricao_estadual: [null, Validators.compose([CustomValidators.digits])],
      email: [null],
      telefone: [null],
      celular: [null],
      representante: [null],
      obs: [null, Validators.compose([Validators.maxLength(100)])],
      status: [true],
      conta_id: null,
      comissao_padrao: [null],
      endereco: this.fb.group({
        cep: [null],
        logradouro: [null],
        numero: [null],
        complemento: [null],
        bairro: [null],
        cidade: [null],
        estado: [null],  
        pais: ['Brasil'],  
      })
    });
    if(this.data == null)
      this.pageTitle = 'Cadastrar Representada'
    else{
        this.pageTitle = 'Editar Representada'
        this.editCharge();
    }
  }
  editCharge(){
       this.form.patchValue(this.data)
   }


  onBlurMethod(){
    if(this.form.get('endereco.cep').value != null){
      this.clientservice.getCep(this.form.get('endereco.cep').value).subscribe( res => {
        this.cep = res
        if(this.cep.success == true){
        this.notificationService.notify(`Cep inserido com sucesso!`)
        this.form.get('endereco.cidade').setValue(this.cep.data.cidade);
        this.form.get('endereco.estado').setValue(this.cep.data.estado);
        this.form.get('endereco.logradouro').setValue(this.cep.data.logradouro);
        this.form.get('endereco.bairro').setValue(this.cep.data.bairro);
      }else{
        this.openAlert('Erro', 'Cep Inválido');
       }
      })
    }
  }


  onBlurCnpj(){
    if(this.form.get('cnpj').value != null && this.data == null){
      this.clientservice.getApiCnpj(this.form.get('cnpj').value).subscribe((res:any) => {
        if(res.status != 'ERROR'){
          this.chargeForm(res);
        }else{
          this.openAlert('Erro', 'Cnpj Inválido');
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
    if(this.data == null){
      this.clientservice.addRepresenta(this.form.value).subscribe((res:any) =>{
          this.notificationService.notify(`Cadastro Efetuado com Sucesso!`)
        });
    }else{
      this.clientservice.updateRepresentada(this.form.value).subscribe( () =>{
        this.notificationService.notify("Atualizado com Sucesso!")
      })
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

  close() {
    this.dialogRef.close();
  }

  openAlert(titulo, msg){
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      width: '250px',
      data: {
        titulo: titulo,
        msg: msg
      }
    }
    this.dialog.open(
      AlertComponent, 
      dialogConfig, 
    );
  }
  hide = true;
}
