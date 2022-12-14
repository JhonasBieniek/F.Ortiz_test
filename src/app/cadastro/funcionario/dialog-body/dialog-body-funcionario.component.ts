import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, FormArray } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';
import { CustomValidators } from 'ng2-validation';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { AlertComponent } from '../../../alert/alert.component';
import moment from 'moment';

@Component({
  selector: 'app-dialog-body-funcionario',
  templateUrl: './dialog-body-funcionario.component.html',
  styleUrls: ['./dialog-body-funcionario.component.css']
})
export class DialogBodyFuncionarioComponent implements OnInit {

  grupos;
  cargos;
  representadas;
  funcionario: FormGroup;
  usuario: FormGroup;
  isLinear: boolean = false;
  pageTitle:string = "";
  editar:boolean = false;
  dados:any;
  isOn = true;
  isOn2 = false;
  readonly = false;


  constructor(
    public dialogRef: MatDialogRef<DialogBodyFuncionarioComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ){ 
    this.clientservice.getGrupos().subscribe((res:any) =>{
      this.grupos = res.data;
    });
    this.clientservice.getCargos().subscribe((res:any) =>{
      this.cargos = res.data;
    });
    this.clientservice.getRepresentadas().subscribe((res:any) =>{
      this.representadas = res.data; 
    });         
  }    
  ngOnInit() {
      this.funcionario = this.fb.group({
        id: null,
        nome: [null, Validators.compose([Validators.required])],
        cpf: [null],
        rg: [null],
        oe: [null],
        sexo: [null],
        nascimento: [null],
        celular: [null],
        telefone: [null],
        cargo_id: [null],
        status: [true],
        email: [null, Validators.compose([Validators.required])],
        grupo_id: [null, Validators.compose([Validators.required])],
        endereco: this.fb.group({
          cep: [null],
          logradouro: [null],
          numero: [null],
          complemento: [null],
          bairro: [null],
          cidade: [null],
          estado: [null],
          pais: ['Brasil']
        }),
        comissoes: this.fb.array([]),
      });
      if(this.data == null){
        this.pageTitle = 'Cadastrar Funcion??rio'
      }else{
        if(this.data.action == 'edit'){
          this.pageTitle = 'Editar Funcion??rio';
        }else{
          this.pageTitle = 'Visualizar Funcion??rio';
          this.readonly = true;
        }
        
        this.clientservice.getFuncionario(this.data.id).subscribe((res:any) => {
          this.dados =res.data;
          for(let i=0; i < this.dados.comissoes.length ; i++){
          this.addComissao();
            for(let j=0; j < this.dados.comissoes[i].comissao_faixas.length; j++){
            this.addComissaoFaixa(i);
            }
            if((i+1) == this.dados.comissoes.length){
            }
          }
          this.funcionario.patchValue(this.dados);
          this.funcionario.controls['nascimento'].setValue(
            moment(this.dados.nascimento).format()
          );
        });
        this.editar  = true;
      }
  }
  removeSpecialChar(data) {
    return data.toString().replace(/\D+/g, '');
  }
  chargeCep(){
    if(this.readonly == false){
      let cep = this.funcionario.get('endereco.cep').value;
      if(cep != null && cep.length == 8){
        this.clientservice.getCep(cep).subscribe((res:any) => {
          if(res.success == true){
          this.funcionario.get('endereco.cidade').setValue(res.data.cidade);
          this.funcionario.get('endereco.estado').setValue(res.data.estado);
          this.funcionario.get('endereco.logradouro').setValue(res.data.logradouro);
          this.funcionario.get('endereco.bairro').setValue(res.data.bairro);
        }else{
          this.openAlert('Erro', 'Cep Inv??lido');
        }
        })
      }
    }
    
  }
  onSubmit(){
    let data = this.funcionario.value;
    data.nascimento = data.nascimento;
    this.clientservice.addFuncionario(data).subscribe((res:any) => {
      if(res.success == true){
        if(this.editar == false){
          this.notificationService.notify(`Cadastro Efetuado com Sucesso!`);
          this.close();
        }else {
          this.notificationService.notify(`Cadastro alterado com Sucesso!`);
          this.close();
        }
      }else{
        if(res.data.email._isUnique){
          this.notificationService.notify(`Email j?? esta sendo usado!`);
        }else{
          this.notificationService.notify(`Erro contate o Administrador`);
        }
      }
    });
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

  comissoes(): FormArray{
    return this.funcionario.get("comissoes") as FormArray
  }

  novaComissao(): FormGroup{
    return this.fb.group({
      id: '',
      representada_id: '',//new FormControl('', Validators.required),
      comissao_faixas: this.fb.array([]),
    })
  }
  checkExist(comIndex, id){
    this.comissoes().controls.forEach((e:any, k:any) => {
      if(e.get('representada_id').value == id && k != comIndex){
        this.openAlert(" Error", "J?? existe faixa de comiss??es desta representada para esse usuario"); 
        this.comissoes().removeAt(comIndex);
      }
    })
  }
  addComissao(){
    this.comissoes().push(this.novaComissao());
  }

  removeComissao(comIndex: number){
    this.comissoes().removeAt(comIndex);
  }

  comissaoFaixas(comIndex: number) : FormArray{
    return this.comissoes().at(comIndex).get("comissao_faixas") as FormArray
  }

  novaFaixa(): FormGroup {
    return this.fb.group({
      id: null,
      faixa: '',//new FormControl('', Validators.required),
      percentual: ''//new FormControl('', Validators.required),
    })
  }

  addComissaoFaixa(comIndex: number){
    this.comissaoFaixas(comIndex).push(this.novaFaixa());
  }

  removeComissaoFaixa(comIndex: number, faixaIndex: number){
    this.comissaoFaixas(comIndex).removeAt(faixaIndex)
  }

}