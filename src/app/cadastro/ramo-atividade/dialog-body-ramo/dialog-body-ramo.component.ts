import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-dialog-body-ramo',
  templateUrl: './dialog-body-ramo.component.html',
  styleUrls: ['./dialog-body-ramo.component.css']
})
export class DialogBodyRamoComponent implements OnInit {

  public form: FormGroup;
  dados:any= "";
  


  constructor(public dialogRef: MatDialogRef<DialogBodyRamoComponent>, 
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

  Submit() { 
    this.dados = {
      nome : this.form.value.nome,
      ativo: true
    }

    this.clientservice.addRamos(this.dados).subscribe(res =>
      console.log('Done Add Ramo!', res));
      this.close();
  }

  close() {
    this.dialogRef.close(
    );
  }

}
