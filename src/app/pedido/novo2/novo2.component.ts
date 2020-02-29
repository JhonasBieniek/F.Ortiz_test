import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ClientService } from '../../shared/services/client.service.component';
import { NotificationService } from '../../shared/messages/notification.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import * as XLSX from 'xlsx'

import { OrderItem } from '../order-item.model';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { DialogCadastroComponent } from '../novo/dialog-cadastro/dialog-cadastro.component';
import { DialogBodyClienteComponent } from '../../cadastro/cliente/dialog-body/dialog-body-cliente.component';
import { ItemPedido } from '../itemPedido.model';
import { DateFormatPipe } from '../../shared/pipes/dateFormat.pipe';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
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
})

export class Novo2Component implements OnInit {

  @Input() item: OrderItem
  @Output() add = new EventEmitter()

  public form: FormGroup;
  quantidade: any[] = [];
  events: string[] = [];
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
  currentAction:string = "";
  pageTitle:string = "";
  clientSize:number;
  pedidoSize:number;


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
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true, header: 1 }));
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
    var pedido = (data[21][12] != undefined)? data[6][1]+"/"+data[21][12]: data[6][1];
    this.condComercial = data[12][1];
    
    this.form.get('num_pedido').setValue(pedido);
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
            this.addItem(res) //* Adiciona item à item que já esteja cadastrado no banco
          }
        })
      }
      inicial++;
    }

    this.ValorTotal = data[final][1];
    if (inicial > final) {
      if (this.itemsNew.length > 0) {
        this.openDialogProdutos()
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

    let clienteCnpj = data[2][0].toString().match(new RegExp("\\d{2}\\.\\d{3}\\.\\d{3}\\/\\d{4}\\-\\d{2}", "g"))[0];
    clienteCnpj = clienteCnpj.replace(/[^\d]+/g, '');
    clienteCnpj = (clienteCnpj.length == 13)? "0"+clienteCnpj:clienteCnpj;
    this.form.get('num_pedido').setValue(data[0][0].toString().match(new RegExp("\\d+", "g"))[0]);
    
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
          quantidade: parseInt(data[inicial][1].replace(/\./g,'')),
          tamanho: null,
          ipi: null,
          valorUnitario: data[inicial][3].match(/\d+/g)[0]+"."+ data[inicial][3].match(/\d+/g)[1],
          comissao: null
        }
        await this.consultaCod(produto).then((res: any) => {
          if (res != undefined) {
            this.addItem(res) //* Adiciona item à item que já esteja cadastrado no banco
          }
        })
      }
      inicial++;
    }
    this.condComercial = data[final+2][0].split(':')[1].replace("  Data de Emissão", "").trim();
    this.form.get('data_emissao').setValue(moment(data[final+2][0].toString().match(new RegExp("\\d{2}\\/\\d{2}\\/\\d{4}", "g"))[0].replace(/\//g, "-"), 'DD-MM-YYYY').format("YYYY-MM-DD"));

    this.ValorTotal = data[final][1];
    if (inicial > final) {
      if (this.itemsNew.length > 0) {
        this.openDialogProdutos()
      }
    }
    
    if (String(clienteCnpj).length == 14) {
      this.clientservice.getClientesCnpj(clienteCnpj).subscribe((res: any) => {
        if (res.success == true) {
          this.form.get('cliente_id').setValue(res.data.id);
          this.setAreaDeVenda(res.data.area_venda_id);
        } else {
          this.openDialogCNPJ(clienteCnpj);
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
    this.condComercial = data[12][0].split(" ")[0]+" "+data[12][0].split(" ")[1];

    let clienteCnpj = data[7][0].toString().match(new RegExp("\\d{14}", "g"))[0];
    this.form.get('num_pedido').setValue(data[3][0]);
    this.form.get('data_emissao').setValue(moment(data[4][0].match(new RegExp("\\d{2}\\/\\d{2}\\/\\d{4}", "g"))[0].replace(/\//g, "-"), 'DD-MM-YYYY').format("YYYY-MM-DD"));

    while (data[final][0] != "Soma Quant.") {
      final++;
      while (data[inicial][0].toString().split(" ", 1)[0] != "Descrição") {
        inicial++;
        if(data[inicial+1][0] === undefined){
          inicial+=2;
        }
      }
    }
    let i = inicial+1;
    for(i; i<final; i+=3){
      let rowTam = i+1;
      let rowQtd = i+2;
      let dados = data[i][0].toString().replace( /  +/g, ' ' );
      let produto = {
        codigo: dados.split(/\s+/g)[1],
        nome: dados.match(new RegExp("(?<=-\\s)([^.]+)(?=PR)"))[0].trim(),
        quantidade: null,
        tamanho: null,
        ipi: 0,
        valorUnitario: dados.split(" ").slice(-2)[0].replace(",", '.'),
        comissao: null
      }
      for(let j=0; j<=data[rowTam].length; j++){
        if(data[rowTam][j] != undefined || data[rowQtd][j] != undefined ){
          produto.tamanho = data[rowTam][j];
          produto.quantidade = data[rowQtd][j];
          await this.consultaCod(produto).then((res: any) => {
            if (res != undefined) {
              this.addItem(res) //* Adiciona item à item que já esteja cadastrado no banco
            }
          });
        }
      }
    }

    this.form.get('valor_total').setValue(data[final+7][0]);
    this.form.get('frete').setValue( (data[final+9][0] == "CIF Destino") ? "Cliente" : "Representada");
    this.form.get('transportadora').setValue(data[final+11][0]);

    if (i == final) {
      if (this.itemsNew.length > 0) {
        this.openDialogProdutos();
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

  async betanin(data) {
    var inicial = 0;
    var final = 0;
    this.condComercial = data[2][31];

    let clienteCnpj = data[5][5].replace(/[^\d]+/g, '');
    clienteCnpj = (clienteCnpj.length == 13)? "0"+clienteCnpj: clienteCnpj;
    this.form.get('num_pedido').setValue(data[1][31]);
    this.form.get('data_emissao').setValue(moment(data[3][31].replace(/\//g, "-"), 'DD-MM-YYYY').format("YYYY-MM-DD"));

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
          quantidade: data[inicial][15].split("/")[1].replace(".", ""),
          ipi: [inicial][34],
          valorUnitario: data[inicial][28].match(/\d+/g)[0]+"."+data[inicial][28].match(/\d+/g)[1],
          desconto: data[inicial][24].match(/\d+/g)[0]+"."+data[inicial][24].match(/\d+/g)[1],
        }
        await this.consultaCod(produto).then((res: any) => {
          if (res != undefined) {
            this.addItem(res)
          }
        })
      }
      inicial++;
    }
    this.form.get('valor_total').setValue(data[final+9][31]);
    this.form.get('frete').setValue((data[final+8][5] == "CIF")? "Cliente" : "Representada");
    this.form.get('transportadora').setValue(data[final+7][5]);

    if (inicial > final) {
      if (this.itemsNew.length > 0) {
        this.openDialogProdutos()
      }
    }

    if (String(clienteCnpj).length == 14) {
      this.clientservice.getClientesCnpj(clienteCnpj).subscribe((res: any) => {
        if (res.success == true) {
          this.form.get('cliente_id').setValue(res.data.id);
          this.setAreaDeVenda(res.data.area_venda_id);
        } else {
          this.openDialogCNPJ(clienteCnpj);
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
    this.condComercial = data[6][18];

    let clienteCnpj = data[5][17];
    clienteCnpj = (clienteCnpj.length == 13)? "0"+clienteCnpj: clienteCnpj;
    this.form.get('num_pedido').setValue(data[5][1].trim()+"/"+data[6][27].trim());
    this.form.get('data_emissao').setValue(moment(data[6][4].match(new RegExp("\\d{2}\\/\\d{2}\\/\\d{4}", "g"))[0].replace(/\//g, "-"), 'DD-MM-YYYY').format("YYYY-MM-DD"));
    this.form.get('data_entrega').setValue(moment(data[6][10].match(new RegExp("\\d{2}\\/\\d{2}\\/\\d{4}", "g"))[0].replace(/\//g, "-"), 'DD-MM-YYYY').format("YYYY-MM-DD"));

    inicial = 7;
    while (data[final][21] != "TOTAL:") {
      final++;
    }
    let i=inicial;
    for(i; i<final; i+=3){
      let rowTam = i+2;
      let produto = {
        codigo: data[rowTam][0],
        nome: data[rowTam][1].toString().split(" - ")[0],
        quantidade: data[i][14],
        tamanho: data[rowTam][1].toString().split(" - ")[1],
        ipi: 0,
        valorUnitario: data[i][19],
        comissao: data[i][29]
      }
      await this.consultaCod(produto).then((res: any) => {
        if (res != undefined) {
          this.addItem(res)
        }
      })
    }
    
    if (i == final) {
      if (this.itemsNew.length > 0) {
        this.openDialogProdutos()
      }
    }
    
    if (String(clienteCnpj).length == 14) {
      this.clientservice.getClientesCnpj(clienteCnpj).subscribe((res: any) => {
        if (res.success == true) {
          this.form.get('cliente_id').setValue(res.data.id);
          this.setAreaDeVenda(res.data.area_venda_id);
        } else {
          this.openDialogCNPJ(clienteCnpj);
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
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
    this.clientservice.getRepresentadasFunc().subscribe((res: any) => {
      this.representadas = res.data;
    });
    this.getClientes();
    this.clientservice.getCondComerciais().subscribe((res: any) => {
      this.condComerciais = res.data;
    });
    this.clientservice.getAreaVenda().subscribe((res: any) => {
      this.areas = res.data;
    });
  }
  

  ngOnInit() {
    this.createdForm();
    this.setCurrentAction();
  }

  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    this.setPageTitle();
  }

  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == "importar"){
      this.currentAction = "importar"
      this.clientSize= 44;
      this.pedidoSize=16;
    }else if(this.route.snapshot.url[0].path == "novo"){
      this.currentAction = "novo"
      this.clientSize= 26;
      this.pedidoSize=12;
    }else{
      this.currentAction = "edit"
      this.clientSize= 26;
      this.pedidoSize=12;
    }

  }

  private setPageTitle() {
    if(this.currentAction == 'importar'){
      this.pageTitle = 'Importar Pedido'
    }else if(this.currentAction == 'novo'){
      this.pageTitle = 'Novo Pedido'
    }else{
      //const pieceNome = this.piece.nome || ''
      this.pageTitle = 'Editando pedido: ';
    }
  }

  getClientes(){
    this.clientservice.getClientes().subscribe((res: any) => {
      this.clientes = res.data;
    }); 
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
  updateDate(input: string, event: MatDatepickerInputEvent<Date>) {
    this.form.get(input).setValue(moment(event.value, 'DD-MM-YYYY').format("YYYY-MM-DD"));
  }
  async consultaCod(produto:any): Promise<any> {
    let campos;
    let newItem;
    console.log(produto);
    return new Promise(async (resolve, reject) => {
      this.clientservice.getProdutoCode(produto.codigo).subscribe((res: any) => {
        if (res.success == true) {
          campos = produto;
          campos.embalagem = res.data.embalagem;
          campos.unidade = (res.data.unidade != null)?res.data.unidade: null ;
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
      unidade: (item.unidade != null)? item.unidade.sigla: null,
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

  CarregarProdutosRepresentada() {
    console.log(this.representada);
    this.clientservice.getProdutosRepresentada(this.representada.id).subscribe(res => {
      this.data = res;
      this.rows = this.data.data;
      this.temp = [...this.data.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
    })
  }

  openDialogProdutos() {
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
        this.addItem(element)
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
      this.getClientes();
      this.setAreaDeVenda(res.data.area_venda_id);
    });
  }

  onSelect({ selected }) {
    let itemSelected = selected[0]
    this.addItem(itemSelected);
  }

  comissaoMedia(){
    let i=0;
    let comissao = 0;
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
     total += element.get('valor_total').value - ((element.get('quantidade').value*element.get('valor_unitario').value) * element.get('desconto').value/100)
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
        setTimeout(() => { this.router.navigate(['/pedido/', 'listar-pedido']) }, 1500);
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