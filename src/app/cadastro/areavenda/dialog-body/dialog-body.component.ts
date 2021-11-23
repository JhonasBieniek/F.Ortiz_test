import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from "@angular/material";
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyComponent implements OnInit {

  public form: FormGroup;
  dados:any= "";
  dataAux;
  dataAux1;
  dataRegioes;
  dataVendedor;
  dataAuxiliares;
  regioes = [];
  vendedores = [];
  auxiliares = [];
  representadas = [];
  selectedRegiao: string;
  selectedVendedor: string;
  selectedAuxiliar: string;
  pageTitle:string = "";
  readonly = false;


  constructor(public dialogRef: MatDialogRef<DialogBodyComponent>, 
                                @Inject(MAT_DIALOG_DATA) public data: any,
                                private fb: FormBuilder,
                                private notificationService: NotificationService,
                                private clientservice: ClientService
                                )
    {
      this.clientservice.getRegioes().subscribe((res:any) =>{
        this.regioes = res.data; 
      }); 
      this.clientservice.getFuncionarios().subscribe((res:any) =>{
        this.vendedores = res.data; 
      }); 
      this.clientservice.getFuncionarios().subscribe((res:any) =>{
        this.auxiliares = res.data; 
      }); 
      this.clientservice.getRepresentadasAtivas().subscribe((res:any) =>{
        this.representadas = res.data.filter(rep => rep.status == true); 
      }); 

  }
                              
  ngOnInit() {
    if(this.data != null){
      this.chargeForm();
      if(this.data.action =="edit"){
        this.pageTitle = 'Editar área de venda';
      }else{
        this.pageTitle = 'Visualizar área de venda';
        this.readonly = true;
      }
    }else{
      this.pageTitle = 'Cadastrar área de venda'
      this.form = this.fb.group({
        nome: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
        vendedor_id: [null, Validators.compose([Validators.required])],
        auxiliar_id: [null, Validators.compose([Validators.required])],
        regiao_id: [null, Validators.compose([Validators.required])],
        representada_id: [null, Validators.compose([Validators.required])],
        status: [true, Validators.required],
        hideRequired: true,
        floatLabel: 'auto',
      });
    }
  }
  private chargeForm(){
    this.form = this.fb.group({
      id: this.data.id,
      nome: [this.data.nome,Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      vendedor_id: [this.data.vendedor_id,Validators.compose([Validators.required])],
      auxiliar_id: [this.data.auxiliar_id,Validators.compose([Validators.required])],
      regiao_id: [this.data.regiao_id,Validators.compose([Validators.required])],
      representada_id: [this.data.representada_id, Validators.compose([Validators.required])],
      status: [this.data.status,Validators.compose([Validators.required])],
      hideRequired: true,
      floatLabel: 'auto',
    });
  }

  areaVendasSubmit() { 
    if(this.data != undefined){
      this.clientservice.updateAreaVenda(this.form.value).subscribe( () =>{
        this.notificationService.notify("Atualizado com Sucesso!")
      })
    }else{
      this.clientservice.addAreaVenda(this.form.value)  
    }
  }

  close() {
    this.dialogRef.close(
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

}
