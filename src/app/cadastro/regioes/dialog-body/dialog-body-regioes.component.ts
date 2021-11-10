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
export class DialogBodyRegioesComponent implements OnInit {

  public form: FormGroup;
  pageTitle: string = "";
  readonly = false;

  constructor(public dialogRef: MatDialogRef<DialogBodyRegioesComponent>,
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
      descricao: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
      status: [true, Validators.required],
    });
    if (this.data == null)
      this.pageTitle = 'Cadastrar região';
    else {
      if(this.data.action == 'edit'){
        this.pageTitle = 'Editar região';
      }else{
        this.pageTitle = 'Visualizar região';
        this.readonly = true;
      }
      
      this.form.patchValue(this.data)
    }
  }

  regioesSubmit() {
    if (this.data == null)
      this.clientservice.addRegiao(this.form.value)
    else
      this.clientservice.updateRegiao(this.form.value).subscribe(() => {
        this.notificationService.notify("Atualizado com Sucesso!")
      })
  }

  close() {
    this.dialogRef.close(
    );
  }

}
