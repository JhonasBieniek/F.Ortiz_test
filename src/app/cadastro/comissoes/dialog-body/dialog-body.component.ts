import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
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
     

  }
                              
  ngOnInit() {
    this.form = this.fb.group({
      funcionario_id: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      representada_id: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      inicio: [null, Validators.compose([Validators.required, CustomValidators.number])],
      final: [null, Validators.compose([Validators.required, CustomValidators.number])],
      percentual: [null, Validators.compose([Validators.required, CustomValidators.number])],
      hideRequired: true,
      floatLabel: 'auto',
    });
  }

  areaVendasSubmit() { 
    this.clientservice.addComissoes(this.form.value).subscribe((res:any) =>{
      if(res.success == true){
        this.notificationService.notify(`Cadastro Efetuado com Sucesso!`)
      }else{
        this.notificationService.notify(`Erro contate o Administrador`)
      }}
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

  close() {
    this.dialogRef.close(
    );
  }

}
