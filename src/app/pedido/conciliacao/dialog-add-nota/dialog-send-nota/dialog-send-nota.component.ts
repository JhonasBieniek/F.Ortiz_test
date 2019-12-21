import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ClientService } from '../../../../shared/services/client.service.component';
import { NotificationService } from '../../../../shared/messages/notification.service';

@Component({
  selector: 'app-dialog-send-nota',
  templateUrl: './dialog-send-nota.component.html',
  styleUrls: ['./dialog-send-nota.component.css']
})
export class DialogSendNotaComponent implements OnInit {
  public form: FormGroup;
  dados
  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    public dialogRef: MatDialogRef<DialogSendNotaComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      pedido_id: [this.data.id],
      num_nota: [null, Validators.compose([Validators.required])],
      data_faturamento: [null, Validators.compose([Validators.required, CustomValidators.date])],
      obs: [null],
      status: ["aberto"]
    })
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.clientservice.addNota(this.form.value).subscribe((res:any) => {
      this.dialogRef.close(res.success);
    });
  }

}
