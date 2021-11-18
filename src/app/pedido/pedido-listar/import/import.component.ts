import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ViewEncapsulation, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from "@angular/forms";
import { ClientService } from "../../../shared/services/client.service.component";
import { NotificationService } from "../../../shared/messages/notification.service";
import * as XLSX from "xlsx";
import { OrderItem } from "../../order-item.model";
import { MatDialogRef, MatDialogConfig, MatDialog, MAT_DIALOG_DATA } from "@angular/material";
import { DialogCadastroComponent } from "../novo/dialog-cadastro/dialog-cadastro.component";
import { DialogBodyClienteComponent } from "../../../cadastro/cliente/dialog-body/dialog-body-cliente.component";
import { ItemPedido } from "../../itemPedido.model";
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from "rxjs";
import { DialogProdPedidoComponent } from "../../orc-listar/orcamento/dialog-prod-pedido/dialog-prod-pedido.component";
import { ImportService } from "../../../shared/services/import.service";

@Component({
  selector: "app-import",
  templateUrl: "./import.component.html",
  styleUrls: ["./import.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ImportComponent implements OnInit {
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
  disabled = false;
  areaVendaError: string = '';

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
    { prop: "codigo_catalogo", flexGrow: 0.5, name: "Cod. Catálogo" },
    { prop: "nome", flexGrow: 0.8 },
    { prop: "descricao", flexGrow: 2, name: "Descrição" },
    { prop: "embalagem", flexGrow: 1.2 },
  ];

  arrayBuffer: any;
  planilha: any;
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
  clientSize: number;
  pedidoSize: number;
  pedidoN: any;
  comissao_vendedor: any = [];
  comissao_auxiliar: any = [];
  clientes$: any;
  razaoSocial: string = "";

  @ViewChild(ImportComponent, { static: false }) table: ImportComponent;
  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<ImportComponent>,
    private importservice: ImportService,
    @Inject(MAT_DIALOG_DATA) public info: any
  ) {
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
      comissao_auxiliar: [null],
      comissao_vendedor: [null],
      status: [true, Validators.compose([Validators.required])],
      obs: [null],
      data_emissao: [null, Validators.compose([Validators.required])],
      data_entrega: [null],
      data_programada: [null],
      desconto: [null],
      subst: [null],
      situacao: ["pendente"],
      pedido_produtos: this.fb.array([], [Validators.required]),
    });
    this.produto = this.form.get("pedido_produtos") as FormArray;

    this.clientservice.getCondComerciais().subscribe((res: any) => {
      this.condComerciais = res.data;
    });
    this.clientservice.getAreaVenda().subscribe((res: any) => {
      this.areas = res.data;
    });

    this.clientservice.getClientes().subscribe((res: any) => {
      this.clientes$ = res.data;

      this.clientservice.getRepresentadasFunc().subscribe((res: any) => {
        this.representadas = res.data;
        this.representadas.map((d) => {
          if (d.id == info.representada_id)
            this.representada = d;
        });
        this.receiveFile();
      });

    });
  }


  async ngOnInit() {
    this.setCurrentAction();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  dateAdapterWithUtc(d) {
      return new Date((d - (25567 + 1))*86400*1000)
  }

  private setCurrentAction() {
    if (this.info.tipo == "importar") {
      this.currentAction = "importar";
      this.clientSize = 56;
      this.pedidoSize = 16;
    }
  }

  private setPageTitle() {
    if (this.currentAction == "importar") {
      this.pageTitle = "Importar Pedido - ";
    }
  }

  async receiveFile(){
      this.spinner.show();
      this.itemsNew = [];
      // let json = await this.importservice.importarPedido(this.info.file, this.representada);
      this.importservice.importarPedido(this.info.file, this.representada).then(res=>{
        //console.log(res)
        if(res != false){
          this.form.get("representada_id").setValue(this.representada.id);
          this.spinner.hide();
          this[this.representada.func](res.json, res.itens);
        }else{
          console.log("eror no Service: ",res)
          this.notificationService.notify("Excel com divergência, informe ao administrador!");
          //this.dialogRef.close();
        }
      });
  }

  // async incomingfile(event) {
  //   var file: File;
  //   this.itemsNew = [];
  //   file = event[0];
  //   if (file != undefined) {
  //     this.spinner.show();
  //     let json = await this.importservice.importarPedido(file, this.representada)
  //     this.createdForm();
  //     this.form.get("representada_id").setValue(this.representada.id);
  //     this[this.representada.func](json.json, json.itens);
  //     //console.log(json);
  //   }
  // }

  // setRepresentada(id){
  //   this.representadas.map((d) => {
  //     if (d.id == id)
  //       this.representada = d;
  //   });
  // }

  async volk(data, itens) {
    try{
      this.condComercial = data[12][1];
      this.condComerciais.map((x) => {
        if(x.nome.toLowerCase() == this.condComercial.toLowerCase()){
          this.form.get("condicao_comercial_id").setValue(x.id);
          this.condComercial = "";
        }
      });
      
      var clienteCnpj = data[7][3].toString().length == 13 ? "0" + data[7][3] : data[7][3];
      var pedido = data[21][12] != undefined ? data[6][1] + "/" + data[21][12] : data[6][1];
      this.form.get("num_pedido").setValue(pedido);
      this.form.get("transportadora").setValue(data[18][2]);
      this.form.get("data_emissao").setValue(moment(data[6][3].replace(/\//g, "-"), "DD-MM-YYYY").format("YYYY-MM-DD"));
      this.form.get("data_entrega").setValue(moment(data[21][4], "DD-MM-YYYY").format("YYYY-MM-DD"));
      this.form.get("frete").setValue(data[17][1] == "C" ? "Cliente" : "Representada");

      if (itens.item.length > 0) {
        itens.item.forEach(element => {
          this.addItem(element);
        });
      }
      if (itens.newItem.length > 0) {
        this.itemsNew = [...itens.newItem];
        this.openDialogProdutos();
      }
      console.log(itens)
      this.ValorTotal = itens.valorTotal;

      if (String(clienteCnpj).length == 14) {
        this.clientservice.getClientesCnpj(clienteCnpj).subscribe((res: any) => {
          if (res.success == true) {
            this.form.get("cliente_id").setValue(res.data.id);
            this.setAreaDeVenda(res.data.cliente_representada_area_vendas);
            this.CarregarProdutosRepresentada();
          } else {
            this.openDialogCNPJ(clienteCnpj);
          }
        });
      } else {
        this.notificationService.notify("CNPJ INCORRETO!");
      }

      this.spinner.hide();
    } catch(e) {
      this.notificationService.notify("Excel com divergência, informe ao administrador!");
      this.dialogRef.close();
    }
  }

  async camper(data, itens) {
    try{
      let clienteCnpj = data[2][0].toString().match(new RegExp("\\d{2}\\.\\d{3}\\.\\d{3}\\/\\d{4}\\-\\d{2}", "g"))[0];
      clienteCnpj = clienteCnpj.replace(/[^\d]+/g, "");
      clienteCnpj = clienteCnpj.length == 13 ? "0" + clienteCnpj : clienteCnpj;
      this.form.get("num_pedido").setValue(data[0][0].toString().match(new RegExp("\\d+", "g"))[0]);
      this.form.get("frete").setValue("Representada");

      let info = data[2][0].split("Informações adicionais:")[1] != null ? data[2][0].split("Informações adicionais:")[1].replace(/\n/g,' ') : null;
      if(info != null) this.form.get("obs").setValue(info);
      
      if (data[itens.final + 1][0] == "Valor total em produtos:") {
        this.condComercial = data[itens.final + 4][0].split(":")[1].replace("  Data de Emissão", "").trim();
        this.condComerciais.map((x) => {
          if(x.nome.toLowerCase() == this.condComercial.toLowerCase()){
            this.form.get("condicao_comercial_id").setValue(x.id);
            this.condComercial = "";
          }
        });
        this.form.get("data_emissao").setValue(moment(data[itens.final + 4][0].split(":")[2], "DD-MM-YYYY").format("YYYY-MM-DD"));
        info = data[itens.final + 8];
        if(info != null) {
          if(info.length > 0) {
            info = data[itens.final + 8][0].split("Informações Adicionais:")[1] != null ? data[itens.final + 8][0].split("Informações Adicionais:")[1].replace(/\n/g,' ') : null;
            if(info != null){
              if(this.form.get("obs").value != null){
                this.form.get("obs").setValue(this.form.get("obs").value + ", "+ info)
              }else{
                this.form.get("obs").setValue(info)
              }
            }
          }
        }
      }
      // else {
      //   this.condComercial = data[itens.final + 2][0].split(":")[1].replace("  Data de Emissão", "").trim();
      //   this.form.get("data_emissao").setValue(moment(data[itens.final + 2][0].split(":")[2], "DD-MM-YYYY").format("YYYY-MM-DD"));
      //   //this.form.get("obs").setValue(data[itens.final + 4][0].split(":")[1]);
      // }
      this.ValorTotal = itens.valorTotal;

      if (itens.item.length > 0) {
        itens.item.forEach(element => {
          this.addItem(element); //* Adiciona item à item que já esteja cadastrado no banco
        });
      }
      if (itens.newItem.length > 0) {
        this.itemsNew = [...itens.newItem];
        this.openDialogProdutos();
      }

      if (String(clienteCnpj).length == 14) {
        this.clientservice.getClientesCnpj(clienteCnpj).subscribe((res: any) => {
          if (res.success == true) {
            this.form.get("cliente_id").setValue(res.data.id);
            this.setAreaDeVenda(res.data.cliente_representada_area_vendas);
            this.CarregarProdutosRepresentada();
          } else {
            this.openDialogCNPJ(clienteCnpj);
          }
        });
      } else {
        this.notificationService.notify("CNPJ INCORRETO!");
      }

      this.spinner.hide()
    } catch(e) {
      this.notificationService.notify("Excel com divergência, informe ao administrador!");
      this.dialogRef.close();
    }
  }

  async kadesh(data, itens) {
    try{
      this.condComercial = data[12][0].split(" ")[0] + " " + data[12][0].split(" ")[1];
      this.condComerciais.map((x) => {
        if(x.nome.toLowerCase() == this.condComercial.toLowerCase()){
          this.form.get("condicao_comercial_id").setValue(x.id);
          this.condComercial = "";
        }
      });

      let clienteCnpj = data[7][0].toString().match(new RegExp("\\d{14}", "g"))[0];
      this.form.get("num_pedido").setValue(data[3][0]);
      this.form.get("data_emissao").setValue(moment(data[4][0].match(new RegExp("\\d{2}\\/\\d{2}\\/\\d{4}", "g"))[0].replace(/\//g, "-"), "DD-MM-YYYY").format("YYYY-MM-DD"));
      this.form.get("valor_total").setValue(itens.valorTotal);
      this.form.get("frete").setValue(data[itens.final + 9][0] == "CIF Destino" ? "Cliente" : "Representada");
      this.form.get("transportadora").setValue(data[itens.final + 11][0]);

      if (itens.item.length > 0) {
        itens.item.forEach(element => {
          this.addItem(element); //* Adiciona item à item que já esteja cadastrado no banco
        });
      }
      if (itens.newItem.length > 0) {
        this.itemsNew = [...itens.newItem];
        this.openDialogProdutos();
      }

      if (String(clienteCnpj).length == 14) {
        this.clientservice.getClientesCnpj(clienteCnpj).subscribe((res: any) => {
          if (res.success == true) {
            this.form.get("cliente_id").setValue(res.data.id);
            this.setAreaDeVenda(res.data.cliente_representada_area_vendas);
            this.CarregarProdutosRepresentada();
          } else {
            this.openDialogCNPJ(clienteCnpj);
          }
        });
      } else {
        this.notificationService.notify("CNPJ INCORRETO!");
      }
      this.spinner.hide();
    }catch(e) {
      this.notificationService.notify("Excel com divergência, informe ao administrador!");
      this.dialogRef.close();
    }
  }

  async betanin(data, itens) {
    try {
      console.log(data)
      if(data[2][24] == "Cod. Pagto."){
        this.condComercial = data[2][28];
      }else if(data[2][25] == "Cod. Pagto."){
        this.condComercial = data[2][29];
      }else if(data[2][26] == "Cod. Pagto."){
        this.condComercial = data[2][30];
      }else{
        this.condComercial = data[2][31];
      }

      this.condComerciais.map((x) => {
        if(x.nome.toLowerCase() == this.condComercial.toLowerCase()){
          this.form.get("condicao_comercial_id").setValue(x.id);
          this.condComercial = "";
        }
      });
      let clienteCnpj = data[5][3].replace(/[^\d]+/g, "");
      clienteCnpj = clienteCnpj.length == 13 ? "0" + clienteCnpj : clienteCnpj;
      
      if(data[1][24] == "Ordem SAP"){
        this.form.get("num_pedido").setValue(data[1][28]);
      }else if(data[1][25] == "Ordem SAP"){
        this.form.get("num_pedido").setValue(data[1][29]);
      }else if(data[1][26] == "Ordem SAP"){
        this.form.get("num_pedido").setValue(data[1][30]);
      }else{
        this.form.get("num_pedido").setValue(data[1][31]);
      }

      if(data[3][24] == "Data Emissão"){
        this.form.get("data_emissao").setValue(moment(this.dateAdapterWithUtc(data[3][28]), "YYYY-MM-DD"));
      }else if(data[3][25] == "Data Emissão"){
        this.form.get("data_emissao").setValue(moment(this.dateAdapterWithUtc(data[3][29]), "YYYY-MM-DD"));
      }else if(data[3][26] == "Data Emissão"){
        this.form.get("data_emissao").setValue(moment(this.dateAdapterWithUtc(data[3][30]), "YYYY-MM-DD").format("YYYY-DD-MM"));
      }else{
        this.form.get("data_emissao").setValue(moment(this.dateAdapterWithUtc(data[3][31]), "YYYY-MM-DD").format("YYYY-DD-MM"));
      }

      this.form.get("frete").setValue(data[itens.final + 2][3] == "CIF" ? "Cliente" : "Representada");
      this.form.get("transportadora").setValue(data[itens.final + 3][3]);

      this.ValorTotal = itens.valorTotal;
      this.form.get("subst").setValue(itens.subst);

      if (itens.item.length > 0) {
        itens.item.forEach(element => {
          this.addItem(element); //* Adiciona item à item que já esteja cadastrado no banco
        });
      }
      if (itens.newItem.length > 0) {
        this.itemsNew = [...itens.newItem];
        this.openDialogProdutos();
      }

      if (String(clienteCnpj).length == 14) {
        this.clientservice.getClientesCnpj(clienteCnpj).subscribe((res: any) => {
          if (res.success == true) {
            this.form.get("cliente_id").setValue(res.data.id);
            this.setAreaDeVenda(res.data.cliente_representada_area_vendas);
            this.CarregarProdutosRepresentada();
          } else {
            this.openDialogCNPJ(clienteCnpj);
          }
        });
      } else {
        this.notificationService.notify("CNPJ INCORRETO!");
      }
      this.spinner.hide();
    } catch(e) {
      console.log(e);
      this.notificationService.notify("Excel com divergência, informe ao administrador!");
      this.dialogRef.close();
    }
    
  }

  async italbotas(data, itens) {
    try{
      this.condComercial = data[6][18];
      this.condComerciais.map((x) => {
        if(x.nome.toLowerCase() == this.condComercial.toLowerCase()){
          this.form.get("condicao_comercial_id").setValue(x.id);
          this.condComercial = "";
        }
      });

      let clienteCnpj = data[5][17];
      clienteCnpj = clienteCnpj.length == 13 ? "0" + clienteCnpj : clienteCnpj;
      this.form.get("num_pedido").setValue(data[5][1].trim() + "/" + data[6][27].trim());
      this.form.get("data_emissao").setValue(moment(data[6][4].match(new RegExp("\\d{2}\\/\\d{2}\\/\\d{4}", "g"))[0].replace(/\//g, "-"), "DD-MM-YYYY").format("YYYY-MM-DD"));
      this.form.get("data_entrega").setValue(moment(data[6][10].match(new RegExp("\\d{2}\\/\\d{2}\\/\\d{4}", "g"))[0].replace(/\//g, "-"), "DD-MM-YYYY").format("YYYY-MM-DD"));

      if (itens.item.length > 0) {
        itens.item.forEach(element => {
          this.addItem(element); //* Adiciona item à item que já esteja cadastrado no banco
        });
      }
      if (itens.newItem.length > 0) {
        this.itemsNew = [...itens.newItem];
        this.openDialogProdutos();
      }

      if (String(clienteCnpj).length == 14) {
        this.clientservice.getClientesCnpj(clienteCnpj).subscribe((res: any) => {
          if (res.success == true) {
            this.form.get("cliente_id").setValue(res.data.id);
            this.setAreaDeVenda(res.data.cliente_representada_area_vendas);
            this.CarregarProdutosRepresentada();
          } else {
            this.openDialogCNPJ(clienteCnpj);
          }
        });
      } else {
        this.notificationService.notify("CNPJ INCORRETO!");
      }
      this.spinner.hide();
    }catch(e) {
      this.notificationService.notify("Excel com divergência, informe ao administrador!");
      this.dialogRef.close();
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
    this.clientservice.getClientes().subscribe((res: any) => {
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
      frete: [null],
      transportadora: [null],
      valor_total: [null, Validators.compose([Validators.required])],
      valor_liquido: [null],
      comissao_media: [null, Validators.compose([Validators.required])],
      comissao_bruto: [null, Validators.compose([Validators.required])],
      comissao_auxiliar: [null],
      comissao_vendedor: [null],
      status: [true, Validators.compose([Validators.required])],
      obs: [null],
      data_emissao: [null, Validators.compose([Validators.required])],
      data_entrega: [null],
      data_programada: [null],
      desconto: [null],
      subst: [null],
      situacao: ["pendente"],
      pedido_produtos: this.fb.array([], [Validators.required]),
    });
    this.produto = this.form.get("pedido_produtos") as FormArray;
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
        tamanho: item.tamanho,
        ipi: item.ipi != null ? parseFloat(item.ipi) : 0,
        valor_unitario: [item.valor_unitario, Validators.compose([Validators.required, Validators.min(0.01)])],
        valor_total: [
          item.quantidade * item.valor_unitario,
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
    this.produto.push(
      this.fb.group({
        codigo_catalogo: item.codigo_catalogo || item.produto.codigo_catalogo,
        nome: item.nome || item.produto.nome,
        produto_id: item.id,
        quantidade: [item.quantidade, Validators.required],
        cor: item.cor != null ? item.cor : null,
        embalagem: item.embalagem,
        tamanho: item.tamanho,
        ipi: item.ipi != null ? parseFloat(item.ipi) : 0,
        valor_unitario: [item.valor_unitario, Validators.compose([Validators.required, Validators.min(0.01)])],
        valor_total: [
          item.quantidade * item.valor_unitario,
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
          } else {
            this.notificationService.notify("Cliente não possui área de Venda!");
            this.areaVendaError = "Cliente não possui área de venda cadastrada, verifique antes de prosseguir!"
          }
        });
      }else{
        this.notificationService.notify("Cliente não possui área de Venda!");
        this.areaVendaError = "Cliente não possui área de venda cadastrada, verifique antes de prosseguir!"
      }
    } else {
      this.notificationService.notify("Cliente não possui área de Venda!");
      this.areaVendaError = "Cliente não possui área de venda cadastrada, verifique antes de prosseguir!"
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return (
        d.codigo_catalogo.toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.nome.toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.rows = temp;
    this.table = this.data.data;
  }
  setTotal(i) {
    let valor =
      this.produto.at(i).get("quantidade").value *
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
        this.rows = res.data;
        this.temp = [...this.rows];
        if(res.tipo == "corporativo" && res.data.length == 0 ){
          this.notificationService.notify("Cliente corporativo não possui produtos cadastrados!");
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
      // width: "75vw",
      // height: "75vh",
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
      if (res != null) {
        this.form.get("cliente_id").setValue(res.data.id);
        this.getClientes();
        this.setAreaDeVenda(res.data.cliente_representada_area_vendas);
        this.CarregarProdutosRepresentada();
      }else{
        this.notificationService.notify("cliente não cadastrado, selecione um cliente");
      }
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
        element.get("comissao_produto").value
      );
      comissao_auxiliar += this.comissaoCalcFaixa(
        this.comissao_auxiliar,
        element.get("quantidade").value,
        element.get("valor_unitario").value,
        element.get("comissao_produto").value
      );
    });
    this.form.get("comissao_vendedor").setValue(comissao_vendedor);
    this.form.get("comissao_auxiliar").setValue(comissao_auxiliar);
  }

  comissaoBruta() {
    let comissao = 0;
    this.produto.controls.forEach((element) => {
      comissao +=
        (element.get("quantidade").value *
          element.get("valor_unitario").value *
          element.get("comissao_produto").value) /
        100;
    });
    this.form.get("comissao_bruto").setValue(comissao);
    return comissao;
  }

  comissaoCalcFaixa(f, q, v, c) {
    if (f.comissao_faixas != undefined) {
      let percentual = 0;
      f.comissao_faixas.map((res) => {
        if (c >= res.faixa) {
          percentual = res.percentual;
        }
      });
      return ((q * v) / 100) * percentual;
    } else {
      return 0;
    }
  }

  descontoNecessario(valorProdutos){
    return ( ( (valorProdutos - this.ValorTotal) /  valorProdutos ) * 100).toFixed(4)
    //(((ValorTotal - valorTotal('total')) / valorTotal('total')) * 100)
  }

  aplicarDesconto(desconto){
    this.form.get("desconto").setValue(Number(desconto));
  }

  valorTotal(tipo) {
    let total = 0;
    let ipi = 0;
    this.produto.controls.forEach((element) => {
      if (element.get("ipi").value > 0) {
        ipi +=
          (element.get("quantidade").value *
            element.get("valor_unitario").value *
            element.get("ipi").value) /
          100;
      }
      total +=
        element.get("quantidade").value * element.get("valor_unitario").value;
    });
    let desconto = ((total + ipi) * this.form.get("desconto").value) / 100;
    let subst = this.form.get("subst").value > 0 ? this.form.get("subst").value : 0 ;
    this.form.get("valor_liquido").setValue(total - desconto);
    this.form.get("valor_total").setValue(Math.round(( total + ipi - desconto + subst) * 100) / 100);
    if (this.form.get("valor_total").value > (this.ValorTotal+ ipi)){
      this.disabled = true;
    }else{
      this.disabled = false;
    }  
    if (tipo == "total") return this.form.get("valor_total").value;
    else if (tipo == "ipi") return ipi;
    else return total - desconto;
  }

  async enviarPedido() {
    await this.comissaoVendedorAuxiliar();
    if(this.form.valid){
      this.clientservice.addPedido(this.form.value).subscribe((res: any) => {
        if (res.success == true) {
          this.notificationService.notify(`Pedido Cadastrado com Sucesso!`);
          this.dialogRef.close();
        } else {
          if(res.data.pedido == "Pedido ja Cadastrado"){
            this.notificationService.notify(`Já existe um pedido cadastrado com esses dados!`);
          }else{
            this.notificationService.notify(`Erro contate o Administrador`);
            console.log(res.data)
          }
          //this.dialogRef.close();
        }
      });
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
