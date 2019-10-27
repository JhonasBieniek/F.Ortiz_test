import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ClientService } from '../../shared/services/client.service.component';
import { NotificationService } from '../../shared/messages/notification.service';

import * as XLSX from 'xlsx'
import { OrderService } from '../../shared/services/order.service.component';
import { OrderItem } from '../order-item.model';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { MatDialogConfig, MatDialog, MatStepper } from '@angular/material';
import { DialogCadastroComponent } from '../novo/dialog-cadastro/dialog-cadastro.component';
import { DialogClienteAddComponent } from '../novo/dialog-body/dialog-body-cliente.component';
import { ItemPedido } from '../itemPedido.model';
import { DateFormatPipe } from '../../shared/pipes/dateFormat.pipe';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

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
  selector: 'app-novo2',
  templateUrl: './novo2.component.html',
  styleUrls: ['./novo2.component.scss'],
  providers: [DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})

export class Novo2Component implements OnInit {

  @Input() item: OrderItem
  @Output() add = new EventEmitter()


  public form: FormGroup;
  quantidade: any[] = [];

  representadas = [];
  clientes = [];
  condComerciais = [];
  areas = [];
  upload: any;

  selectedRepresentada: any;
  selectedCliente: string;
  selectedCondComerciais: string;
  selectedAreaVenda;

  data: any = [];
  editing = {};
  rows = [];
  temp = [...this.data];
  selected = [];

  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  columns = [
    { prop: 'codigo' },
    { prop: 'nome' },
    { prop: 'unidade.descricao' },
    { prop: 'embalagem' },
    { prop: 'tamanho' }
  ];

  arrayBuffer: any;
  file: File;
  planilha: any;
  linha: any;
  campos = [];
  dialogDados = [];
  dialogCNPJ = [];
  cliente: string;
  clienteId: Object;
  pedido: string;
  transportadora: string;
  ValorTotal: number = 0;
  checked = false;
  emissao: any;
  entrega: any;
  frete: any;
  auxI = 0;
  dialogRef
  dialogProd: boolean;
  resposta: any;
  selectedAreaVendaID: any;
  representada: string;
  selectRepresentada: string = "Selecione a representada";
  condComercial: any;

  incomingfile(event) {
    this.file = event.target.files[0]
    this.importar();
    this.selectRepresentada = `Representada selecionada: ${this.representada.toUpperCase()}`
  }

  importar() {
    this.spinner.show();
    this.planilha = new FileReader();
    this.planilha.onload = (e) => {
      this.arrayBuffer = this.planilha.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary", raw: true });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true, header: 1 }));
      var json = XLSX.utils.sheet_to_json(worksheet, { raw: true, header: 1 });
      this[this.representada](json);
    }
    this.planilha.readAsArrayBuffer(this.file);
  }

