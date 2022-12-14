import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators, ValidationErrors, FormArray, FormControl } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { CustomValidators } from 'ng2-validation';
import { NotificationService } from '../../../shared/messages/notification.service';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyComissoesComponent implements OnInit {

  public form: FormGroup;
  dados:any= null;
  dataAux;
  dataAux1;
  dataFuncionarios;
  dataRepresentadas;
  funcionarios = [];
  representadas = [];
  auxiliares = [];
  selectedFuncionario: string;
  selectedRepresentada: string;
  pageTitle:string = "";
  result = []
  result2 = [];

  constructor(public dialogRef: MatDialogRef<DialogBodyComissoesComponent>, 
                                @Inject(MAT_DIALOG_DATA) public data: any,
                                private fb: FormBuilder,
                                private clientservice: ClientService,
                                private notificationService: NotificationService
                                )
    {
      this.clientservice.getFuncionarios().subscribe(res =>{
        this.dataFuncionarios = res;
        this.funcionarios = this.dataFuncionarios.data; 
      }); 
      this.clientservice.getRepresentadas().subscribe(res =>{
        this.dataRepresentadas = res;
        this.representadas = this.dataRepresentadas.data; 
      }); 

      this.form = this.fb.group({
        id: null,
        funcionario_id: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
        comissoes: this.fb.array([]),
      });

      if(this.data != null)
      this.clientservice.viewComissoes(this.data.funcionario_id)
      .subscribe((res:any)=>{
        this.dados =res.data;
        for(let i=0; i < this.dados.comissoes.length ; i++){
        this.addComissao();
        for(let j=0; j < this.dados.comissoes[i].comissao_faixas.length; j++){
          this.addComissaoFaixa(i);
        }
        if((i+1) == this.dados.comissoes.length){
          this.form.patchValue(this.dados)
        }
      }
    })    
  }
                              
  ngOnInit() {
    if(this.data == null){
      this.pageTitle = 'Cadastrar Comiss??o'
      //this.formInit();
    }else
      this.pageTitle = 'Editar Comiss??o'
  }

  comissoes(): FormArray{
    return this.form.get("comissoes") as FormArray
  }

  novaComissao(): FormGroup{
    return this.fb.group({
      id: '',
      representada_id: '',//new FormControl('', Validators.required),
      comissao_faixas: this.fb.array([]),
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

  areaVendasSubmit() { 
    if(this.data != undefined)
      this.clientservice.updateComissoes(this.form.value).subscribe( () =>{
        this.notificationService.notify("Atualizado com Sucesso!")
      })
    else
      this.clientservice.addComissoes(this.form.value)  
  }

  close() {
    this.dialogRef.close(
    );
  }

}
