import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatSnackBar } from "@angular/material";
import { ClientService } from '../../../shared/services/client.service.component';
import { DialogEstornarComponent } from './dialog-estornar/dialog-estornar.component';
import { DialogDevolucaoComponent } from './dialog-devolucao/dialog-devolucao.component';
import { DialogEditNotaComponent } from '../dialog-edit-nota/dialog-edit-nota.component';
import { DialogDeleteNotaComponent } from '../dialog-delete-nota/dialog-delete-nota.component';
import { DialogSendNotaComponent } from '../dialog-add-nota/dialog-send-nota/dialog-send-nota.component';
import { DialogCancelarNotaComponent } from './dialog-cancelar-nota/dialog-cancelar-nota.component';

@Component({
  selector: 'app-dialog-view-nota',
  templateUrl: './dialog-view-nota.component.html',
  styleUrls: ['./dialog-view-nota.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogViewNotaComponent implements OnInit {
  dados: any;
  rows: any = [];
  temp: any = [];
  selected: any = [];

  dialogConfig = new MatDialogConfig();

  steps: any = [
    {
      titulo: "Produtos do Pedido",
      step: true,
      index: 0
    }
  ];

  devolucoes: any[] = [];
  estornos: any[] = [];

  defaultTab = 0;

  constructor(
    private clientservice: ClientService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogViewNotaComponent>,
    private _snackBar: MatSnackBar,
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

  loadData() {
    this.clientservice.getNotasID(this.data.id).subscribe((res: any) => {
      
      // old - Mostra tudo
      // this.dados = res.data;
      // this.temp[0] = res.data.pedido.pedido_produtos;
      // let qtd = res.data.nota_produtos;
      // this.temp[0].map(e => {
      //   qtd.map(f => {
      //     if (e.id === f.pedido_produto_id) {
      //       e.qtd_restante = e.quantidade - f.qtd
      //       e.qtd_faturado = f.qtd
      //       e.total = f.qtd * e.valor_unitario
      //       e.desconto = res.data.desconto
      //     }
      //   })
      // })
      // this.rows = [...this.temp];
      // fim old
      
      this.dados = res.data;
      this.devolucoes = res.data.nota_produto_devolutions;
      this.estornos = res.data.nota_parcelas.filter( parcelas => { return parcelas.estorno === true});
      console.log(this.estornos)
      this.temp[0] = res.data.pedido.pedido_produtos;
      let qtd = res.data.nota_produtos;
      this.temp[0].map(e => {
        qtd.map(f => {
          if (e.id === f.pedido_produto_id) {
            e.qtd_restante = e.quantidade - f.qtd
            e.qtd_faturado = f.qtd
            e.total = f.qtd * e.valor_unitario
            e.desconto = res.data.desconto
          }
        })
      })
      this.rows[0] = this.temp[0].filter( produto => {
        if(produto.qtd_faturado > 0 ) return produto;
      })
      // console.log(teste)
      // this.rows = [...this.temp];
      // console.log(this.rows);
      
    })
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows[this.defaultTab] = this.temp[this.defaultTab].filter(d => {
      if (d.produto.codigo.toLowerCase().indexOf(val) !== -1 || !val
        || d.produto.nome.toLowerCase().indexOf(val) !== -1 || !val)
        return d
    });
  }
  removerNf() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = []
    dialogConfig.data.nome = 'NF ' + this.data.num_nota;
    let dialogRef = this.dialog.open(DialogDeleteNotaComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      if (value == true) {
        this.clientservice.removeNota(this.data.id).subscribe((res: any) => {
          if (res.success == true) {
            this._snackBar.open('Nota removida com sucesso!', 'OK', {
              duration: 3000,
            })
          } else {
            this._snackBar.open('Erro ao remover nota', 'OK', {
              duration: 3000,
            })
          }
          this.close();
        })
      }
    });
  }

  verificarParcelas(){
    if(this.dados){
      let index = this.dados.nota_parcelas.findIndex(parcela => { return parcela.status_recebimento === true});
      return index == -1 ? true : false;
    }else{
      return true;
    }
    
  }

  cancelarNf() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = []
    dialogConfig.data.nome = 'NF ' + this.data.num_nota;
    let dialogRef = this.dialog.open(DialogCancelarNotaComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      if (value == true) {
        this.clientservice.cancelarNota(this.data.id).subscribe((res: any) => {
          if (res.success == true) {
            this._snackBar.open('Nota cancelada com sucesso!', 'OK', {
              duration: 3000,
            })
          } else {
            this._snackBar.open('Erro ao cancelar a nota', 'OK', {
              duration: 3000,
            })
          }
          this.close();
        })
      }
    });
  }


  estorno() {
    this.dialogConfig.data = this.dados
    let dialogRef = this.dialog.open(
      DialogEstornarComponent,
      this.dialogConfig,

    );
    dialogRef.afterClosed().subscribe(value => {
      if(value === true) this.loadData();
    });
  }
  devolucao() {
    this.dialogConfig.data = this.dados
    let dialogRef = this.dialog.open(
      DialogDevolucaoComponent,
      this.dialogConfig,

    );
    dialogRef.afterClosed().subscribe(value => {
      if(value != undefined){
        this.loadData();
      }
    });
  }
  imprimir() {

  }
  close() {
    this.dialogRef.close('done');
  }

  ngOnInit() {
  }

  editar() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '95vh',
      width: '90vw',
      height: '95vh'
    }
    dialogConfig.data = this.dados
    let dialogRef = this.dialog.open(
      DialogEditNotaComponent,
      dialogConfig,

    );
    dialogRef.afterClosed().subscribe(value => {
      console.log(value);
      if(value != undefined){
        this.data.num_nota = value.num_nota;
        this.loadData();
      }
    });
  }

  valorFaturado(){
    let valorFaturado = 0;
    if(this.rows[0] != undefined){
      this.rows[0].map(produto => {
        valorFaturado = valorFaturado + produto.total;
      })
    }

    return valorFaturado;
  }

  valorRestante(){
    let valorFaturado = 0;
    if(this.rows[0] != undefined){
      this.rows[0].map(produto => {
        valorFaturado = valorFaturado + produto.total;
      })
      return this.dados.pedido.valor_total - valorFaturado;
    }else{
      return valorFaturado;
    }
    
  }

  adicionarNf() {
    // console.log(this.dados);
    // console.log(this.data);

    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '95vh',
      width: '90vw',
      height: '95vh'
    }
    dialogConfig.data = this.dados.pedido;
    let dialogRef = this.dialog.open(
      DialogSendNotaComponent,
      dialogConfig,
    );
    dialogRef.afterClosed().subscribe(value => {
      console.log(this.dados)
      // if (value == true) {
      //   this.selected = [];
      //   this.loadData();
      // }
    });
  }

}
