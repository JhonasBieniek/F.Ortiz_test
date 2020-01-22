import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ClientService } from '../../shared/services/client.service.component';
import { NotificationService } from '../../shared/messages/notification.service';

import { OrderService } from '../../shared/services/order.service.component';
import { OrderItem } from '../order-item.model';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { MatDialog } from '@angular/material';
import { ItemPedido } from '../itemPedido.model';
import { DateFormatPipe } from '../../shared/pipes/dateFormat.pipe';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html',
  styleUrls: ['./novo.component.scss'],
  providers: [DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})

export class NovoComponent implements OnInit {

  @Input() item: OrderItem
  @Output() add = new EventEmitter()

  public form: FormGroup;
  quantidade: any[] = [];
  cep: any;
  modelCidade: any;
  modelEstado: any;
  modelLogradouro: any;
  modelBairro: any;
  modelCEP: any;
  modelComplemento: any;
  modelNumero: any;

  dataRepresentadas: any;
  representadas = [];
  dataClientes: any;
  clientes = [];
  dataCondComerciais: any;
  condComerciais = [];
  dataAreaVenda: any;
  areas = [];

  selectedRepresentada: any;
  selectedCliente: string;
  selectedCondComerciais: string;
  selectedAreaVenda;

  data: any = [];
  editing = {};
  rows = [];
  temp = [...this.data];
  selected = [];

  resposta: any;
  selectedAreaVendaID: any;

  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  columns = [
    { prop: 'codigo' },
    { prop: 'nome' },
    { prop: 'unidade.descricao' },
    { prop: 'embalagem' },
    { prop: 'tamanho' }
  ];

  @ViewChild('shoppingCart') shoppingCart: ShoppingCartComponent;
  @ViewChild(NovoComponent) table: NovoComponent;

  constructor(private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private orderservice: OrderService,
    private dateFormatPipe: DateFormatPipe,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.clientservice.getRepresentadas().subscribe(res => {
      this.dataRepresentadas = res;
      this.representadas = this.dataRepresentadas.data;
    });
    this.clientservice.getClientes().subscribe(res => {
      this.dataClientes = res;
      this.clientes = this.dataClientes.data;
    });
    this.clientservice.getCondComerciais().subscribe(res => {
      this.dataCondComerciais = res;
      this.condComerciais = this.dataCondComerciais.data;
    });
    this.clientservice.getAreaVenda().subscribe(res => {
      this.dataAreaVenda = res;
      this.areas = this.dataAreaVenda.data;
    });
    this.orderservice.clear();
  }

  ngOnInit() {
    this.form = this.fb.group({
      cliente: [null, Validators.compose([Validators.required, CustomValidators.digits])],
      cep: [null],
      logradouro: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      numero: [null, Validators.compose([Validators.required])],
      complemento: [null, Validators.compose([Validators.minLength(1), Validators.maxLength(50)])],
      bairro: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      cidade: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      estado: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      comprador: [null, Validators.compose([Validators.minLength(2), Validators.maxLength(30)])],
      pedido: [null, Validators.compose([Validators.required])],
      observacao: [null, Validators.compose([Validators.maxLength(100)])],
      programado: [null, Validators.compose([Validators.required, CustomValidators.date])],
      emissao: [null, Validators.compose([Validators.required, CustomValidators.date])],
      entrega: [null, Validators.compose([Validators.required, CustomValidators.date])],
      frete: [null, Validators.required],
      transportadora: [null, Validators.compose([Validators.maxLength(100)])],
      active: [null, Validators.required],
    });
  }

