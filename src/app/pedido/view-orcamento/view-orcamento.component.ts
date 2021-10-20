import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from "@angular/material";
import { Observable } from 'rxjs';
import { LoginService } from '../../authentication/login/login.service';
import { NotificationService } from '../../shared/messages/notification.service';
import { ClientService } from '../../shared/services/client.service.component';
import { GoogleService } from '../../shared/services/google.service.component';
import { OrcamentoComponent } from '../orc-listar/orcamento/orcamento.component';
import { DialogMailComponent } from './dialog-mail/dialog-mail.component';

@Component({
  selector: 'app-view-orcamento',
  templateUrl: './view-orcamento.component.html',
  styleUrls: ['./view-orcamento.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewOrcamentoComponent implements OnInit {
  dados: any;
  rows: any = [];
  rows2: any = [];
  temp: any = [];
  temp2: any = [];
  selected: any = [];

  dialogConfig = new MatDialogConfig();

  user: gapi.auth2.GoogleUser
  constructor(
    private clientservice: ClientService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ViewOrcamentoComponent>,
    private http: HttpClient,
    private loginservice: LoginService,
    private googleservice: GoogleService,
    private notificationservice: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
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

  loadData() {
    this.clientservice.getOrcPedido(this.data.pedido.id, this.data.tipo).subscribe((res: any) => {
      this.dados = res.data;
      this.temp = res.data.orcamento_produtos;
      this.rows = [...this.temp];
    })
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows = this.temp.filter(d => {
      if (d.produto.codigo.toLowerCase().indexOf(val) !== -1 || !val
        || d.produto.nome.toLowerCase().indexOf(val) !== -1 || !val)
        return d
    });
  }

  imprimir(id) {
    window.open(
      `/api/orcamentos/download/${id}.pdf`,
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
        this.getPdf("https://test2.fortiz.com.br/api/orcamentos/download/" + id + ".pdf")
        .subscribe(
          (data: Blob) => {
            this.blobToBase64(data).then((response:any) => {
              this.googleservice.sendEmailAttach(this.user, response.substr(response.indexOf (',') + 1), this.dados.cliente.email ,value.mensagem, "Cotação Nº "+ this.dados.id + " - " + this.dados.representada.razao_social, value.cc);
            });
          },
          (error) => {
            console.log('getPDF error: ',error);
          }
        );
      } 
    });
  }

  editar(data) {
    this.dialogConfig.data = {
      tipo: 'edit',
      orcamento: data
    }
    let dialogRef = this.dialog.open(OrcamentoComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      this.loadData();
    })
  }
  close() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
