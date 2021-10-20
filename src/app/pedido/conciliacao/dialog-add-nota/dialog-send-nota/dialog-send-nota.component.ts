import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from "@angular/material";
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ClientService } from '../../../../shared/services/client.service.component';
import { NovoComponent } from '../../../pedido-listar/novo/novo.component';

@Component({
  selector: 'app-dialog-send-nota',
  templateUrl: './dialog-send-nota.component.html',
  styleUrls: ['./dialog-send-nota.component.css']
})
export class DialogSendNotaComponent implements OnInit {

  public form: FormGroup;
  dados;
  pedido;
  editing = {};
  rows: any = [];
  temp: any = [];
  nota_parcelas: any = [];
  nota_produtos: any = [];
  tab3 = false;
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

  @ViewChild('table', { static: false }) table: DialogSendNotaComponent;
  isEditable = {};

  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    public dialogRef: MatDialogRef<DialogSendNotaComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.loadData();
  }

  ngOnInit() {
    this.form = this.fb.group({
      pedido_id: [this.data.id],
      num_nota: [null, Validators.compose([Validators.required])],
      data_faturamento: [null, Validators.compose([Validators.required, CustomValidators.date])],
      obs: [null],
      status: ["aberto"],
      nota_parcelas: this.fb.array([]),
      nota_produtos: this.fb.array([])
    });
    this.nota_parcelas = this.form.get('nota_parcelas') as FormArray;
    this.nota_produtos = this.form.get('nota_produtos') as FormArray;
  }

  loadData() {
    this.clientservice.getPedido(this.data.id).subscribe((res: any) => {
      this.pedido = res.data;
      this.temp = this.pedido.pedido_produtos.sort((a, b) => a.id - b.id);
      this.rows = [...this.temp];
      this.rows.map(e => {
        e.quantidade_recebida = e.quantidade;
        return e;
      })
      console.log(this.rows)
    });
  }

  criaParcelas() {
    this.clearParcelas();
    let data = new Date(this.form.get('data_faturamento').value);
    if (this.pedido.condicao_comercial.dias != null) {
      let parcelas = this.pedido.condicao_comercial.dias.split("/");
      let valor = this.pedido.valor_total / parcelas.length;
      let auxValor = this.pedido.comissao_auxiliar / parcelas.length;
      let venValor = this.pedido.comissao_vendedor / parcelas.length;
      for (let i = 0; i < parcelas.length; i++) {
        if (parcelas[i] != "") {
          let vencimento = new Date(data)
          this.nota_parcelas.push(this.fb.group({
            data_vencimento: new Date(vencimento.setDate(vencimento.getDate() + parseInt(parcelas[i]))),
            valor: valor,
            status_recebimento: false,
            parcela: (i == 0) ? 1 : i,
            auxiliar_valor: auxValor,
            vendedor_valor: venValor
          }))
        }
      }
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows = this.temp.filter(d => {
      if (d.produto.codigo.toLowerCase().indexOf(val) !== -1 || !val
        || d.produto.nome.toLowerCase().indexOf(val) !== -1 || !val)
        return d
    });
  }
  onSelect(e) {
    console.log(e);

  }

  cancel(): void {
    this.dialogRef.close();
  }

  delete(row) {
    console.log(row);
  }

  checkParcial() {
    return true;
  }

  async save() {
    this.rows.map(e => {
      this.nota_produtos.push(
        this.fb.group({
          nota_id: null,
          pedido_id: e.pedido_id,
          produto_id: e.produto_id,
          pedido_produto_id: e.id,
          qtd: e.quantidade_recebida,
          parcial: e.quantidade_recebida != e.quantidade ? true : false
      }))
    });
    await this.criaParcelas();
    let dados:any = this.form.value;
      dados.parcial = false
      dados.nota_produtos.map((e:any)=> {
        if(e.parcial == true){
          dados.parcial = true
        }
      })

    this.clientservice.addNota(dados).subscribe((res: any) => {
      this.dialogRef.close(res.success);
    });
  }

  clearParcelas() {
    while (this.nota_parcelas.controls.length) {
      this.nota_parcelas.removeAt(0);
    }
  }

  edit(row) {
    let dialogConfig = new MatDialogConfig()
    dialogConfig = {
      maxWidth: '100vw',
      maxHeight: '100vh',

      width: '95vw',
      height: '95vh'
    }
    dialogConfig.data = {
      tipo: 'edit',
      pedido: row
    }
    let dialogRef = this.dialog.open(NovoComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      this.loadData();
    })
  }

}
