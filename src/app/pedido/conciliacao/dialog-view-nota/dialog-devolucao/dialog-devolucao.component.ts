import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ClientService } from '../../../../shared/services/client.service.component';

@Component({
  selector: 'app-dialog-devolucao',
  templateUrl: './dialog-devolucao.component.html',
  styleUrls: ['./dialog-devolucao.component.css']
})
export class DialogDevolucaoComponent implements OnInit {

  public form: FormGroup;

  rows: any[] = [];
  selected: any = [];
  nota_produto_devolutions: any = [];

  isSelected

  @ViewChild(DialogDevolucaoComponent, { static: false }) table: DialogDevolucaoComponent;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogDevolucaoComponent>,
    private clientservice: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(data);
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.data.id],
      obs: [this.data.obs],
      nota_produto_devolutions: this.fb.array([]),
    });
    this.nota_produto_devolutions = this.form.get('nota_produto_devolutions') as FormArray;

    setTimeout(() => { 
      this.data.nota_produtos.map(produto => {
        if (produto.qtd > 0) {
          produto.devolucao = 0;
          this.rows.push(produto)
        }
      });
      //this.rows = this.rows = [...this.data.nota_produtos] 
    }, 500);
  }
  close(){
    this.dialogRef.close();
  }
  save(){
    this.rows.map(e => {
      if(e.devolucao > 0 ){
        this.nota_produto_devolutions.push(
          this.fb.group({
            id: null,
            nota_id: e.nota_id,
            pedido_id: e.pedido_id,
            pedido_produto_id: e.pedido_produto_id,
            qtd: e.devolucao,
            status: 'aberto'
        }))
      }
    });

    this.clientservice.addDevolucao(this.form.get('nota_produto_devolutions').value).subscribe((res:any) => {
      console.log(res)
      this.dialogRef.close({
        status: true,
      });
    });
    console.log(this.rows)
    console.log(this.form.value)
  }


}