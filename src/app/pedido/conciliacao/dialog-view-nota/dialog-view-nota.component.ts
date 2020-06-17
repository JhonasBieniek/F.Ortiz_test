import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from "@angular/material";
import { ClientService } from '../../../shared/services/client.service.component';
import { DialogEstornarComponent } from './dialog-estornar/dialog-estornar.component';

@Component({
  selector: 'app-dialog-view-nota',
  templateUrl: './dialog-view-nota.component.html',
  styleUrls: ['./dialog-view-nota.component.css']
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
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '95vh',
      width: '70vw',
      height: '70vh'
    }
    this.loadData();
   }
  
  loadData(){
    this.clientservice.getNotasID(this.data.id).subscribe((res:any)=> {
      this.dados = res.data;
      let i = 0;
      this.temp[i] = res.data.pedido.pedido_produtos;
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

  }
  imprimir(){
    
  }
  close(){
    this.dialogRef.close();
  }

  ngOnInit() {
  }


}
