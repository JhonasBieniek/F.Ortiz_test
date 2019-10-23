import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyComissoesComponent implements OnInit {

  public form: FormGroup;
  dados:any= "";
  dataAux;
  dataAux1;
  dataFuncionarios;
  dataRepresentadas;
  funcionarios = [];
  representadas = [];
  auxiliares = [];
  selectedFuncionario: string;
  selectedRepresentada: string;


  constructor(public dialogRef: MatDialogRef<DialogBodyComissoesComponent>, 
                                @Inject(MAT_DIALOG_DATA) public data: any,
                                private fb: FormBuilder,
                                private clientservice: ClientService
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
     

  }
                              
  ngOnInit() {
    this.form = this.fb.group({
      vendedor: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      auxiliar: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      inicio: [null, Validators.compose([Validators.required, CustomValidators.number])],
      final: [null, Validators.compose([Validators.required, CustomValidators.number])],
      percentual: [null, Validators.compose([Validators.required, CustomValidators.number])],
      hideRequired: true,
      floatLabel: 'auto',
    });
  }

  areaVendasSubmit() { 
    this.dados = [{
      funcionario_id: this.selectedFuncionario,
      representada_id: this.selectedRepresentada,
      inicio: this.form.value.inicio,
      final: this.form.value.final,
      percentual: this.form.value.percentual,
    }]

    this.clientservice.addComissoes(this.dados)  

  }

  close() {
    this.dialogRef.close(
    );
  }

}
