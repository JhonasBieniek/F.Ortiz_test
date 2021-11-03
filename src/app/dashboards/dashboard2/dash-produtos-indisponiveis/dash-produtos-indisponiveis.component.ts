import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogBodyProdutoComponent } from '../../../cadastro/produtos/dialog-body-produto/dialog-body-produto.component';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-dash-produtos-indisponiveis',
  templateUrl: './dash-produtos-indisponiveis.component.html',
  styleUrls: ['./dash-produtos-indisponiveis.component.css']
})
export class DashProdutosIndisponiveisComponent implements OnInit {
  temp: any[] = [];
  rows: any[] = [];
  constructor(private clientservice: ClientService,
    private notificationService: NotificationService,
    private dialog: MatDialog) { 
    this.loadProdutos();
  }

  loadProdutos(){
    this.clientservice.getProdutosIndisponivel().subscribe((res: any) => {
      this.rows = res.data;
      this.temp = [...res.data];
    });
  }

  ngOnInit() {
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return (
        d.nome.toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.produto_tipo.nome.toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.codigo_importacao.toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.rows = temp;
  }

  view(row){
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: "100vw",
      maxHeight: "100vh",

      width: "95vw",
      height: "95vh",
    };
    dialogConfig.data = row;
    dialogConfig.data.action = "edit";
    let dialogRef = this.dialog.open(DialogBodyProdutoComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((value) => {
      this.loadProdutos();
    });
  }
}