  async volk(data) {
    var inicial = 0;
    var final = 0;
    this.cliente = (data[7][3].toString().length == 13)? "0"+data[7][3]: data[7][3];
    this.pedido = data[6][1];
    this.transportadora = data[18][2];
    this.condComercial = data[12][1];
    this.emissao = moment(data[6][3].replace(/\//g, "-"), 'DD-MM-YYYY').format("YYYY-MM-DD")
    this.entrega = moment(data[21][4], 'DD-MM-YYYY').format("YYYY-MM-DD")
    this.frete = data[17][1] = "C" ? "Cliente" : "Representada"
    this.selectedRepresentada = 15;

    while (inicial <= final) {
      while (data[final][0] != "Valor Produtos.....:") {
        final++;
        while (data[inicial][0] != "Produto") {
          inicial++;
        }
      }
      if (data[inicial][0] != "Produto" && data[inicial][0] != "Valor Produtos.....:") {
        var produto = {
            codigo: data[inicial][0],
            nome: data[inicial][2],
            quantidade: data[inicial][5],
            tamanho: data[inicial][1],
            ipi: data[inicial][9],
            valorUnitario: data[inicial][6],
            comissao: data[inicial][11]
        }
        await this.consultaCod(produto).then((res: any) => {
          console.log(res, "return promise consulta")
          if (res != undefined) {
            this.addItemPlan(res) //* Adiciona item à item que já esteja cadastrado no banco
            console.log('oi')
          } else {
            this.dialogProd = true;
          }
        })
      }
      inicial++;
    }
    this.ValorTotal = data[final][1];
    if (inicial > final) {
      if (this.dialogProd == true) {
        this.openDialogVolk()
      }
    }
    // setTimeout(() => {this.chargeItens()}, 2000);
    if (String(this.cliente).length == 14) {
      console.log('14')
      this.clientservice.getClientesCnpj(this.cliente).subscribe((res: any) => {
        if (res.success == true) {
          this.selectedCliente = res.data.id;
          this.selectedAreaVendaID = res.data.area_venda_id;
        } else {
          this.openDialogCNPJ(this.cliente)
        }
      })
    } else {
      this.notificationService.notify("CNPJ INCORRETO!")
    }
    this.CarregarProdutosRepresentada();
    this.spinner.hide();
  }

  async camper(data) {
    var inicial = 0;
    var final = 0;
    this.pedido = data[0][0].toString().match(new RegExp("\\d+", "g"))[0];
    this.cliente = data[2][0].toString().match(new RegExp("\\d{2}\\.\\d{3}\\.\\d{3}\\/\\d{4}\\-\\d{2}", "g"))[0];
    this.cliente = this.cliente.replace(/[^\d]+/g, '');
    this.cliente = (this.cliente.length == 13)? "0"+this.cliente: this.cliente;
    this.transportadora = null;
    this.entrega = null;
    this.ValorTotal = null;
    this.frete = null;
    this.selectedRepresentada = 13;

    while (inicial <= final) {
      while (data[final][0] != "Peso bruto total:" && data[final][0] != "Valor Total:") {
        final++;
        while (data[inicial][0] != "Produto") {
          inicial++;
        }
      }
      if (data[inicial][0] != "Produto" && data[inicial][0] != "Peso bruto total:" && data[final][0] != "Valor Total:") {
        var produto = {
          codigo: data[inicial][0].split(" - ")[0].trim(),
          nome: data[inicial][0].split(" - ")[1],
          quantidade: data[inicial][1].toString().match(new RegExp("\\d+", "g"))[0],
          tamanho: null,
          ipi: null,
          valorUnitario: data[inicial][3],
          comissao: null
        }
        console.log(produto);
        await this.consultaCod(produto).then((res: any) => {
          console.log(res, "return promise consulta")
          if (res != undefined) {
            this.addItemPlan(res) //* Adiciona item à item que já esteja cadastrado no banco
            console.log('oi')
          } else {
            this.dialogProd = true;
          }
        })
      }
      inicial++;
    }
    this.condComercial = data[final+2][0].toString().match(new RegExp("\\d{2}\\/\\d{2}\\/\\d{2}", "g"))[0];
    this.emissao = moment(data[final+2][0].toString().match(new RegExp("\\d{2}\\/\\d{2}\\/\\d{4}", "g"))[0].replace(/\//g, "-"), 'DD-MM-YYYY').format("YYYY-MM-DD");

    if (inicial > final) {
      if (this.dialogProd == true) {
        this.openDialogVolk()
      }
    }
    // setTimeout(() => {this.chargeItens()}, 2000);
    if (String(this.cliente).length == 14) {
      console.log('14')
      this.clientservice.getClientesCnpj(this.cliente).subscribe((res: any) => {
        if (res.success == true) {
          this.selectedCliente = res.data.id;
        } else {
          this.openDialogCNPJ(this.cliente)
        }
      })
    } else {
      this.notificationService.notify("CNPJ INCORRETO!")
    }
    this.CarregarProdutosRepresentada();
    this.spinner.hide();
  }

  async kadesh(data) {
    var inicial = 0;
    var final = 0;

    this.cliente = data[7][0].toString().match(new RegExp("\\d{14}", "g"))[0];
    this.pedido = data[3][0];
    this.condComercial = data[12][0].split(" ")[0]+" "+data[12][0].split(" ")[1];
    this.emissao = moment(data[4][0].match(new RegExp("\\d{2}\\/\\d{2}\\/\\d{4}", "g"))[0].replace(/\//g, "-"), 'DD-MM-YYYY').format("YYYY-MM-DD")
    this.selectedRepresentada = 21;

    while (inicial <= final) {
      while (data[final][0] != "Soma Quant.") {
        final++;
        while (data[inicial][0].toString().split(" ", 1)[0] != "Descrição") {
          inicial++;
        }
      }
      if (data[inicial][0] != undefined) {
        if (data[inicial][0].toString().split(" ", 1)[0] != "Descrição" && data[inicial][0] != "Soma Quant.") {
          console.log(data[inicial][0]);
        }
      }
      inicial++;
    }
    this.ValorTotal = data[final+7][0];
    this.frete = data[final+9][0] = "CIF Destino" ? "Cliente" : "Representada"
    this.transportadora = data[final+11][0];
  }

  async betanin(data) {
    var inicial = 0;
    var final = 0;

    this.cliente = data[5][5].replace(/[^\d]+/g, '');
    this.cliente = (this.cliente.length == 13)? "0"+this.cliente: this.cliente;
    this.pedido = data[1][31];
    this.condComercial = data[2][31];
    this.emissao = moment(data[3][31].replace(/\//g, "-"), 'DD-MM-YYYY').format("YYYY-MM-DD")
    this.entrega = null;
    this.selectedRepresentada = 16;

    while (inicial <= final) {
      while (data[final][0] != "Texto da nota") {
        final++;
        while (data[inicial][0] != "Item") {
          inicial++;
        }
      }
      if (data[inicial][0] != "Item" && data[inicial][0] != "Texto da nota" && data[inicial][0] != undefined) {
        var produto = {
          codigo: data[inicial][3],
          nome: data[inicial][6],
          quantidade: data[inicial][15].split("/")[1],
          tamanho: null,
          ipi: data[inicial][33],
          valorUnitario: data[inicial][27],
          comissao: null
        }
        console.log(produto);
        await this.consultaCod(produto).then((res: any) => {
          console.log(res, "return promise consulta")
          if (res != undefined) {
            this.addItemPlan(res) //* Adiciona item à item que já esteja cadastrado no banco
            console.log('oi')
          } else {
            this.dialogProd = true;
          }
        })
      }
      inicial++;
    }
    this.transportadora = data[final+7][5];
    this.frete = (data[final+8][5] == "CIF")? "Cliente" : "Representada";
    this.ValorTotal = data[final+9][31];
    if (inicial > final) {
      if (this.dialogProd == true) {
        this.openDialogVolk()
      }
    }
    // setTimeout(() => {this.chargeItens()}, 2000);
    if (String(this.cliente).length == 14) {
      console.log('14')
      this.clientservice.getClientesCnpj(this.cliente).subscribe((res: any) => {
        if (res.success == true) {
          this.selectedCliente = res.data.id;
        } else {
          this.openDialogCNPJ(this.cliente)
        }
      })
    } else {
      this.notificationService.notify("CNPJ INCORRETO!")
    }
    this.CarregarProdutosRepresentada();
    this.spinner.hide();
  }


  @ViewChild('shoppingCart') shoppingCart: ShoppingCartComponent;
  @ViewChild(Novo2Component) table: Novo2Component;

  constructor(private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private orderservice: OrderService,
    private dateFormatPipe: DateFormatPipe,
    private dialog: MatDialog,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
    this.clientservice.getRepresentadas().subscribe((res: any) => {
      this.representadas = res.data;
    });
    this.clientservice.getClientes().subscribe((res: any) => {
      this.clientes = res.data;
    });
    this.clientservice.getCondComerciais().subscribe((res: any) => {
      this.condComerciais = res.data;
    });
    this.clientservice.getAreaVenda().subscribe((res: any) => {
      this.areas = res.data;
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


  async consultaCod(produto:any): Promise<any> {
    let campos;
    let newItem;
    return new Promise(async (resolve, reject) => {
      this.clientservice.getProdutoCode(produto.codigo).subscribe((res: any) => {
        if (res.success == true) {
          console.log("cadastrado", res);
          campos = produto;
          campos.embalagem = res.data.embalagem;
          campos.unidade = res.data.unidade.sigla;
          campos.id = res.data.id;
        } else {
          newItem = produto;
          newItem.certificado_aprovacao = '';
          newItem.embalagem = '';
          newItem.representada_id = this.selectedRepresentada;
          newItem.unidade_id = '';
          newItem.status = 1;
          this.addItemNew(newItem)
        }
        resolve(campos)
      })
    })
  }


  items(): any[] {
    return this.orderservice.items;
  }
  // total(): number {
  //   return this.orderservice.total();
  // }
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
  addItemPlan(item: ItemPedido) {
    this.orderservice.addItemPlan(item)
    this.shoppingCart.addForm()
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
  openDialogVolk() {
    console.log("dialog")
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '75vw',
      maxHeight: '85vh',
      width: '75vw',
      height: '75vh'
    }
    //if (!this.dialog.openDialogs || !this.dialog.openDialogs.length) return;
    this.dialogRef = this.dialog.open(
      DialogCadastroComponent,
      dialogConfig,
    );
    this.dialogRef.afterClosed().subscribe(value => {
      let produto;
      console.log(value, "Value retornado")
      value.forEach(element => {
        produto = {
          codigo: element.codigo,
          nome: element.nome,
          quantidade: element.quantidade,
          tamanho: element.tamanho,
          ipi: element.ipi,
          valorUnitario: element.valorUnitario,
          comissao: element.comissao,
          id: element.id,
          embalagem: element.embalagem,
          unidade: element.unidade.sigla
        };
        this.addItemPlan(produto)
      });
    });
  }
  openDialogCNPJ(data) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '75vw',
      maxHeight: '85vh',
      width: '75vw',
      height: '75vh'
    }
    dialogConfig.data = data;
    let dialogRefCNPJ = this.dialog.open(
      DialogClienteAddComponent,
      dialogConfig,
    );
    dialogRefCNPJ.afterClosed().subscribe(value => {
      console.log(`Dialog sent: ${value}`);
      this.clientservice.getClientesId(value).subscribe((res: any) => {
        this.clientservice.getClientes().subscribe((res1: any) => {
          this.clientes = res1.data;
          this.selectedCliente = res.data.id;
        });
        this.selectedAreaVendaID = res.data.area_venda_id;
      });
    });
  }
  onSelect({ selected }) {
    let itemSelected = selected[0]
    this.addItem(itemSelected);
  }
  comissaoMedia(){
    let i=1;
    let comissao = 0
    this.items().forEach(element => {
      comissao = +comissao + +element.comissao
      i++;
    })
    return comissao/(i-1);
  }
  comissaoBruta(){
    let comissao = 0
    this.items().forEach(element => {
      comissao = +comissao + +((element.quantidade*element.valorUnitario) * element.comissao/100)
    })
    return comissao;
  }
  valorTotal(){
    let valor = 0
    this.items().forEach(element => {
      valor = +valor + +((element.quantidade*element.valorUnitario))
    })
    return valor.toFixed(2);
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
      valor_total: this.ValorTotal,
      comissao_media: this.comissaoMedia(),
      comissao_bruto: this.comissaoBruta(),
      status: true,
      situacao: "Pendente",
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