  items(): any[] {
    return this.orderservice.items;
  }
  total(): number {
    return this.orderservice.total();
  }
  clear() {
    this.orderservice.clear();
  }
  removeItem(item: any) {
    this.orderservice.removeItem(item)
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.codigo.toLowerCase().indexOf(val) !== -1 || !val ||
        d.nome.toLowerCase().indexOf(val) !== -1 || !val ||
        d.unidade.descricao.toLowerCase().indexOf(val) !== -1 || !val
    });
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table = this.data;
  }
  addItemNew(item: ItemPedido) {
    this.orderservice.addItemNew(item)
  }
  addItem(item: ItemPedido) {
    this.orderservice.addItem(item)
    this.shoppingCart.addForm()
  }
  chargeAdress() {
    this.clientservice.getClientesId(this.selectedCliente).subscribe((res: any) => {
      this.selectedAreaVendaID = res.data[0].area_venda_id;
      this.chargeAreaVendas(res.data[0].area_venda);
      this.cep = res
      if (this.cep.data[0].endereco[0].logradouro != 'error') {
        //this.notificationService.notify(`Endereço inserido com sucesso!`)
        this.modelLogradouro = this.cep.data[0].endereco[0].logradouro
        this.modelBairro = this.cep.data[0].endereco[0].bairro
        this.modelCidade = this.cep.data[0].endereco[0].cidade
        this.modelEstado = this.cep.data[0].endereco[0].estado
        this.modelCEP = this.cep.data[0].endereco[0].cep
        this.modelComplemento = this.cep.data[0].endereco[0].complemento
        this.modelNumero = this.cep.data[0].endereco[0].numero
        console.log(this.cep.data[0].endereco[0].logradouro)
      } else {
        this.notificationService.notify(`Endereço Inválido`)
      }
    })
  }
  chargeAreaVendas(data) {
    this.selectedAreaVenda = data
  }
  CarregarProdutosRepresentada() {
    this.clientservice.getProdutosRepresentada(this.selectedRepresentada).subscribe(res => {
      this.data = res;
      this.rows = this.data.data;
      this.temp = [...this.data.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
    })
  }
  onSelect({ selected }) {
    let itemSelected = selected[0]
    this.addItem(itemSelected);
  }
  onBlurCep() {
    this.clientservice.getCep(this.form.value.cep).subscribe(res => {
      this.cep = res
      if (this.cep.data != 'error') {
        this.notificationService.notify(`Cep inserido com sucesso!`)
        this.modelCidade = this.cep.data.cidade
        this.modelEstado = this.cep.data.estado
        this.modelLogradouro = this.cep.data.logradouro
        this.modelBairro = this.cep.data.bairro
      } else {
        this.notificationService.notify(`Cep Inválido`)
      }
    })
  }
  enviarPedido() {
    let pedido;
    pedido = {
      representada_id: this.selectedRepresentada,
      cliente_id: this.selectedCliente,
      condicao_comercial_id: this.selectedCondComerciais,
      vendedor_id: this.selectedAreaVenda.vendedor_id,
      auxiliar_id: this.selectedAreaVenda.auxiliar_id,
      regiao_id: this.selectedAreaVenda.regiao_id,
      num_pedido: this.form.value.pedido,
      data_emissao: this.dateFormatPipe.transform(new Date(this.form.value.emissao)),
      data_entrega: this.dateFormatPipe.transform(new Date(this.form.value.entrega)),
      data_programada: this.dateFormatPipe.transform(new Date(this.form.value.programado)),
      desconto: 5,
      frete: this.form.value.frete,
      transportadora: this.form.value.transportadora,
      valor_total: 1000,
      comissao_media: 3,
      comissao_bruto: 93.348,
      status: true,
      entregue: false,
      obs: this.form.value.observacao,
      pedido_produtos: this.produtos()
    }
    this.clientservice.addPedido(pedido).subscribe(res => {
      this.resposta = res
      if (this.resposta.status == 'success') {
        this.notificationService.notify(`Pedido Cadastrado com Sucesso!`)
        setTimeout(() => { this.router.navigate(['/pedido/', 'listar']) }, 1500);
      } else {
        this.notificationService.notify(`Erro contate o Administrador`)
      }
    }
    );
  }
  produtos() {
    let produtos = [];
    this.items().forEach(element => {
      produtos.push({
        cliente_id: element.cliente,
        produto_id: element.id,
        quantidade: element.quantidade,
        unidade: element.unidade,
        embalagem: element.embalagem,
        tamanho: element.tamanho,
        ipi: element.ipi,
        desconto: element.desconto,
        valor_unitario: element.valorUnitario,
        valor_total: element.valorTotal,
        comissao_produto: element.comissao,
        observacao: element.observacao
      })
    })
    return produtos
  }
  hide = true;
}
