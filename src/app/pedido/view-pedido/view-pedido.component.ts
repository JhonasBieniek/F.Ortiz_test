import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from "@angular/material";
import { ClientService } from '../../shared/services/client.service.component';


@Component({
  selector: 'app-view-pedido',
  templateUrl: './view-pedido.component.html',
  styleUrls: ['./view-pedido.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class ViewPedidoOrcamentoComponent implements OnInit {
  dados:any ;
  rows:any = [];
  rows2:any = [];
  temp:any = [];
  temp2:any = [];
  selected:any = [];

  dialogConfig = new MatDialogConfig();

  constructor(
    private clientservice: ClientService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ViewPedidoOrcamentoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '95vh',
      width: '70vw',
      height: '80vh'
    }
    this.loadData();
   }
  
  loadData(){
    this.clientservice.getOrcPedido(this.data.pedido.id, this.data.tipo).subscribe((res:any)=> {
      this.dados = res.data;
      this.temp = res.data.pedido_produtos;
      this.temp2 = res.data.notas;
      let qtd = res.data.nota_produtos;
      this.temp.map( e => {
        e.qtd_restante = e.quantidade;
        e.qtd_faturado = 0;
        qtd.map( f => {
          if(e.id === f.pedido_produto_id){
            e.qtd_restante = e.qtd_restante - f.qtd
            e.qtd_faturado = e.qtd_faturado + f.qtd
            e.total = f.qtd * e.valor_unitario
            e.desconto = res.data.desconto
          }
        })
        e.total = e.qtd_faturado * e.valor_unitario;
      })
      this.dados.notas.map(e => e.nota_total = 0);
      this.temp.forEach(element => {
        this.dados.notas.map(e => {
          e.nota_total += element.valor_unitario * element.qtd_faturado
        })
      });
      this.rows = [...this.temp];
      this.rows2 = [...this.temp2];
    })
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows = this.temp.filter(d => {
      if( d.produto.codigo.toLowerCase().indexOf(val) !== -1 || !val 
      || d.produto.nome.toLowerCase().indexOf(val) !== -1 || !val)
      return d
    });
  }

  imprimir(){
    
  }
  close(){
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
