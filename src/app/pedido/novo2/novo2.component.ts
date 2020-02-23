import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ClientService } from '../../shared/services/client.service.component';
import { NotificationService } from '../../shared/messages/notification.service';

import * as XLSX from 'xlsx'

import { OrderItem } from '../order-item.model';
import { MatDialogConfig, MatDialog, MatStepper } from '@angular/material';
import { DialogCadastroComponent } from '../novo/dialog-cadastro/dialog-cadastro.component';
import { DialogBodyClienteComponent } from '../../cadastro/cliente/dialog-body/dialog-body-cliente.component';
import { ItemPedido } from '../itemPedido.model';
import { DateFormatPipe } from '../../shared/pipes/dateFormat.pipe';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { element } from 'protractor';

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
  encapsulation: ViewEncapsulation.None,
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
  itemsNew = [];

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
  representada: any;
  selectRepresentada: string = "Selecione a representada";
  condComercial: any;
  produto:any ;

  incomingfile(event) {
    var file: File;
    this.itemsNew = [];
    file = event.target.files[0];
    this.importar(file);
  }

  importar(file) {
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
      //console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true, header: 1 }));
      var json = XLSX.utils.sheet_to_json(worksheet, { raw: true, header: 1 });
      this.createdForm();
      this.form.get('representada_id').setValue(this.representada.id);
      this[this.representada.func](json);
    }
    if(file != undefined){
      this.spinner.show();
      this.planilha.readAsArrayBuffer(file);
    }
  }

  async volk(data) {
    var inicial = 0;
    var final = 0;
    var clienteCnpj = (data[7][3].toString().length == 13)? "0"+data[7][3]: data[7][3];
    
    this.condComercial = data[12][1];
    
    this.form.get('num_pedido').setValue(data[6][1]);
    this.form.get('transportadora').setValue(data[18][2]);
    this.form.get('data_emissao').setValue(moment(data[6][3].replace(/\//g, "-"), 'DD-MM-YYYY').format("YYYY-MM-DD"));
    this.form.get('data_entrega').setValue(moment(data[21][4], 'DD-MM-YYYY').format("YYYY-MM-DD"));
    this.form.get('frete').setValue(data[17][1] = "C" ? "Cliente" : "Representada");

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
          if (res != undefined) {
            this.addItemPlan(res) //* Adiciona item à item que já esteja cadastrado no banco
          }
        })
      }
      inicial++;
    }

    this.ValorTotal = data[final][1];
    if (inicial > final) {
      if (this.itemsNew.length > 0) {
        this.openDialogVolk()
      }
    }

    if (String(clienteCnpj).length == 14) {
      this.clientservice.getClientesCnpj(clienteCnpj).subscribe((res: any) => {
        if (res.success == true) {
          this.form.get('cliente_id').setValue(res.data.id);
          this.setAreaDeVenda(res.data.area_venda_id);
        } else {
          this.openDialogCNPJ(clienteCnpj)
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

    while (data[final][0] != "Soma Quant.") {
      final++;
      while (data[inicial][0].toString().split(" ", 1)[0] != "Descrição") {
        inicial++;
        if(data[inicial+1][0] === undefined){
          inicial+=2;
        }
      }
    }

    for(let i=inicial+1; i<final; i+=3){
      let rowTam = i+1;
      let rowQtd = i+2;
      let dados = data[i][0].toString();
      let produto = {
        codigo: dados.split(/\s+/g)[1],
        nome: dados.match(new RegExp("BOT([^.]+)\\PR", "g"))[0],
        quantidade: null,
        tamanho: null,
        ipi: 0,
        valorUnitario: dados.match(new RegExp("\\d{2}\\,\\d{2}"))[0],
        comissao: null
      }
      for(let j=0; j<=data[rowTam].length; j++){
        if(data[rowTam][j] != undefined || data[rowQtd][j] != undefined ){
          produto.tamanho = data[rowTam][j];
          produto.quantidade = data[rowQtd][j];
          await this.consultaCod(produto).then((res: any) => {
            console.log(res, "return promise consulta")
            if (res != undefined) {
              this.addItemPlan(res) //* Adiciona item à item que já esteja cadastrado no banco
              console.log('oi')
            } else {
              this.dialogProd = true;
            }
          });
        }
      }
    }
    this.ValorTotal = data[final+7][0];
    this.frete = data[final+9][0] = "CIF Destino" ? "Cliente" : "Representada"
    this.transportadora = data[final+11][0];
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

  async betanin(data) {
    var inicial = 0;
    var final = 0;

    this.cliente = data[5][5].replace(/[^\d]+/g, '');
    this.cliente = (this.cliente.length == 13)? "0"+this.cliente: this.cliente;
    this.pedido = data[1][31];
    this.condComercial = data[2][31];
    this.emissao = moment(data[3][31].replace(/\//g, "-"), 'DD-MM-YYYY').format("YYYY-MM-DD")
    this.entrega = null;

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

  async italbotas(data){
    var inicial = 0;
    var final = 0;
    this.cliente = data[5][13];
    this.cliente = (this.cliente.length == 13)? "0"+this.cliente: this.cliente;
    this.pedido = data[5][1]+"/"+data[6][22];
    this.condComercial = data[6][13];
    this.emissao = data[6][4];
    this.entrega = null;

    inicial = 7;
    while (data[final][16] != "TOTAL:") {
      final++;
    }
    for(let i=inicial; i<final; i+=3){
      let rowTam = i+2;
      let produto = {
        codigo: data[rowTam][0],
        nome: data[rowTam][1].toString().split(" - ")[0],
        quantidade: data[i][11],
        tamanho: data[rowTam][1].toString().split(" - ")[1],
        ipi: 0,
        valorUnitario: data[i][14],
        comissao: data[i][24]
      }
    }
    
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


  @ViewChild(Novo2Component,  {static: false}) table: Novo2Component;

  constructor(private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private dateFormatPipe: DateFormatPipe,
    private dialog: MatDialog,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
    this.clientservice.getRepresentadasFunc().subscribe((res: any) => {
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
  }

  ngOnInit() {
    this.createdForm();
  }

  createdForm(){
    this.form = this.fb.group({
      representada_id: [null, Validators.compose([Validators.required])],
      cliente_id: [null, Validators.compose([Validators.required])],
      condicao_comercial_id: [null, Validators.compose([Validators.required])],
      vendedor_id: [null, Validators.compose([Validators.required])],
      auxiliar_id: [null, Validators.compose([Validators.required])],
      regiao_id: [null],
      area_venda_id: [null, Validators.compose([Validators.required])],
      num_pedido: [null, Validators.compose([Validators.required])],
      frete: [null],
      transportadora: [null],
      valor_total: [null, Validators.compose([Validators.required])],
      comissao_media: [null, Validators.compose([Validators.required])],
      comissao_bruto: [null, Validators.compose([Validators.required])],
      status: [ true, Validators.compose([Validators.required]) ],
      obs: [ null ],
      data_emissao: [null, Validators.compose([Validators.required])],
      data_entrega: [null],
      data_programada: [null],
      desconto: [null],
      situacao: ['pendente'],
      pedido_produtos: this.fb.array([])
    });
    this.produto = this.form.get('pedido_produtos') as FormArray;
  }

  async consultaCod(produto:any): Promise<any> {
    let campos;
    let newItem;
    return new Promise(async (resolve, reject) => {
      this.clientservice.getProdutoCode(produto.codigo).subscribe((res: any) => {
        if (res.success == true) {
          campos = produto;
          campos.embalagem = res.data.embalagem;
          campos.unidade = res.data.unidade.sigla;
          campos.id = res.data.id;
        } else {
          newItem = produto;
          newItem.certificado_aprovacao = '';
          newItem.embalagem = '';
          newItem.representada_id = this.representada.id;
          newItem.unidade_id = '';
          newItem.status = 1;
          this.itemsNew.push(newItem);
        }
        resolve(campos)
      })
    })
  }

  addProduto(item:any){
    this.produto.push(this.fb.group({
      codigo: item.codigo,
      nome: item.nome,
      produto_id: item.id,
      quantidade: item.quantidade,
      unidade: item.unidade,
      embalagem: item.embalagem,
      tamanho: item.tamanho,
      ipi: item.ipi,
      desconto: item.desconto,
      valor_unitario: item.valorUnitario,
      valor_total: (item.quantidade * item.valorUnitario),
      comissao_produto: item.comissao,
      obs: ''
    }));
  }

  setAreaDeVenda(id){
    this.clientservice.getAreaVendaId(id).subscribe((res:any) => {
      if(res.success == true){
        console.log(res);
        this.form.get('area_venda_id').setValue(res.data.id);
        this.form.get('vendedor_id').setValue(res.data.vendedor_id);
        this.form.get('auxiliar_id').setValue(res.data.auxiliar_id);
        this.form.get('regiao_id').setValue(res.data.regiao_id);
      }
    })
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.codigo.toLowerCase().indexOf(val) !== -1 || !val ||
        d.nome.toLowerCase().indexOf(val) !== -1 || !val ||
        d.unidade.descricao.toLowerCase().indexOf(val) !== -1 || !val
    });
    this.rows = temp;
    this.table = this.data;
  }
  setTotal(i){
    let  valor = this.produto.at(i).get('quantidade').value * this.produto.at(i).get('valor_unitario').value;
    this.produto.at(i).get('valor_total').setValue(valor);
  }
  cnpjFilter(cnpj){
    return this.representadas.filter(d => d.cnpj == cnpj);
  }

  addItem(item: ItemPedido) {
    this.addProduto(item);
  }

  addItemPlan(item: ItemPedido) {
    this.addProduto(item);
  }

  CarregarProdutosRepresentada() {
    this.clientservice.getProdutosRepresentada(this.representada.id).subscribe(res => {
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
      height: '75vh',
      data: this.itemsNew
    }
    //if (!this.dialog.openDialogs || !this.dialog.openDialogs.length) return;
    this.dialogRef = this.dialog.open(
      DialogCadastroComponent,
      dialogConfig,
    );
    this.dialogRef.afterClosed().subscribe(value => {
      console.log(value, "Value retornado")
      value.forEach(element => {
        this.addItemPlan(element)
      });
    });
  }

  openDialogCNPJ(data) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '75vw',
      maxHeight: '85vh',
      width: '75vw',
      height: '75vh',
      data: data
    }
    let dialogRefCNPJ = this.dialog.open(
      DialogBodyClienteComponent,
      dialogConfig,
    );
    dialogRefCNPJ.afterClosed().subscribe((res:any) => {
      this.form.get('cliente_id').setValue(res.data.id);
      this.setAreaDeVenda(res.data.area_venda_id);
    });
  }

  onSelect({ selected }) {
    let itemSelected = selected[0]
    this.addItem(itemSelected);
  }

  comissaoMedia(){
    let i=0;
    let comissao = 0
    this.produto.controls.forEach(element => {
      comissao += element.get('comissao_produto').value;
      i++;
    })
    this.form.get('comissao_media').setValue(comissao/i);
    return comissao/i;
  }

  comissaoBruta(){
    let comissao = 0
    this.produto.controls.forEach(element => {
      comissao += ((element.get('quantidade').value*element.get('valor_unitario').value) * element.get('comissao_produto').value/100)
    })
    this.form.get('comissao_bruto').setValue(comissao);
    return comissao;
  }

  valorTotal(){
   let total = 0;
   this.produto.controls.forEach(element => {
     total += element.get('valor_total').value;
   })
   this.form.get('valor_total').setValue(total);
   return total;
  }

  enviarPedido() {
    console.log(this.form.value);
    this.clientservice.addPedido(this.form.value).subscribe(res => {
      this.resposta = res
      if (this.resposta.status == 'success') {
        this.notificationService.notify(`Pedido Cadastrado com Sucesso!`);
        setTimeout(() => { this.router.navigate(['/pedido/', 'listar']) }, 1500);
      } else {
        this.notificationService.notify(`Erro contate o Administrador`)
      }
    });
  }

  clearProdutos(){
    while (this.produto.controls.length) {
      this.produto.removeAt(0);
    }
  }

  removeItem(index){
    this.produto.removeAt(index);
  }

  hide = true;
}