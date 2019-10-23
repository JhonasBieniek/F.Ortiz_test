import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyRegioesComponent implements OnInit {

  public form: FormGroup;
  dados:any= "";
  dataAux;
  dataAux1;

  constructor(public dialogRef: MatDialogRef<DialogBodyRegioesComponent>, 
                                @Inject(MAT_DIALOG_DATA) public data: any,
                                private fb: FormBuilder,
                                private clientservice: ClientService
                                ){

                                }
                              
  ngOnInit() {
    this.form = this.fb.group({
      nome: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      descricao: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      active: [null, Validators.required],
      hideRequired: true,
      floatLabel: 'auto',
    });
  }

  regioesSubmit() { 
    this.dados = [{
      nome : this.form.value.nome,
      descricao: this.form.value.descricao,
      status:this.form.value.active,
    }]

    this.clientservice.addRegiao(this.dados)  

  }

  close() {
    this.dialogRef.close(
    );
  }

}
