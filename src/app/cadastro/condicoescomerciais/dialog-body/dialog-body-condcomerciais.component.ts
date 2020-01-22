import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-dialog-body-condcomerciais',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyCondComerciaisComponent implements OnInit {

  public form: FormGroup;
  dados:any= "";
  

  constructor(public dialogRef: MatDialogRef<DialogBodyCondComerciaisComponent>, 
                                @Inject(MAT_DIALOG_DATA) public data: any,
                                private fb: FormBuilder,
                                private clientservice: ClientService
                                ){

                                }
                              
  ngOnInit() {
    this.form = this.fb.group({
      nome: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      prazo: [null, Validators.compose([Validators.required ])],
      dias: [null, Validators.compose([Validators.required ])],
    });
  }

  regioesSubmit() { 
    this.dados = [{
      nome : this.form.value.nome,
      prazo: this.form.value.prazo,
      dias:this.form.value.dias,
    }]

    this.clientservice.addCondComerciais(this.dados)  

  }

  close() {
    this.dialogRef.close();
  }

}
