import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from "@angular/material";
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';

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
  selectedRegiao: string;
  selectedVendedor: string;
  selectedAuxiliar: string;


  constructor(public dialogRef: MatDialogRef<DialogBodyComponent>, 
                                @Inject(MAT_DIALOG_DATA) public data: any,
                                private fb: FormBuilder,
                                private clientservice: ClientService
                                )
    {
      this.clientservice.getRegioes().subscribe(res =>{
        this.dataRegioes = res;
        this.regioes = this.dataRegioes.data; 
      }); 
      this.clientservice.getFuncionarios().subscribe(res =>{
        this.dataVendedor = res;
        this.vendedores = this.dataVendedor.data; 
      }); 
      this.clientservice.getFuncionarios().subscribe(res =>{
        this.dataAuxiliares = res;
        this.auxiliares = this.dataAuxiliares.data; 
      }); 

  }
                              
  ngOnInit() {
    this.form = this.fb.group({
      nome: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      vendedor_id: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      auxiliar_id: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      regiao_id: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      status: [null, Validators.required],
      hideRequired: true,
      floatLabel: 'auto',
    });
  }

  areaVendasSubmit() { 
    this.clientservice.addAreaVenda(this.form.value)  
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
