import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';

@Component({
  selector: 'app-dialog-tamanhos',
  templateUrl: './dialog-tamanhos.component.html',
  styleUrls: ['./dialog-tamanhos.component.css']
})
export class DialogTamanhosComponent implements OnInit {

  public form: FormGroup;
  pageTitle: string = "";
  readonly = false;

  constructor(public dialogRef: MatDialogRef<DialogTamanhosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService
  ) {

  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      nome: [null, Validators.required],
    });
    if (this.data == null) {
      this.pageTitle = 'Cadastrar tamanho'
    } else {
      if(this.data.action == 'edit'){
        this.pageTitle = 'Editar tamanho';
      }else{
        this.pageTitle = 'Visualizar tamanho';
        this.readonly = true;
      }
      
      this.form.patchValue(this.data)
    }
  }

  areaVendasSubmit() {
    if (this.data == null)
      this.clientservice.addTamanhos(this.form.value)
    else
      this.clientservice.updateTamanhos(this.form.value).subscribe(() => {
        this.notificationService.notify("Atualizado com Sucesso!")
      })
  }

  close() {
    this.dialogRef.close(
    );
  }

}
