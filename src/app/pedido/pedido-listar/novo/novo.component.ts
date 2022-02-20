import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ViewEncapsulation, Inject, LOCALE_ID } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from "@angular/forms";
import { ClientService } from "../../../shared/services/client.service.component";
import { NotificationService } from "../../../shared/messages/notification.service";
import * as XLSX from "xlsx";
import { OrderItem } from "../../order-item.model";
import { MatDialogRef, MatDialogConfig, MatDialog, MAT_DIALOG_DATA } from "@angular/material";
import { DialogCadastroComponent } from "./dialog-cadastro/dialog-cadastro.component";
import { DialogBodyClienteComponent } from "../../../cadastro/cliente/dialog-body/dialog-body-cliente.component";
import { ItemPedido } from "../../itemPedido.model";
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { switchMap, catchError } from "rxjs/operators";
import { Observable } from "rxjs";
import { DialogProdPedidoComponent } from "../../orc-listar/orcamento/dialog-prod-pedido/dialog-prod-pedido.component";

@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html',
  styleUrls: ['./novo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class NovoComponent implements OnInit {

  @Input() item: OrderItem;
  @Output() add = new EventEmitter();

  public form: FormGroup;
  quantidade: any[] = [];
  events: string[] = [];
  representadas = [];
  clientes: any = [];
  condComerciais = [];
  areas = [];
  upload: any;
  itemsNew = [];
  disabled =  false;

  selectedCliente: string;
  selectedCondComerciais: string;
  selectedAreaVenda;
  areaVendaError: string = '';

  data: any = [];
  editing = {};
  rows = [];
  temp = [...this.data];
  selected = [];

  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  columns = [
    { prop: "codigo_catalogo", flexGrow: 0.5, name: "Cod. Catálogo" },
    { prop: "nome", flexGrow: 0.8 },
    { prop: "descricao", flexGrow: 2, name: "Descrição" },
    { prop: "embalagem", flexGrow: 1.2 },
  ];

  arrayBuffer: any;
  linha: any;
  campos = [];
  dialogDados = [];
  dialogCNPJ = [];
  cliente: string = "";
  clienteId: Object;
  pedido: string;
  transportadora: string;
  ValorTotal: number = 0;
  checked = false;
  emissao: any;
  entrega: any;
  frete: any;
  auxI = 0;
  dialogProd: boolean;
  resposta: any;
  selectedAreaVendaID: any;
  representada: any;
  selectRepresentada: string = "Selecione a representada";
  condComercial: any;
  produto: any;
  currentAction: string = "";
  pageTitle: string = "";
  clientSize: number;JJasfda11
  pedidoSize: number;
  pedidoN: any;
  comissao_vendedor: any = [];
  comissao_auxiliar: any = [];
  clientes$: any;
  razaoSocial: string = "";

  @ViewChild(NovoComponent, { static: false }) table: NovoComponent;

  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<NovoComponent>,
    @Inject(MAT_DIALOG_DATA) public info: any
  ) {
    this.clientservice.getRepresentadasFunc().subscribe((res: any) => {
      this.representadas = res.data;
    });

    this.createdForm();

    this.clientservice.getClientes().subscribe((res: any) => {
      this.clientes$ = res.data;
      this.loadPedido();
    });
    this.clientservice.getCondComerciais().subscribe((res: any) => {
      this.condComerciais = res.data;
    });
    this.clientservice.getAreaVenda().subscribe((res: any) => {
      this.areas = res.data;
    });
  }

  ngOnInit() {
    this.setCurrentAction();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  private setCurrentAction() {
    if (this.info.tipo == "novo") {
      this.currentAction = "novo";
      this.clientSize = 42;
      this.pedidoSize = 12;
    } else if (this.info.tipo == "clone") {
      this.currentAction = "clone";
      this.clientSize = 42;
      this.pedidoSize = 12;
    } else if (this.info.tipo == "orc") {
      this.currentAction = "orc";
      this.clientSize = 42;
      this.pedidoSize = 12;
    } else {
      this.currentAction = "edit";
      this.clientSize = 42;
      this.pedidoSize = 12;
    }
  }

  private setPageTitle() {
    if (this.currentAction == "novo") {
      this.pageTitle = "Novo Pedido";
    } else if (this.currentAction == "clone") {
      const pedido = this.pedidoN != undefined ? this.pedidoN.num_pedido : "";
      this.pageTitle = "Clonando pedido: " + pedido;
    } else if (this.currentAction == "orc") {
      this.pageTitle = "Gerando pedido";
    } else {
      const pedido = this.pedidoN != undefined ? this.pedidoN.num_pedido : "";
      this.pageTitle = "Editando pedido: " + pedido;
    }
  }

  private loadPedido() {
    if (this.currentAction == "edit") {
      this.clientservice.getPedido(this.info.pedido.id).subscribe(
        (pedido: any) => {
          this.pedidoN = pedido.data;
          this.representada = pedido.data.representada;
          this.pedidoN.pedido_produtos.forEach((element) => {
            this.addItemEdit(element);
          });
          this.form.patchValue(this.pedidoN);
          this.setAreaDeVenda(pedido.data.area_venda);
          //this.form.controls["area_venda_id"].setValue(pedido.data.area_venda_id.id);
          this.CarregarProdutosRepresentada();
          //this.setAreaDeVenda(pedido.data.area_venda_id);
          this.razaoSocial =
            pedido.data.cliente.razao_social + " - " + pedido.data.cliente.cnpj;
        },
        (error) => alert("Ocorreu um erro no servidor, tente mais tarde.")
      );
    } else if (this.currentAction == "clone") {
      this.clientservice.getPedido(this.info.pedido.id).subscribe(
        (pedido: any) => {
          this.pedidoN = pedido.data;
          this.representada = pedido.data.representada;
          this.pedidoN.pedido_produtos.forEach((element) => {
            this.addItem(element);
          });
          this.form.patchValue(this.pedidoN);
          this.form.controls["num_pedido"].setValue("");
          this.form.controls["data_emissao"].setValue(new Date());
          this.form.controls["situacao"].setValue("pendente");
          this.setAreaDeVenda(pedido.data.area_venda);
          this.razaoSocial =
            pedido.data.cliente.razao_social + " - " + pedido.data.cliente.cnpj;
        },
        (error) => alert("Ocorreu um erro no servidor, tente mais tarde.")
      );
    } else if (this.currentAction == "orc") {
      this.clientservice.getOrcamento(this.info.orc.id).subscribe(
        (pedido: any) => {
          this.pedidoN = pedido.data;
          this.representada = pedido.data.representada;
          this.CarregarProdutosRepresentada();
          this.pedidoN.orcamento_produtos.forEach((element) => {
            this.addItem(element);
          });
          this.form.patchValue(this.pedidoN);
          this.form.controls["data_emissao"].setValue(
            moment(new Date()).format()
          );
          let cliente = this.clientes$.find(cliente => cliente.id === pedido.data.cliente_id);
          setTimeout(() => this.setAreaDeVenda(cliente.cliente_representada_area_vendas), 500);
          //this.setAreaDeVenda(cliente.cliente_representada_area_vendas);
        },
        (error) => alert("Ocorreu um erro no servidor, tente mais tarde.")
      );
    }
  }

  searchClientes(event) {
    let termo: Observable<any[]>;
    if (event.target.value.toLowerCase() != "") {
      const val = event.target.value.toLowerCase().split(" ");
      let xp = "";
      val.forEach((e) => {
        xp += `(?=.*${e})`;
      });
      const re = new RegExp(xp, "g");
      this.clientes = this.clientes$.filter(function (d) {
        if (d.razao_social.toLowerCase().match(re) || d.cnpj.match(re) || !val)
          return d;
      });
    } else {
      this.clientes = termo;
    }
  }

  getRazaoSocial(clienteId: string) {
    let cliente;
    if(clienteId != undefined && this.clientes$ != undefined){
      cliente = this.clientes$.find((cliente) => cliente.id === clienteId);
    }
    if (cliente != undefined) {
      return cliente.razao_social + " - " + cliente.cnpj;
    } else {
      return "";
    }
  }

  async getClientes() {
    await this.clientservice.getClientes().subscribe((res: any) => {
      this.clientes$ = res.data;
    });
  }

  createdForm() {
    this.form = this.fb.group({
      id: null,
      representada_id: [null, Validators.compose([Validators.required])],
      cliente_id: [null, Validators.compose([Validators.required])],
      condicao_comercial_id: [null, Validators.compose([Validators.required])],
      vendedor_id: [null, Validators.compose([Validators.required])],
      auxiliar_id: [null, Validators.compose([Validators.required])],
      regiao_id: [null],
      area_venda_id: [null, Validators.compose([Validators.required])],
      num_pedido: [null, Validators.compose([Validators.required])],
      frete: [null, Validators.required],
      transportadora: [null],
      valor_total: [null, Validators.compose([Validators.required])],
      valor_liquido: [null],
      comissao_media: [null, Validators.compose([Validators.required])],
      comissao_bruto: [null, Validators.compose([Validators.required])],
      vendedor_porcentagem: [null],
      auxiliar_porcentagem: [null],
      comissao_auxiliar: [null],
      comissao_vendedor: [null],
      status: [true, Validators.compose([Validators.required])],
      obs: [null],
      data_emissao: [new Date(), Validators.compose([Validators.required])],
      data_entrega: [null],
      data_programada: [null],
      desconto: [null],
      subst: [null],
      situacao: ["pendente"],
      pedido_produtos: this.fb.array([], [Validators.required]),
    });
    this.produto = this.form.get("pedido_produtos") as FormArray;
  }

  async consultaCod(produto: any): Promise<any> {
    let campos;
    let newItem;
    return new Promise(async (resolve, reject) => {
      this.clientservice
        .getProdutoCode(produto.codigo_catalogo)
        .subscribe((res: any) => {
          if (res.success == true) {
            campos = produto;
            campos.embalagem = res.data.embalagem;
            //campos.unidade = (res.data.unidade != null) ? res.data.unidade : null;
            campos.id = res.data.id;
          } else {
            newItem = produto;
            newItem.certificado_aprovacao = "";
            newItem.embalagem = "";
            newItem.representada_id = this.representada.id;
            //newItem.unidade_id = '';
            newItem.status = 1;
            this.itemsNew.push(newItem);
          }
          resolve(campos);
        });
    });
  }

  addProdutoEdit(item: any) {
    this.produto.push(
      this.fb.group({
        id: item.produto.id,
        codigo_catalogo: item.codigo_catalogo || item.produto.codigo_catalogo,
        nome: item.nome || item.produto.nome,
        produto_id: item.id,
        quantidade: [item.quantidade, Validators.required],
        cor: item.cor != null ? item.cor : null,
        embalagem: item.embalagem,
        desconto: 0,
        tamanho: item.tamanho,
        ipi: item.ipi != null ? parseFloat(item.ipi) : 0,
        valor_unitario: [item.valor_unitario, Validators.compose([Validators.required, Validators.min(0.01)])],
        valor_total: [
          this.form.get("desconto").value != null ? item.quantidade * item.valor_unitario - (item.quantidade * item.valor_unitario) * this.form.get("desconto").value / 100 : item.quantidade * item.valor_unitario,
          Validators.compose([Validators.required, Validators.min(0.01)]),
        ],
        comissao_produto:
          item.comissao != null
            ? parseFloat(item.comissao)
            : this.representada.comissao_padrao != null
              ? this.representada.comissao_padrao
              : 0,
        obs: "",
      })
    );
  }
  addProduto(item: any) {
    //console.log(item, "item");
    this.produto.push(
      this.fb.group({
        codigo_catalogo: item.codigo_catalogo || item.produto.codigo_catalogo,
        nome: item.nome || item.produto.nome,
        produto_id: this.currentAction == "orc" ? item.produto_id : item.id,
        quantidade: [item.quantidade, Validators.required],
        cor: item.cor != null ? item.cor : null,
        embalagem: item.embalagem,
        desconto: 0,
        tamanho: item.tamanho,
        ipi: item.ipi != null ? parseFloat(item.ipi) : 0,
        valor_unitario: [item.valor_unitario, Validators.compose([Validators.required, Validators.min(0.01)])],
        valor_total: [
          this.form.get("desconto").value != null ? item.quantidade * item.valor_unitario - (item.quantidade * item.valor_unitario) * this.form.get("desconto").value / 100 : item.quantidade * item.valor_unitario,
          Validators.compose([Validators.required, Validators.min(0.01)])
        ],
        comissao_produto:
          item.comissao != null
            ? parseFloat(item.comissao)
            : this.representada.comissao_padrao != null
              ? this.representada.comissao_padrao
              : 0,
        obs: "",
      })
    );
  }
  
  areadeVendaDisplay(){
    if(this.form.get("area_venda_id").value != null){
      return 'afonso'
    }else{
      return ''
    }
  }
  setAreaDeVenda(areas) {
    if (areas != null && areas.length > 0) {
      let area = areas;
      if (typeof (areas) != 'number') {
        area = areas.filter(area => area.representada_id == this.representada.id);
      }
      if(area.length > 0){
        area = area[0].area_venda_id;
        this.clientservice.getAreaVendaId(area).subscribe((res: any) => {
          if (res.data != null) {
            this.form.get("area_venda_id").setValue(res.data.id);
            this.form.get("vendedor_id").setValue(res.data.vendedor_id);
            this.form.get("auxiliar_id").setValue(res.data.auxiliar_id);
            this.form.get("regiao_id").setValue(res.data.regiao_id);
            this.areaVendaError = ""
            this.comissao_auxiliar = res.data.auxiliar.comissoes.find(
              (e) => e.representada_id == this.representada.id
            );
            this.comissao_vendedor = res.data.vendedor.comissoes.find(
              (e) => e.representada_id == this.representada.id
            );
            this.comissaoVendedorAuxiliar();
            this.CarregarProdutosRepresentada(); 
          } else {
            this.areaVendaError = "Cliente não possui área de venda cadastrada, verifique antes de prosseguir!"
            this.notificationService.notify("Cliente não possui área de Venda!");
          }
        });
      }else{
        this.areaVendaError = "Cliente não possui área de venda cadastrada, verifique antes de prosseguir!"
        this.notificationService.notify("Cliente não possui área de Venda!");
      }
    }else if(areas != null){
        this.clientservice.getAreaVendaId(areas.id).subscribe((res: any) => {
          if (res.data != null) {
            this.form.get("area_venda_id").setValue(res.data.id);
            this.form.get("vendedor_id").setValue(res.data.vendedor_id);
            this.form.get("auxiliar_id").setValue(res.data.auxiliar_id);
            this.form.get("regiao_id").setValue(res.data.regiao_id);
            this.areaVendaError = ""
            this.comissao_auxiliar = res.data.auxiliar.comissoes.find(
              (e) => e.representada_id == this.representada.id
            );
            this.comissao_vendedor = res.data.vendedor.comissoes.find(
              (e) => e.representada_id == this.representada.id
            );
            this.comissaoVendedorAuxiliar();
            this.CarregarProdutosRepresentada(); 
          } else {
            this.areaVendaError = "Cliente não possui área de venda cadastrada, verifique antes de prosseguir!"
            this.notificationService.notify("Cliente não possui área de Venda!");
          }
        });
    }else {
      this.areaVendaError = "Cliente não possui área de venda cadastrada, verifique antes de prosseguir!"
      this.notificationService.notify("Cliente não possui área de Venda!");
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return (
        d.codigo_catalogo.toLowerCase().indexOf(val) !== -1 ||
        d.codigo_importacao.toLowerCase().indexOf(val) !== -1 ||
        d.nome.toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.rows = temp;
    this.table = this.data.data;
  }
  setTotal(i) {
    let valor =
    this.form.get("desconto").value != null ? this.produto.at(i).get("quantidade").value *
    this.produto.at(i).get("valor_unitario").value - (this.produto.at(i).get("quantidade").value *
      this.produto.at(i).get("valor_unitario").value * this.form.get("desconto").value) / 100 : this.produto.at(i).get("quantidade").value *
      this.produto.at(i).get("valor_unitario").value;
    this.produto.at(i).get("valor_total").setValue(valor);
  }
  cnpjFilter(cnpj) {
    return this.representadas.filter((d) => d.cnpj == cnpj);
  }

  addItem(item: ItemPedido) {
    this.addProduto(item);
  }
  addItemEdit(item: ItemPedido) {
    this.addProdutoEdit(item);
  }

  CarregarProdutosRepresentada() {
    this.clientservice
      .getProdRepCli(this.representada.id, (this.form.get('cliente_id').value) || this.pedidoN.cliente_id)
      .subscribe((res: any) => {
        if(res.success){
          this.rows = res.data;
          this.temp = [...this.rows];
          if(res.tipo == "corporativo" && res.data.length == 0 ){
            this.notificationService.notify("Cliente corporativo não possui produtos cadastrados!");
          }
        }else{
          if(res.data.endereco){
            this.notificationService.notify("Cliente não possui endereço cadastrado!");
          }
        }
      });
  }

  private transform(data) {
    let result = "";
    data.forEach(function (element, index) {
      if (index == 0) {
        if (element.tamanho) {
          result += element.tamanho.nome
        } else {
          result += element.nome
        }
      } else {
        if (element.tamanho) {
          result += " ," + element.tamanho.nome
        } else {
          result += " ," + element.nome
        }
      }
    });
    return result;
  }
  onSelect({ selected }) {
    if(selected[0].produto_estados_precos.length > 0){
      let dialogConfig = new MatDialogConfig();
      // dialogConfig = {
      //   maxWidth: '100vw',
      //   maxHeight: '100vh',
      //   height: '40vh'
      // }
      dialogConfig.data = selected[0];
      let dialogRef = this.dialog.open(
        DialogProdPedidoComponent,
        dialogConfig,

      );
      dialogRef.afterClosed().subscribe(value => {
        if (value != null){
          value.map(produto=> {
            this.addItem(produto)
          })
        } //this.addItem(value);
      });
    }else{
      this.notificationService.notify("Produto sem preço, verifique o cadastro do cliente, 'Endereço' e 'Tipo' ");
    }
  }

  openDialogProdutos() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: "75vw",
      maxHeight: "85vh",
      width: "75vw",
      height: "75vh",
      data: this.itemsNew,
    };
    //if (!this.dialog.openDialogs || !this.dialog.openDialogs.length) return;
    let dialogRef = this.dialog.open(DialogCadastroComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((value) => {
      this.dialogRef.close();
      // antiga função de adição
      // value.forEach(element => {
      //   this.addItem(element)
      // });
    });
  }

  openDialogCNPJ(data) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: "75vw",
      maxHeight: "85vh",
      width: "75vw",
      height: "75vh",
      data: data,
    };
    let dialogRefCNPJ = this.dialog.open(
      DialogBodyClienteComponent,
      dialogConfig
    );
    dialogRefCNPJ.afterClosed().subscribe((res: any) => {
      this.form.get("cliente_id").setValue(res.data.id);
      this.getClientes();
      this.setAreaDeVenda(res.data.cliente_representada_area_vendas);
    });
  }

  comissaoMedia() {
    let i = 0;
    let comissao = 0;
    this.produto.controls.forEach((element) => {
      comissao += element.get("comissao_produto").value;
      i++;
    });
    this.form.get("comissao_media").setValue(comissao / i);
    return comissao / i;
  }
  async comissaoVendedorAuxiliar() {
    let comissao_vendedor = 0;
    let comissao_auxiliar = 0;
    this.produto.controls.forEach((element) => {
      //comissao_vendedor += ((element.get('quantidade').value * element.get('valor_unitario').value) * this.comissaoCalcFaixa(element.get('comissao_produto').value) / 100);
      comissao_vendedor += this.comissaoCalcFaixa(
        this.comissao_vendedor,
        element.get("quantidade").value,
        element.get("valor_unitario").value,
        element.get("comissao_produto").value,
        "vendedor_porcentagem"
      );
      comissao_auxiliar += this.comissaoCalcFaixa(
        this.comissao_auxiliar,
        element.get("quantidade").value,
        element.get("valor_unitario").value,
        element.get("comissao_produto").value,
        "auxiliar_porcentagem"
      );
    });

    this.form.get("comissao_vendedor").setValue(comissao_vendedor);
    this.form.get("comissao_auxiliar").setValue(comissao_auxiliar);
  }

  comissaoBruta() {
    let comissao = 0;
    this.produto.controls.forEach((element) => {
      comissao +=
        ((element.get("quantidade").value * element.get("valor_unitario").value - 
        (element.get("quantidade").value * element.get("valor_unitario").value * this.form.get("desconto").value /100)) *
          element.get("comissao_produto").value) /
        100;
    });
    this.form.get("comissao_bruto").setValue(comissao);
    return comissao;
  }

  comissaoCalcFaixa(f, q, v, c, type) {
    if (f.comissao_faixas != undefined) {
      let percentual = 0;
      f.comissao_faixas.map((res) => {
        if (c >= res.faixa) {
          percentual = res.percentual;
          this.form.get(type).setValue(percentual);
        }
      });
      return ((q * v - (q * v *this.form.get('desconto').value/100)) / 100) * percentual;
    } else {
      return 0;
    }
  }

  aplicarDesconto(){
    this.produto.controls.forEach((element) => {

        element.get("valor_total").setValue(
        element.get("quantidade").value *
        element.get("valor_unitario").value - 
        element.get("quantidade").value *
        element.get("valor_unitario").value *
        this.form.get("desconto").value /100
        );
        element.get("desconto").setValue(this.form.get("desconto").value);    
    
  });
  }

  valorTotal(tipo) {
    let total = 0;
    let ipi = 0;
    this.produto.controls.forEach((element) => {
      if (element.get("ipi").value > 0) {
        let valor = element.get("quantidade").value * element.get("valor_unitario").value 
        - (element.get("quantidade").value * element.get("valor_unitario").value * this.form.get("desconto").value /100);
        
        ipi +=
          ( valor * element.get("ipi").value /100);
      }
      total +=
        element.get("quantidade").value * element.get("valor_unitario").value;
    });
    ipi = parseFloat((Math.ceil(ipi*20)/20).toFixed(2));
    let desconto = (total * this.form.get("desconto").value) / 100;
    let subst = this.form.get("subst").value > 0 ? this.form.get("subst").value : 0 ;
    this.form.get("valor_liquido").setValue(total - desconto);
    this.form.get("valor_total").setValue((total + Math.round(ipi) - desconto + subst));
    // if(this.ValorTotal > 0){  
    //   if (this.form.get("valor_total").value > (this.ValorTotal + ipi)){
    //     this.disabled = true;
    //   }else{
    //     this.disabled = false;
    //   }
    // }  
    if (tipo == "total") return this.form.get("valor_total").value;
    else if (tipo == "ipi") return Math.round(ipi);
    else return total - desconto;
  }

  async enviarPedido() {
    await this.comissaoVendedorAuxiliar();
    if(this.form.valid){
      if (this.currentAction == "edit") {
        this.clientservice.updatePedido(this.form.value).subscribe((res: any) => {
          if (res.success == true) {  
            this.notificationService.notify("Atualizado com Sucesso!");
            this.dialogRef.close();
          } else {
            if(res.data.pedido == "Pedido já Cadastrado"){
              this.notificationService.notify(`Já existe um pedido cadastrado com esses dados!`);
            }else{
              this.notificationService.notify(`Erro contate o Administrador`);
              this.dialogRef.close();
            }
          }
        });
      } else {
        this.clientservice.addPedido(this.form.value).subscribe((res: any) => {
          if (res.success == true) {
            if(this.currentAction == "orc"){
              this.clientservice.orcamentoGerado(this.info.orc.id).subscribe((resOrc: any) => {
                if (resOrc.status == true) {
                  this.notificationService.notify(`Orçamento transformado em Pedido com Sucesso!`);
                  this.dialogRef.close();
                }else{
                  if(res.data.pedido == "Pedido ja Cadastrado"){
                    this.notificationService.notify(`Já existe um pedido cadastrado com esses dados!`);
                  }else{
                    this.notificationService.notify(`Erro ao alterar o orçamento, contate o Administrador! Pedido gerado.`);
                    this.dialogRef.close();
                  }
                }
              });
            }else{
              this.notificationService.notify(`Pedido Cadastrado com Sucesso!`);
              this.dialogRef.close();
            }
          } else {
            if(res.data.pedido == "Pedido já Cadastrado"){
              this.notificationService.notify(`Já existe um pedido cadastrado com esses dados!`);
            }else{
              this.notificationService.notify(`Erro contate o Administrador`);
            }
            //this.dialogRef.close();
          }
        });
      }
    }else{
      this.form.markAllAsTouched();
      if(this.form.get("pedido_produtos").valid == false){
        if(this.form.get("pedido_produtos").value.length == 0){
          this.notificationService.notify("É necessario selecionar ao menos um produto!");
        }
      }
    }
    
  }

  clearProdutos() {
    while (this.produto.controls.length) {
      this.produto.removeAt(0);
    }
  }

  removeItem(index) {
    this.produto.removeAt(index);
  }

  hide = true;
}
