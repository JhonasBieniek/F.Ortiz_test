import { Component, OnInit, Input, EventEmitter, Output, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';

import { OrderItem } from '../../order-item.model';
import { ShoppingCartComponent } from '../../shopping-cart/shopping-cart.component';
import { MatDialog, MatDialogConfig, MatDatepickerInputEvent, MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { ItemPedido } from '../../itemPedido.model';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogBodyClienteComponent } from '../../../cadastro/cliente/dialog-body/dialog-body-cliente.component';
import { switchMap } from 'rxjs/operators';
import { DialogProdPedidoComponent } from './dialog-prod-pedido/dialog-prod-pedido.component';
import { Observable } from 'rxjs/Observable';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-orcamento',
  templateUrl: './orcamento.component.html',
  styleUrls: ['./orcamento.component.css'],
})

export class OrcamentoComponent implements OnInit {

  matcher = new MyErrorStateMatcher();

  @Input() item: OrderItem
  @Output() add = new EventEmitter()

  public form: FormGroup;
  quantidade: any[] = [];


  cliente_id;

  clientes = [];
  representadas: [] = [];
  dataCondComerciais: any;
  condComerciais = [];
  dataAreaVenda: any;

  selectedRepresentada: any;
  selectedCliente: string;
  selectedCondComerciais: string;
  selectedAreaVenda;

  data: any = [];
  editing = {};
  rows = [];
  temp = [...this.data];
  selected = [];

  produtos: any = [];
  clientes$:any= [];
  currentAction: string = "";
  pageTitle: string = "";
  orcamento: any;
  searchValue: string ="";

  results: Observable<any[]>;

  resposta: any;
  selectedAreaVendaID: any;

  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  columns = [
    { prop: 'codigo_catalogo', flexGrow: 0.5, name: 'Cod. Catalogo' },
    { prop: 'nome', flexGrow: 0.8 },
    { prop: 'produto_embalagems[0].nome', flexGrow: 2, name: 'Emalagem'},
    { prop: 'produto_embalagems.nome', flexGrow: 1.2 }
  ];

  @ViewChild('shoppingCart', { static: false }) shoppingCart: ShoppingCartComponent;
  @ViewChild(OrcamentoComponent, { static: false }) table: OrcamentoComponent;

