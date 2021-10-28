import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from "@angular/material";
import { Observable } from 'rxjs';
import { LoginService } from '../../authentication/login/login.service';
import { ClientService } from '../../shared/services/client.service.component';
import { GoogleService } from '../../shared/services/google.service.component';
import { DialogMailComponent } from '../view-orcamento/dialog-mail/dialog-mail.component';


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
  user: gapi.auth2.GoogleUser;
  constructor(
    private clientservice: ClientService,
    private dialog: MatDialog,
    private googleservice: GoogleService,
    private http: HttpClient,
    private loginservice: LoginService,
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
    this.getUser();
  }

  getUser() {
    this.loginservice.getCurrentUser().subscribe((response) => {
      this.user = response.currentUser.get()
    });
  }
  
  loadData(){
    this.clientservice.getOrcPedido(this.data.pedido.id, this.data.tipo).subscribe((res:any)=> {
      this.dados = res.data;
      console.log(this.dados)
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

  imprimir(id) {
    window.open(
      `/api/pedidos/download/${id}.pdf`,
      "_blank"
    );
  }

  getPdf(url): Observable<Blob> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.get(url, { headers: headers, responseType: 'blob' });
  }

  blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  sendEmail(id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = []
    dialogConfig.data.email = this.dados.cliente.email
    let dialogRef = this.dialog.open(DialogMailComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(value => { 
      if(value != null){
        this.getPdf("https://test2.fortiz.com.br/api/pedidos/download/" + id + ".pdf")
        .subscribe(
          (data: Blob) => {
            this.blobToBase64(data).then((response:any) => {
              this.googleservice.sendEmailAttach(this.user, response.substr(response.indexOf (',') + 1), this.dados.cliente.email , "Pedido",value.mensagem,"Pedido Nº "+ this.dados.num_pedido + " - " + this.dados.representada.razao_social, value.cc);
            });
          },
          (error) => {
            console.log('getPDF error: ',error);
          }
        );
      } 
    });
  }

  close(){
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
