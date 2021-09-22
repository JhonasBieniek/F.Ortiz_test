import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from "@angular/material";
import { ClientService } from '../../shared/services/client.service.component';
import { OrcamentoComponent } from '../orcamento/orcamento.component';


@Component({
  selector: 'app-view-orcamento',
  templateUrl: './view-orcamento.component.html',
  styleUrls: ['./view-orcamento.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class ViewOrcamentoComponent implements OnInit {
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
    public dialogRef: MatDialogRef<ViewOrcamentoComponent>,
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
      this.temp = res.data.orcamento_produtos;
      this.rows = [...this.temp];
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

  imprimir(id){
      window.open(
        `/api/orcamentos/download/${id}.pdf`,
        "_blank"
      );
  }
  editar(data){
    this.dialogConfig.data = {
      tipo: 'edit',
      orcamento: data
    }
    let dialogRef = this.dialog.open(OrcamentoComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      this.loadData();
    })
  }
  close(){
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
