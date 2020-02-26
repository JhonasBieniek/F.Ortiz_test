import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { ClientService } from '../../shared/services/client.service.component';
import { NotificationService } from '../../shared/messages/notification.service';
import { CustomValidators } from 'ng2-validation';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { AlertComponent } from '../../alert/alert.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-receber',
  templateUrl: './receber.component.html',
  styleUrls: ['./receber.component.css']
})
export class ReceberComponent implements OnInit {

  funcionario: FormGroup;
  usuario: FormGroup;
  isLinear: boolean = false;
  pageTitle:string = "";
  currentAction:string ="";

  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private datePipe : DatePipe,
  ){}    

  ngOnInit() {
      this.funcionario = this.fb.group({
        id: null,
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
        email: [null , Validators.compose([Validators.required])],
        grupo_id: [null , Validators.compose([Validators.required])],
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
      // if(){
      //   this.pageTitle = 'Cadastrar Funcionário'
      // }else{
      //   this.pageTitle = 'Editar Funcionário'
      //   this.funcionario.patchValue();
      // }
  }

  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == "receber")
      this.currentAction = "receber"
    else
      this.currentAction = "repasses"
  }

  removeSpecialChar(data) {
    return data.toString().replace(/\D+/g, '');
  }
  
  onSubmit(){
    let data = this.funcionario.value;
    data.nascimento = this.datePipe.transform(data.nascimento, 'yyyy-MM-dd');
    this.clientservice.addFuncionario(data).subscribe((res:any) => {
      if(res.success == true){
        this.notificationService.notify(`Cadastro Efetuado com Sucesso!`)
      }else{
        this.notificationService.notify(`Erro contate o Administrador`)
      }
    });
  }
}