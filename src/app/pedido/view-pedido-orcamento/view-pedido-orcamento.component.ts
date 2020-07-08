import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from "@angular/material";
import { ClientService } from '../../shared/services/client.service.component';


@Component({
  selector: 'app-view-pedido-orcamento',
  templateUrl: './view-pedido-orcamento.component.html',
  styleUrls: ['./view-pedido-orcamento.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class ViewPedidoOrcamentoComponent implements OnInit {
  dados:any ;
  rows:any = [];
  temp:any = [];
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
    this.clientservice.getPedidoId(this.data.pedido.id).subscribe((res:any)=> {
      this.dados = res.data;
      let i = 0;
      this.temp = res.data.pedido.pedido_produtos;
      this.rows = [...this.temp];
      console.log(this.rows, 'Olá')
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
