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
export class DialogBodyGruposComponent implements OnInit {

  public form: FormGroup;
  pageTitle: string = "";
  readonly = false;

  constructor(public dialogRef: MatDialogRef<DialogBodyGruposComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService
  ) {

  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      nome: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
    });
    if (this.data == null) {
      this.pageTitle = 'Cadastrar grupo'
    } else {
      if(this.data.action == 'edit'){
        this.pageTitle = 'Editar grupo';
      }else{
        this.pageTitle = 'Visualizar grupo';
        this.readonly = true;
      }
      this.form.patchValue(this.data)
    }
  }

  areaVendasSubmit() {
    if (this.data == null)
      this.clientservice.addGrupos(this.form.value)
    else
      this.clientservice.updateGrupos(this.form.value).subscribe(() => {
        this.notificationService.notify("Atualizado com Sucesso!")
      })
  }

  close() {
    this.dialogRef.close(
    );
  }

}
