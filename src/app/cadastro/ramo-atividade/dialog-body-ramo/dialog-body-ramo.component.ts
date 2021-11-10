import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';

@Component({
  selector: 'app-dialog-body-ramo',
  templateUrl: './dialog-body-ramo.component.html',
  styleUrls: ['./dialog-body-ramo.component.css']
})
export class DialogBodyRamoComponent implements OnInit {

  public form: FormGroup;
  pageTitle: string = "";
  readonly = false;


  constructor(public dialogRef: MatDialogRef<DialogBodyRamoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService
  ) {

  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [],
      nome: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      ativo: [true]
    });
    if (this.data == null)
      this.pageTitle = 'Cadastrar Ramo de Atividade';
    else {
      if(this.data.action == 'edit'){
        this.pageTitle = 'Editar Ramo de Atividade';
      }else{
        this.pageTitle = 'Visualizar Ramo de Atividade';
        this.readonly = true;
      }
      
      this.form.patchValue(this.data)
    }
  }

  Submit() {
    if (this.data == null)
      this.clientservice.addRamos(this.form.value)
    else
      this.clientservice.updateRamos(this.form.value).subscribe(() => {
        this.notificationService.notify("Atualizado com Sucesso!")
      })
  }

  close() {
    this.dialogRef.close(
    );
  }

}
