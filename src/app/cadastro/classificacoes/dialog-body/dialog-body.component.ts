import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';
import { isThisISOWeek } from 'date-fns';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyProdutoClassificacaoComponent implements OnInit {

  public form: FormGroup;
  dados: any = "";
  dataAux;
  dataAux1;
  pageTitle: string = "";
  readonly = false;

  constructor(public dialogRef: MatDialogRef<DialogBodyProdutoClassificacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    if (this.data != undefined) {
      if(this.data.action == 'edit'){
        this.pageTitle = 'Editar Classificação do Produto';
      }else{
        this.pageTitle = 'Visualizar Classificação do Produto';
        this.readonly = true;
      }
      
      this.form = this.fb.group({
        id: this.data.id,
        name: [this.data.name, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
        value: [this.data.value],
      });
    } else {
      this.pageTitle = 'Classificação do Produto'
      this.form = this.fb.group({
        name: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
        value: [null],
        hideRequired: true,
        floatLabel: 'auto',
      });
    }
  }

  Submit() {
    if (this.data != undefined) {
      this.clientservice.updateProdutoClassifications(this.form.value).subscribe(() => {
        this.notificationService.notify("Atualizado com Sucesso!")
      })
    } else {
      this.clientservice.addProdutoClassifications(this.form.value)
    }
  }

  close() {
    this.dialogRef.close(
    );
  }

}
