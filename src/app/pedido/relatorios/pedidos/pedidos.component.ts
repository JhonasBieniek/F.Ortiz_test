import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';
import { DialogPedidosPrintComponent } from './dialog-pedidos-print/dialog-pedidos-print.component';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']


})
export class PedidosComponent implements OnInit {


  form: FormGroup;
  ramos: any = [];
  representadas: any = [];

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
    this.clientservice.getRamos().subscribe((res: any) => {
      this.ramos = res.data;
    });

    this.clientservice.getRepresentadas().subscribe((res: any) => {
      this.representadas = res.data;
    });

    this.clientservice.getClientes().subscribe((res:any) =>{
      this.clientes = res.data;
    });
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      situacao: ["todos", Validators.required],
      representada_id: [null],
      cliente_id: [null],
      ramo_id: [null],
      periodo_inicial: [null],
      periodo_final: [null],
      entrega_inicial: [null],
      entrega_final: [null],
      // tipo_cliente: ["todos", Validators.required],
      ordenacao: ["data", Validators.required],
      tipo: ["asc", Validators.required],
    });

  }

  submit() {
    this.clientservice.pedidosRelatorio(this.form.value).subscribe((res: any) => {
      if(res.success == true){
        if(res.data.length > 0 ){
          this.print(res.data)
        }else{
          this.notificationService.notify("Não foi localizado nenhum pedido!");
        }
      }
    });
  }

  clear() {
    this.form = this.fb.group({
      situacao: ["todos", Validators.required],
      representada_id: [null],
      cliente_id: [null],
      ramo_id: [null],
      periodo_inicial: [null],
      periodo_final: [null],
      entrega_inicial: [null],
      entrega_final: [null],
      // tipo_cliente: ["todos", Validators.required],
      ordenacao: ["data", Validators.required],
      tipo: ["asc", Validators.required],
    });;

    this.clienteBusca.setValue('');
    this.$clientes = [];
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
      DialogPedidosPrintComponent,
      dialogConfig
    );
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

  limpar(){
    this.form.get('cliente_id').setValue(null);
    this.clienteBusca.setValue('');
    this.$clientes = [];
  }
}