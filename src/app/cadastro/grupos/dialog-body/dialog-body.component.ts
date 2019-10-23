import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyGruposComponent implements OnInit {

  public form: FormGroup;
  dados:any= "";
  


  constructor(public dialogRef: MatDialogRef<DialogBodyGruposComponent>, 
                                @Inject(MAT_DIALOG_DATA) public data: any,
                                private fb: FormBuilder,
                                private clientservice: ClientService
                                ){
    
  }
                              
  ngOnInit() {
    this.form = this.fb.group({
      nome: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
    });
  }

  areaVendasSubmit() { 
    this.dados = [{
      nome : this.form.value.nome,
    }]

    this.clientservice.addGrupos(this.dados)  

  }

  close() {
    this.dialogRef.close(
    );
  }

}
