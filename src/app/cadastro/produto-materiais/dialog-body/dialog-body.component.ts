import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyProdutoMateriaisComponent implements OnInit {

  public form: FormGroup;
  dados: any = "";
  dataAux;
  dataAux1;
  pageTitle: string = "";
  readonly = false;

  constructor(public dialogRef: MatDialogRef<DialogBodyProdutoMateriaisComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    if (this.data != undefined) {
      if(this.data.action == 'edit'){
        this.pageTitle = 'Editar Material do Produto';
      }else{
        this.pageTitle = 'Visualizar Material do Produto';
        this.readonly = true;
      }
      
      console.log(this.data)
      this.form = this.fb.group({
        id: this.data.id,
        nome: [this.data.nome, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      });
    } else {
      this.pageTitle = 'Material do Produto'
      this.form = this.fb.group({
        nome: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
        hideRequired: true,
        floatLabel: 'auto',
      });
    }
  }

  areaVendasSubmit() {
    if (this.data != undefined) {
      this.clientservice.updateProdutoMaterials(this.form.value).subscribe(() => {
        this.notificationService.notify("Atualizado com Sucesso!")
      })
    } else {
      this.clientservice.addProdutoMaterials(this.form.value)
    }
  }

  close() {
    this.dialogRef.close(
    );
  }

}
