import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';
import { DialogConsumoPrintComponent } from './dialog-consumo-print/dialog-consumo-print.component';

@Component({
  selector: 'app-consumo',
  templateUrl: './consumo.component.html',
  styleUrls: ['./consumo.component.css']
})
export class ConsumoComponent implements OnInit {

  form: FormGroup;
  ramos: any = [];
  representadas: any = [];

  clienteBusca = new FormControl("");
  clientes: any = [];
  $clientes: any = [];

  produtosBusca = new FormControl("");
  produtos: any = [];
  $produtos: any = [];

  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    // this.clientservice.getRamos().subscribe((res:any) =>{
    //   this.ramos = res.data;
    // });

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
      produto_id: [null],
      dtInicio: [null, Validators.required],
      dtFinal: [null, Validators.required],
      codigo: ["produto", Validators.required],
      ordenacao: ["nome", Validators.required],
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
    if(this.form.valid){
      this.clientservice.consumo(this.form.value).subscribe((res: any) => {
        if(res.success == true){
          if(res.data.length > 0 ){
            this.print(res.data)
          }else{
            this.notificationService.notify("Não foi localizado nenhum pedido!");
          }
        }
      });
    }else{
      this.form.markAllAsTouched();
    }
  }

  print(data) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '95vh',
    }
    console.log(this.produtosBusca.value)
    dialogConfig.data = data;
    dialogConfig.data.form = this.form.value;
    dialogConfig.data.cliente = this.form.get("cliente_id").value == null ? null : this.clientes.find( cliente => cliente.id == this.form.get("cliente_id").value);
    dialogConfig.data.representada = this.form.get("representada_id").value == null ? null : this.representadas.find( representada => representada.id == this.form.get("representada_id").value);
    dialogConfig.data.produto = this.form.get("produto_id").value == null ? null : this.produtos.find( produto => produto.id == this.form.get("produto_id").value)
    console.log(dialogConfig)
    let dialogRef = this.dialog.open(
      DialogConsumoPrintComponent,
      dialogConfig
    );
  }

  clear() {
    this.form = this.fb.group({
      representada_id: [null],
      cliente_id: [null],
      produto_id: [null],
      dtInicio: [null, Validators.required],
      dtFinal: [null, Validators.required],
      codigo: ["produto", Validators.required],
      ordenacao: ["nome", Validators.required],
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
