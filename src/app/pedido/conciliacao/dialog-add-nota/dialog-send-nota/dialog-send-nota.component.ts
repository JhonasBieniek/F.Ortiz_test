import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from "@angular/material";
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ClientService } from '../../../../shared/services/client.service.component';
import { NovoComponent } from '../../../pedido-listar/novo/novo.component';
import moment from 'moment';
import { NotificationService } from '../../../../shared/messages/notification.service';

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
    private notificationService: NotificationService,
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
        // Verificar se ja existe nota do produto
        this.pedido.notas.map(nota => {
          if(nota.status != "cancelado"){
            nota.nota_produtos.map(produtoNota => {
              if(e.id == produtoNota.pedido_produto_id){
                e.quantidade = e.quantidade - produtoNota.qtd;
              }
            });
          }
        });

        this.pedido.nota_produtos
        e.quantidade_recebida = e.quantidade;
        return e;
      })

    });
  }
  totalNota(){
    let total = 0;
    this.rows.map( produto => {
      total  = total + (produto.quantidade_recebida * produto.valor_unitario)
    });
    return total;
  }

  totalNotaBruto(){
    let total = 0;
    this.rows.map( produto => {
      if(produto.quantidade_recebida > 0){
        if(produto.ipi > 0){
          let ipi = (produto.quantidade_recebida * produto.valor_unitario * produto.ipi)  / 100;
          total  = total + ((produto.quantidade_recebida * produto.valor_unitario)  + ipi );
        }else{
          total  = total + (produto.quantidade_recebida * produto.valor_unitario );
        }
      }
    });
    return total;
  }

  criaParcelas() {
    this.clearParcelas();
    let data = new Date(this.form.get('data_faturamento').value);
    let totalNota = this.totalNota();
    if (this.pedido.condicao_comercial.dias != null) {
      let dias = this.pedido.condicao_comercial.dias.split("/");
      let parcelas = dias.filter(e =>  e);
      let valor = totalNota / parcelas.length;
      let auxValor = (this.pedido.valor_liquido * (this.pedido.auxiliar_porcentagem )/100) / parcelas.length; // Validar 
      let venValor = (this.pedido.valor_liquido * (this.pedido.vendedor_porcentagem )/100) / parcelas.length; // Validar
      let fortiz_valor = (this.pedido.valor_liquido * (this.pedido.comissao_media - this.pedido.vendedor_porcentagem - this.pedido.auxiliar_porcentagem )/100) / parcelas.length; // Validar
      for (let i = 0; i < parcelas.length; i++) {
        if (parcelas[i] != "") {
          let vencimento = new Date(data)
          this.nota_parcelas.push(this.fb.group({
            data_vencimento: moment(new Date(vencimento.setDate(vencimento.getDate() + parseInt(parcelas[i])))).format("YYYY-MM-DD") ,
            valor: valor,
            status_recebimento: false,
            parcela: i+1,
            auxiliar_valor: auxValor,
            vendedor_valor: venValor,
            fortiz_valor: fortiz_valor
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
    //console.log(e);
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

      // if(dados.parcial == true) {
      //   dados.status = 'parcial'
      // }

    this.clientservice.addNota(dados).subscribe((res: any) => {
      if(res.success === true){
        this.dialogRef.close(res.success);
      }else{
        this.notificationService.notify('Informar ao administrador que nao foi possivel gerar a nota');
      }
    });
  }

  clearParcelas() {
    while (this.nota_parcelas.controls.length) {
      this.nota_parcelas.removeAt(0);
    }
  }

  changeQuantidade(rowIndex, condition){
    if(this.rows[rowIndex].quantidade_recebida == 0){
      this.rows[rowIndex].quantidade_recebida = this.rows[rowIndex].quantidade;
    }else{
      if(condition == true){
        this.rows[rowIndex].quantidade_recebida = this.rows[rowIndex].quantidade;
      }else{
        this.rows[rowIndex].quantidade_recebida = 0;
      }
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