  constructor(private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<OrcamentoComponent>,
    @Inject(MAT_DIALOG_DATA) public info: any,

  ) {
    this.clientservice.getRepresentadas().subscribe((res: any) => {
      this.representadas = res.data.filter( function (e:any) {
        if(e.status == true)
        return e;
      });
    });

    this.clientservice.getCondComerciais().subscribe((res: any) => {
      this.condComerciais = res.data;
    });

    this.getClientes();

  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      representada_id: [null, Validators.compose([Validators.required])],
      cliente_id: [{value: null, disabled: true}, Validators.compose([Validators.required])],
      data_emissao: [null, Validators.compose([Validators.required])],
      validade: ['3 dias', Validators.compose([Validators.required])],
      prazo_entrega: ['média de 7 dias', Validators.compose([Validators.maxLength(100)])],
      minimo: [null, Validators.compose([Validators.maxLength(100)])],
      condicao_comercial_id: [null, Validators.compose([Validators.required])],
      obs: [null],
      quotation : [null],
      quotation_name : [null],
      quotation_phone : [null],
      frete: ['Representada', Validators.required],
      transportadora: [null],
      valor_total: [null],
      status: [false],
      situation: 1,
      orcamento_produtos: this.fb.array([])
    });

    this.produtos = this.form.get('orcamento_produtos') as FormArray;
    this.setCurrentAction();
    this.loadOrcamento();
  }
  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    this.setPageTitle();
  }

  searchClientes() {
    let cliente: Observable<any[]>;
    if(this.searchValue != "" ){
      const val = this.searchValue.toLowerCase().split(" ");
      let xp = "";
      val.forEach(e => {
        xp += `(?=.*${e})`;
      });
      const re = new RegExp(xp, 'g');
      this.results = this.clientes$.filter(function(d) {
        if( d.razao_social.toLowerCase().match(re) || d.cnpj.match(re) || !val)
        return d
      });
    }else{
      this.results = cliente;
    }
    this.clearProdutos();
    this.rows = [];
  }

 public loadOrcamento() {
    if (this.currentAction == 'edit'){
      this.clientservice.getOrcamento(this.info.orcamento.id)
        .subscribe(
          (orcamento: any) => {
            this.orcamento = orcamento.data;
            //console.log(this.orcamento)
            this.form.patchValue(this.orcamento);
            this.cliente_id = this.orcamento.cliente_id;
            this.form.get('cliente_id').setValue(this.orcamento.cliente.razao_social);
            this.form.get('cliente_id').enable();
            this.CarregarProdutosRepresentada2(this.orcamento.cliente_id, this.orcamento.representada_id, this.orcamento);
          },
          (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
        )
    }else {
      this.form.get('data_emissao').setValue(new Date());
    }
  }

  CarregarProdutosRepresentada2(cliente_id, representada_id, produtos) {
    this.clientservice.getProdRepCli(representada_id, cliente_id ).subscribe((res:any) => {
      //console.log(res)
      this.rows = res.data;
      this.temp = [...this.rows];
      
      produtos.orcamento_produtos.forEach(element => {
        this.rows.filter(produto => {
          if(produto.id == element.produto_id){
            element.valor_unitario = produto.produto_estados_precos[0].preco;
          }
        })
        this.addItem(element)
      });

      if(res.tipo == "corporativo" && res.data.length == 0 ){
        this.notificationService.notify("Cliente corporativo não possui produtos cadastrados!");
      }
    })
  }

  private transform (data) {
      let result = "";
      data.forEach(function (element, index) {
          if (index == 0){
            if(element.tamanho){
              result += element.tamanho.nome
            }else{
              result += element.nome
            }
          }else{
            if(element.tamanho){
              result += " ," + element.tamanho.nome
            }else{
              result += " ," + element.nome
            }
          }
      });
    return result;
  }

  private setCurrentAction() {
    if (this.info.tipo == "novo") {
      this.currentAction = "novo"
    } else {
      this.currentAction = "edit"
    }
  }
  private setPageTitle() {
    if (this.currentAction == 'novo') {
      this.pageTitle = 'Nova cotação '
    } else {
      const orc = (this.orcamento != undefined) ? this.orcamento.id : '';
      this.pageTitle = 'Editando cotação: ' + orc;
    }
  }

  private getClientes() {
    this.clientservice.getClientes().subscribe((res: any) => {
      this.clientes = res.data;
      this.clientes$ = res.data;
    });
  }

  addCliente() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '75vw',
      maxHeight: '100vh',

      width: '75vw',
      height: '90vh'
    }
    let dialogRef = this.dialog.open(
      DialogBodyClienteComponent,
      dialogConfig,

    );
    dialogRef.afterClosed().subscribe(() => {
      this.getClientes();
    });
  }

  addItem(item: ItemPedido) {
    this.addProduto(item);
  }

  addProduto(item: any) {
    this.produtos.push(this.fb.group({
      // Quando estiver editando precisa carregar os produtos de dentro do {produto}
      id: (item.produto != undefined) ? item.produto.id : null,
      codigo_catalogo: item.codigo_catalogo || item.produto.codigo_catalogo,
      nome: item.nome || item.produto.nome,
      produto_id: (item.produto != undefined) ? item.produto.id : item.id,
      quantidade: [item.quantidade, Validators.required],
      tamanho: item.tamanho,
      embalagem: item.embalagem,
      cor: item.cor,
      ipi: item.ipi,
      valor_unitario: [item.valor_unitario, Validators.required],
      valor_total: [(item.quantidade * item.valor_unitario + item.quantidade * item.valor_unitario* (item.ipi/100)), Validators.required],
      obs: ''
    }));
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our datas
    const temp = this.temp.filter(e => e.nome || e.descricao != null).filter(function (d) {
      return d.codigo_catalogo.toLowerCase().indexOf(val) !== -1 || 
              d.codigo_importacao.toLowerCase().indexOf(val) !== -1 ||
              d.nome.toLowerCase().indexOf(val) !== -1 || !val 
    });
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table = this.data;
  }

  setTotal(i) {
    const valor = this.produtos.at(i).get('quantidade').value * this.produtos.at(i).get('valor_unitario').value;
    const ipi = this.produtos.at(i).get('quantidade').value * this.produtos.at(i).get('valor_unitario').value * this.produtos.at(i).get('ipi').value / 100;
    this.produtos.at(i).get('valor_total').setValue(valor + ipi);
  }

  CarregarProdutosRepresentada(cliente_id, representada_id) {
    this.clientservice.getProdRepCli(representada_id, cliente_id ).subscribe((res:any) => {
      this.rows = res.data;
      this.temp = [...this.rows];
      if(res.tipo == "corporativo" && res.data.length == 0 ){
        this.notificationService.notify("Cliente corporativo não possui produtos cadastrados!");
      }
      this.loadingIndicator = false;

    })
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

  updateDate(input: string, event: MatDatepickerInputEvent<Date>) {
    this.form.get(input).setValue(moment(event.value, 'DD-MM-YYYY').format("YYYY-MM-DD"));
  }

  valorTotal() {
    let total = 0;
    let ipi = 0;
    this.produtos.controls.forEach(element => {
      if (element.get('ipi').value > 0) {
        ipi += (element.get('quantidade').value * element.get('valor_unitario').value * element.get('ipi').value) / 100;
      }
      total += element.get('quantidade').value * element.get('valor_unitario').value;
    })
    this.form.get('valor_total').setValue(total + ipi);
    return total + ipi;
  }

  enviarPedido() {
    this.form.get('cliente_id').setValue(this.cliente_id);
    //console.log(this.form.value)
    stop;
    if (this.currentAction == 'edit') {
      this.clientservice.updateOrcamento(this.form.value).subscribe((res: any) => {
        if (res.success == true) {
          this.notificationService.notify(`Orçamento Cadastrado com Sucesso!`);
          this.dialogRef.close();
        } else {
          if(res.data.min_value){
            this.notificationService.notify(res.data.min_value);
          }else{
            this.notificationService.notify(`Erro contate o Administrador`);
          }
        }
      })
    } else {
      this.clientservice.addOrcamento(this.form.value).subscribe((res: any) => {
        if (res.status == 'success') {
          this.notificationService.notify(`Orçamento Cadastrado com Sucesso!`);
          this.dialogRef.close(res.data);
        } else {
          if(res.data.min_value){
            this.notificationService.notify(res.data.min_value);
          }else{
            this.notificationService.notify(`Erro contate o Administrador`);
          }
        }
      });
    }
  }

  clearProdutos() {
    while (this.produtos.controls.length) {
      this.produtos.removeAt(0);
    }
  }

  removeItem(index) {
    this.produtos.removeAt(index);
  }
}
