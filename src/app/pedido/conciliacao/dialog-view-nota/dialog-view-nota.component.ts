import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatSnackBar } from "@angular/material";
import { ClientService } from '../../../shared/services/client.service.component';
import { DialogEstornarComponent } from './dialog-estornar/dialog-estornar.component';
import { DialogDevolucaoComponent } from './dialog-devolucao/dialog-devolucao.component';
import { DialogEditNotaComponent } from '../dialog-edit-nota/dialog-edit-nota.component';
import { DialogDeleteNotaComponent } from '../dialog-delete-nota/dialog-delete-nota.component';

@Component({
  selector: 'app-dialog-view-nota',
  templateUrl: './dialog-view-nota.component.html',
  styleUrls: ['./dialog-view-nota.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogViewNotaComponent implements OnInit {
  dados:any ;
  rows:any = [];
  temp:any = [];
  selected:any = [];

  dialogConfig = new MatDialogConfig();
  
  steps: any = [
    {
      titulo: "Produtos do Pedido",
      step: true,
      index: 0
    }
  ];

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
  
  loadData(){
    this.clientservice.getNotasID(this.data.id).subscribe((res:any)=> {
      this.dados = res.data;
      this.temp[0] = res.data.pedido.pedido_produtos;
      let qtd = res.data.nota_produtos;
      this.temp[0].map( e => {
        qtd.map( f => {
          if(e.id === f.pedido_produto_id){
            e.qtd_restante = e.quantidade - f.qtd
            e.qtd_faturado = f.qtd
            e.total = f.qtd * e.valor_unitario
            e.desconto = res.data.desconto
          }
        })
      })
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
  removerNf(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = []
    dialogConfig.data.nome = 'NF '+ this.data.num_nota;
    let dialogRef = this.dialog.open(DialogDeleteNotaComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      if (value == true ){
        this.clientservice.removeNota(this.data.id).subscribe((res:any) => {
          if(res.success == true){
          this._snackBar.open('Nota removida com sucesso!', 'OK', {
            duration: 3000,
          })}else{
            this._snackBar.open('Erro ao remover nota', 'OK', {
              duration: 3000,
          })}
          this.close();
        })
      }
    });
  }
  estorno(){
    this.dialogConfig.data = this.dados
    let dialogRef = this.dialog.open(
      DialogEstornarComponent, 
      this.dialogConfig, 
      
    );
    dialogRef.afterClosed().subscribe(value => {
      console.log(value)
    });
  }
  devolucao(){
    this.dialogConfig.data = this.dados
    let dialogRef = this.dialog.open(
      DialogDevolucaoComponent, 
      this.dialogConfig, 
      
    );
    dialogRef.afterClosed().subscribe(value => {
      console.log(value)
    });
  }
  imprimir(){
    
  }
  close(){
    this.dialogRef.close('done');
  }

  ngOnInit() {
  }
  editar(){
    this.dialogConfig.data = this.dados
    let dialogRef = this.dialog.open(
      DialogEditNotaComponent, 
      this.dialogConfig, 
      
    );
    dialogRef.afterClosed().subscribe(value => {
      console.log(value)
    });
  }

}
