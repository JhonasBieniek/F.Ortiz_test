import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ClientService } from '../../../../shared/services/client.service.component';
import { NotificationService } from '../../../../shared/messages/notification.service';
import steps from './steps.json';

@Component({
  selector: 'app-dialog-send-nota',
  templateUrl: './dialog-send-nota.component.html',
  styleUrls: ['./dialog-send-nota.component.css']
})
export class DialogSendNotaComponent implements OnInit {
  public form: FormGroup;
  dados
  editing = {};
  rows:any = [];
  temp:any = [];
  selected:any = [];
  steps: any = steps.produtos;
  defaultTab = 0;

  itemSelected

  loadingIndicator = true;
  reorderable = true;

  isEditable = {};     
  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    public dialogRef: MatDialogRef<DialogSendNotaComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.clientservice.getPedidoProdutos(this.data.id).subscribe((res:any) => {
      let i = 0;
      this.temp[i] = res.data;
      this.rows = [...this.temp];
    })
  }

  ngOnInit() {
    this.form = this.fb.group({
      pedido_id: [this.data.id],
      num_nota: [null, Validators.compose([Validators.required])],
      data_faturamento: [null, Validators.compose([Validators.required, CustomValidators.date])],
      obs: [null],
      status: ["aberto"]
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows[this.defaultTab] = this.temp[this.defaultTab].filter(d => {
      if( d.num_nota.toLowerCase().indexOf(val) !== -1 || !val 
      || d.pedido.num_pedido.toLowerCase().indexOf(val) !== -1 || !val)
      return d
    });
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
