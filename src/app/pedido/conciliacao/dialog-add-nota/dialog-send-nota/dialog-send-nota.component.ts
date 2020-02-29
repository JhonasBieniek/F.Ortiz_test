import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ClientService } from '../../../../shared/services/client.service.component';
import { NotificationService } from '../../../../shared/messages/notification.service';
import { DialogConfirmarDeleteComponent } from '../../../../cadastro/dialog-confirmar-delete/confirmar-delete.component';

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
  
  steps: any = [
    {
      titulo: "Produtos do Pedido",
      step: true,
      index: 0
    }
  ];

  defaultTab = 0;

  itemSelected

  loadingIndicator = true;
  reorderable = true;

  isEditable = {};     
  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    public dialogRef: MatDialogRef<DialogSendNotaComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.refreshTable();
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

  refreshTable(){
    this.clientservice.getPedidoProdutos(this.data.id).subscribe((res:any) => {
      let i = 0;
      this.temp[i] = res.data;
      this.rows = [...this.temp];
    })
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows[this.defaultTab] = this.temp[this.defaultTab].filter(d => {
      if( d.produto.codigo.toLowerCase().indexOf(val) !== -1 || !val 
      || d.produto.nome.toLowerCase().indexOf(val) !== -1 || !val)
      return d
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  delete(row){
    const dialogConfig = new MatDialogConfig();
      let tipo = 'pedido-produtos'
      dialogConfig.data = row;
      dialogConfig.data.nome = row.produto.nome;
      dialogConfig.data.tipo = tipo;
      let dialogRef = this.dialog.open(DialogConfirmarDeleteComponent,
      dialogConfig   
    );
    dialogRef.afterClosed().subscribe(value => {
      (value != 1) ? this.refreshTable() : null
    });
  }

  save(): void {
    this.clientservice.addNota(this.form.value).subscribe((res:any) => {
      this.dialogRef.close(res.success);
    });
  }


}
