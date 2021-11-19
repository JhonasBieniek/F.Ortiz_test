import { ClientService } from './../../../shared/services/client.service.component';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from "@angular/material";
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { NovoComponent } from '../../pedido-listar/novo/novo.component';
import moment from 'moment';

@Component({
  selector: 'app-dialog-edit-nota',
  templateUrl: './dialog-edit-nota.component.html',
  styleUrls: ['./dialog-edit-nota.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class DialogEditNotaComponent implements OnInit {

  public form: FormGroup;
  dados;
  pedido;
  editing = {};
  rows:any = [];
  temp:any = [];
  selected:any = [];
  nota_parcelas:any = [];
  nota_produtos:any = [];
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
    public dialogRef: MatDialogRef<DialogEditNotaComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    console.log(this.data)
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.data.id],
      pedido_id: [this.data.pedido_id],
      num_nota: [this.data.num_nota, Validators.compose([Validators.required])],
      data_faturamento: [this.data.data_faturamento, Validators.compose([Validators.required, CustomValidators.date])],
      obs: [this.data.obs],
      status: [this.data.status],
      nota_parcelas: this.fb.array([]),
      nota_produtos: this.fb.array([])
    });
    this.nota_parcelas = this.form.get('nota_parcelas') as FormArray;
    this.nota_produtos = this.form.get('nota_produtos') as FormArray;
    this.loadData();

  }

  loadData(){
    this.clientservice.getPedido(this.data.pedido_id).subscribe((res: any) => {
      this.pedido = res.data;
      this.temp = this.pedido.pedido_produtos.sort((a, b) => a.id - b.id);
      
      this.rows = [...this.temp];
      console.log(this.pedido)
      this.rows.map(e => {
        
        // Verificar se ja existe nota do produto que nao esteja cancelada.
        this.pedido.notas.map(nota => {
          nota.nota_produtos.map(produtoNota => {
            if(e.id == produtoNota.pedido_produto_id){
              e.quantidade = e.quantidade - produtoNota.qtd;
            }
          });
        });

        e.quantidade_recebida = e.quantidade;
        return e;
      })

      let qtd = this.data.nota_produtos;
      this.rows.map( e => {
        qtd.map( f => {
          if(e.id === f.pedido_produto_id){
            e.quantidade = e.quantidade + f.qtd;
            e.quantidade_recebida = f.qtd;
            e.parcial = e.quantidade != e.quantidade_recebida ? true : false
          }
        })

        return e;
      })
      
      setTimeout(() => { window.dispatchEvent(new Event('resize')) }, 500);
    });

    
  }

  totalNota(){
    let total = 0;
    this.rows.map( produto => {
      total  = total + (produto.quantidade_recebida * produto.valor_unitario)
    });

    return total;
  }

  criaParcelas(){
    this.clearParcelas();
    let data = this.form.get('data_faturamento').value;
    let totalNota = this.totalNota();
    if(this.data.pedido.condicao_comercial.dias != null){
      let parcelas = this.data.pedido.condicao_comercial.dias.split("/");
      let valor = totalNota / parcelas.length;
      let auxValor = this.pedido.comissao_auxiliar / parcelas.length; // Validar 
      let venValor = this.pedido.comissao_vendedor / parcelas.length; // Validar
      let fortiz_valor = (this.pedido.comissao_bruto - ( this.pedido.comissao_vendedor + this.pedido.comissao_auxiliar ) ) / parcelas.length; // Validar
      for(let i=0; i<parcelas.length; i++){
        if(parcelas[i] != ""){
          let vencimento = new Date(data)
          this.nota_parcelas.push(this.fb.group({
            data_vencimento: moment(new Date(vencimento.setDate(vencimento.getDate() + parseInt(parcelas[i])))).format("YYYY-MM-DD"),
            valor: valor,
            status_recebimento: false,
            parcela: i,
            auxiliar_valor: auxValor,
            vendedor_valor: venValor,
            fortiz_valor: fortiz_valor
          }))
        }
      }
    }

  }

  clearParcelas(){
    this.data.nota_parcelas.forEach(element => {
      console.log(element)
      this.clientservice.removeNotaParcela(element.id).subscribe(() => {})
    });
    this.data.nota_produtos.forEach(element => {
      this.clientservice.removeNotaProduto(element.id).subscribe(() => {})
    });
    while (this.nota_parcelas.controls.length) {
      this.nota_parcelas.removeAt(0);
    }
    while (this.nota_produtos.controls.length) {
      this.nota_produtos.removeAt(0);
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows = this.temp.filter(d => {
      if( d.produto.codigo.toLowerCase().indexOf(val) !== -1 || !val 
      || d.produto.nome.toLowerCase().indexOf(val) !== -1 || !val)
      return d
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  delete(row){
    console.log(row);
  }


  async save() {
    let dados:any =[];
    await this.criaParcelas();
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
    dados = this.form.value;
    dados.parcial = false;
    dados.nota_produtos.map((e:any)=> {
      if(e.parcial == true){
        dados.parcial = true
      }
    })

      // if(dados.parcial == true) {
      //   dados.status = 'parcial'
      // }else {
      //   dados.status = 'aberto'
      // }
    this.clientservice.editNota(this.form.value).subscribe((res:any) => {
      this.dialogRef.close({
        status: true,
        num_nota: this.form.get('num_nota').value
      });
    });
  }

  edit(row){
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
    dialogRef.afterClosed().subscribe(value =>{
      this.loadData();
    })
  }

}
