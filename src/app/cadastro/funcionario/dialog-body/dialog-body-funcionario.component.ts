import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-dialog-body-funcionario',
  templateUrl: './dialog-body-funcionario.component.html',
  styleUrls: ['./dialog-body-funcionario.component.css']
})
export class DialogBodyFuncionarioComponent implements OnInit {

  isOn: boolean = false;
  isOn1: boolean = false;
  isOn2: boolean = false;
  isOn3: boolean = false;
  isOn4: boolean = false;
  isLinear = false;
  form: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  form4: FormGroup;
  form5: FormGroup;
  
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  obj: {[x: string]: any} = {};
  data = [];
  data2 = [];
  customers 
  companies
  auto 
  pet 
  service
  flag
  selectedFile: File = null;
  fd = new FormData();
  cep
  modelCidade
  modelEstado
  modelBairro
  modelLogradouro
  dataGrupos: any;
  grupos = [];
  selectedGrupo: string;


  constructor(private _formBuilder: FormBuilder,
              private fb: FormBuilder,
              private clientservice: ClientService,
              private notificationService: NotificationService) 
  { 
    this.clientservice.getGrupos().subscribe(res =>{
      this.dataGrupos = res;
      this.grupos = this.dataGrupos.data; 
    });            

  }    
  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      tipo: [null, Validators.required],

    });
    this.secondFormGroup = this._formBuilder.group({
      tipo: [null, Validators.required],

    });
    this.thirdFormGroup = this._formBuilder.group({
      tipo: [null, Validators.required],

  });

  this.form = this.fb.group({
    name: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
    email: [null, Validators.compose([Validators.required, CustomValidators.email])],
    cep: [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])],
    logradouro: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
    complemento: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
    bairro: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
    cidade: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
    estado: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
    cpf: [null, Validators.compose([Validators.required, CustomValidators.digits])],
    rg: [null, Validators.compose([Validators.required, CustomValidators.digits])],
    date: [null, Validators.compose([Validators.required, CustomValidators.date])] ,
    phone: [null, Validators.compose([Validators.required, CustomValidators.phone('IN')])],
    phone2: [null, Validators.compose([Validators.required, CustomValidators.phone('IN')])],
    gender: [null, Validators.required],
    hideRequired: false,
    floatLabel: 'auto',
    active: [null, Validators.required]       
  });
  this.form2 = this.fb.group({
    name2: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
    rsocial: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
    senha: [null, Validators.compose([Validators.required, CustomValidators.digits])],
    ie: [null, Validators.compose([Validators.required, CustomValidators.digits])],
    email: [null, Validators.compose([Validators.required, CustomValidators.email])],
    grupo: [null, Validators.compose([Validators.required, CustomValidators.number])],
    logradouro2: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
    complemento2: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
    bairro2: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
    cidade2: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
    estado2: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
    url2: ["http://www.", Validators.compose([Validators.required, CustomValidators.url])],
    phonepj: [null, Validators.compose([Validators.required, CustomValidators.phone('IN')])],
    phonepj2: [null, Validators.compose([Validators.required, CustomValidators.phone('IN')])],
    representante: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
    contato: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
    active: [null, Validators.required]
  });
}

addCustomers() { 
  this.fd.append('Sulsales[customer][nome]', this.form.value.name);
  this.fd.append('Sulsales[customer][cpf]', this.form.value.cpf);
  this.fd.append('Sulsales[customer][rg]', this.form.value.rg);
  this.fd.append('Sulsales[customer][tel_fixo]', this.form.value.phone);
  this.fd.append('Sulsales[customer][sexo]', this.form.value.gender);
  this.fd.append('Sulsales[customer][tel_cel]', this.form.value.phone2);
  this.fd.append('Sulsales[customer][email]', this.form.value.email);
  this.fd.append('Sulsales[customer][nascimento]', this.form.value.date.toISOString()); 
  this.fd.append('Sulsales[customer][address][logradouro]', this.form.value.logradouro);
  this.fd.append('Sulsales[customer][address][complemento]', this.form.value.complemento);
  this.fd.append('Sulsales[customer][address][cep]', this.form.value.cep);
  this.fd.append('Sulsales[customer][address][bairro]', this.form.value.bairro);
  this.fd.append('Sulsales[customer][address][city_id]', this.cep.data.city.id);
  this.fd.append('Sulsales[customer][address][country_id]', '1');
  this.fd.append('Sulsales[customer][address][state_id]', this.cep.data.state.id);
  this.fd.append('Sulsales[customer][active]', this.form.value.active);
  }
addAuto() { 
    this.fd.append('Sulsales[vehicle][marca]', this.form3.value.marca);
    this.fd.append('Sulsales[vehicle][chassi]', this.form3.value.chassi);
    this.fd.append('Sulsales[vehicle][placa]', this.form3.value.placa);
    this.fd.append('Sulsales[vehicle][renavam]', this.form3.value.renavam);
    this.fd.append('Sulsales[vehicle][fabricante]', this.form3.value.fabricante);
    this.fd.append('Sulsales[vehicle][capacidade]', this.form3.value.capacidade2);
    this.fd.append('Sulsales[vehicle][tipo]', this.form3.value.tipo);
  }

  onBlurMethod(){
    this.clientservice.getCep(this.form.value.cep).subscribe( res => {
      this.cep = res
      if(this.cep.data != 'error'){
      this.notificationService.notify(`Cep inserido com sucesso!`)
      this.modelCidade = this.cep.data.cidade
      this.modelEstado = this.cep.data.estado
      this.modelLogradouro = this.cep.data.logradouro
      this.modelBairro = this.cep.data.bairro
    }else{
      this.notificationService.notify(`Cep Inválido`)

     }
    })

}
  
  
}