import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyUnidadesComponent implements OnInit {

  public form: FormGroup;
  dados:any= "";
  dataAux;
  dataAux1;

  constructor(public dialogRef: MatDialogRef<DialogBodyUnidadesComponent>, 
                                @Inject(MAT_DIALOG_DATA) public data: any,
                                private fb: FormBuilder,
                                private clientservice: ClientService
                                ){

                                }
                              
  ngOnInit() {
    this.form = this.fb.group({
      sigla: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      descricao: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      status: [null, Validators.required],
      hideRequired: true,
      floatLabel: 'auto',
    });
  }

  areaVendasSubmit() { 
    this.dados = [{
      sigla : this.form.value.sigla,
      descricao : this.form.value.descricao,
      status:this.form.value.status,

    }]

    this.clientservice.addUnidades(this.dados)  

  }

  close() {
    this.dialogRef.close(
    );
  }

}
