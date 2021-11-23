import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';
import { DialogProdutosVendidosPrintComponent } from './dialog-produtos-vendidos-print/dialog-produtos-vendidos-print.component';

@Component({
  selector: 'app-produtos-vendidos',
  templateUrl: './produtos-vendidos.component.html',
  styleUrls: ['./produtos-vendidos.component.css']


})
export class ProdutosVendidosComponent implements OnInit {

  form: FormGroup;
  representadas: any = [];
  
  produtosBusca = new FormControl("");
  produtos: any = [];
  $produtos: any = [];

  clienteBusca = new FormControl("");
  clientes: any = [];
  $clientes: any = [];

  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {

    this.clientservice.getRepresentadasAtivas().subscribe((res:any) =>{
      this.representadas = res.data;
    });

    this.clientservice.getProdutosSoft().subscribe((res: any) => {
      this.produtos = res.data;
    });

    this.clientservice.getClientes().subscribe((res:any) =>{
      this.clientes = res.data;
    });
  }
  
  ngOnInit(): void {
    this.form = this.fb.group({
      representada_id: [null],
      cliente_id: [null],
      dtInicio: [null],
      dtFinal: [null],
      produto_id: [null],
      ordenacao: ["codigo", Validators.required],
      tipo: ["asc", Validators.required],
    });
  }

  searchCliente() {
    let $cliente: Observable<any[]>;
    let nome = this.clienteBusca.value;
    if (nome != "") {
      const val = nome.toLowerCase().split(" ");
      let xp = "";
      val.forEach((e) => {
        xp += `(?=.*${e})`;
      });
      const re = new RegExp(xp, "g");
      this.$clientes = this.clientes.filter(function (d) {
        if (
          d.razao_social.toLowerCase().match(re) ||
          d.cnpj.toLowerCase().match(re) ||
          !val
        )
          return d;
      });
    } else {
      this.$clientes = $cliente;
    }
  }

  setCliente(cliente) {
    this.form.get("cliente_id").setValue(cliente.id);
  }

  searchProduto() {
    let $produtos: Observable<any[]>;
    let nome = this.produtosBusca.value;
    if (nome != "") {
      const val = nome.toLowerCase().split(" ");
      let xp = "";
      val.forEach((e) => {
        xp += `(?=.*${e})`;
      });
      const re = new RegExp(xp, "g");
      this.$produtos = this.produtos.filter(function (d) {
        if (
          d.nome.toLowerCase().match(re) || d.codigo_catalogo.toLowerCase().match(re) ||
          !val
        )
          return d;
      });
    } else {
      this.$produtos = $produtos;
    }
  }

  setProduto(produto) {
    this.form.get("produto_id").setValue(produto.id);
  }

  submit() {
    this.clientservice.produtosVendidos(this.form.value).subscribe((res: any) => {
      if(res.success == true){
        if(res.data.length > 0 ){
          this.print(res.data)
        }else{
          this.notificationService.notify("Não foi localizado nenhum pedido!");
        }
      }
    });
  }

  print(data) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '95vh',
    }
    dialogConfig.data = data;
    dialogConfig.data.form = this.form.value;
    let dialogRef = this.dialog.open(
      DialogProdutosVendidosPrintComponent,
      dialogConfig
    );
  }

  clear() {
    this.form = this.fb.group({
      representada_id: [null],
      cliente_id: [null],
      dtInicio: [null],
      dtFinal: [null],
      produto_id: [null],
      ordenacao: ["codigo", Validators.required],
      tipo: ["asc", Validators.required],
    });
    this.clienteBusca.setValue('');
    this.$clientes = [];

    this.produtosBusca.setValue('');
    this.$produtos = [];
  }

  limpar(){
    this.form.get('cliente_id').setValue(null);
    this.clienteBusca.setValue('');
    this.$clientes = [];
  }

  limparProduto(){
    this.form.get('produto_id').setValue(null);
    this.produtosBusca.setValue('');
    this.$produtos = [];
  }
}