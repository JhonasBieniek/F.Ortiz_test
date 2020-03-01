import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ClientService } from '../../shared/services/client.service.component';
import { NotificationService } from '../../shared/messages/notification.service';

import { OrderItem } from '../order-item.model';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { MatDialog, MatDialogConfig, MatDatepickerInputEvent } from '@angular/material';
import { ItemPedido } from '../itemPedido.model';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogBodyClienteComponent } from '../../cadastro/cliente/dialog-body/dialog-body-cliente.component';
import { switchMap } from 'rxjs/operators';

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
  selector: 'app-orcamento',
  templateUrl: './orcamento.component.html',
  styleUrls: ['./orcamento.component.css'],
  providers: [DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})

export class OrcamentoComponent implements OnInit {

  @Input() item: OrderItem
  @Output() add = new EventEmitter()

  public form: FormGroup;
  quantidade: any[] = [];
  
  clientes = [];
  representadas:[] = [];
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

  produto:any;
  currentAction:string = "";
  pageTitle:string = "";
  orcamento:any;


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

  @ViewChild('shoppingCart', {static: false}) shoppingCart: ShoppingCartComponent;
  @ViewChild(OrcamentoComponent, {static: false}) table: OrcamentoComponent;

  constructor(private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.clientservice.getRepresentadas().subscribe((res:any) => {
      this.representadas = res.data;
    });

    this.clientservice.getCondComerciais().subscribe((res:any) => {
      this.condComerciais = res.data;
    });

    this.clientservice.getAreaVenda().subscribe((res:any) => {
      this.areas = res.data;
    });

    this.getClientes();

  }

  ngOnInit() {
    this.form = this.fb.group({
      representada_id: [null, Validators.compose([Validators.required])],
      cliente_id: [null, Validators.compose([Validators.required])],
      data_emissao: [null, Validators.compose([Validators.required])],
      validade: [null, Validators.compose([Validators.required])],
      prazo_entrega: [null, Validators.compose([Validators.maxLength(100)])],
      minimo: [null, Validators.compose([Validators.maxLength(100)])],
      condicao_comercial_id: [null, Validators.compose([Validators.required])],
      obs: [null],
      frete: ['Representada', Validators.required],
      transportadora: [null],
      valor_total: [null],
      status: [true, Validators.required],
      orcamento_produtos: this.fb.array([])
    });

    this.produto = this.form.get('orcamento_produtos') as FormArray;
    this.setCurrentAction();
    this.loadOrcamento();
  }
  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    this.setPageTitle();
  }

  private loadOrcamento(){
    console.log(this.currentAction)

    if(this.currentAction == 'edit')
    this.route.paramMap.pipe(
      switchMap(params => this.clientservice.getOrcamento(+params.get('id')))
    )
    .subscribe(
      (orcamento:any) => {
        this.orcamento = orcamento.data;
        this.orcamento.orcamento_produtos.forEach(element => {
          this.addItem(element)
        });
        this.form.patchValue(this.orcamento)
      },
      (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
    )
  }

  private setCurrentAction() {
    if(this.route.snapshot.url[1].path != "edit"){
      this.currentAction = "edit"
    }else{
      this.currentAction = "edit"
    }
  }
  private setPageTitle() {
    if(this.currentAction == 'novo'){
      this.pageTitle = 'Novo Orçamento: '
    }else{
      const orc = (this.orcamento != undefined) ? this.orcamento.num_pedido : '';
      this.pageTitle = 'Editando orçamento: '+ orc;
    }
  }

  private getClientes(){
    this.clientservice.getClientes().subscribe((res:any) => {
      this.clientes = res.data;
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

  addProduto(item:any){
    this.produto.push(this.fb.group({
      codigo: item.codigo,
      nome: item.nome,
      produto_id: item.id,
      quantidade: item.quantidade,
      tamanho: item.tamanho,
      ipi: item.ipi,
      desconto: item.desconto,
      valor_unitario: item.valorUnitario,
      valor_total: new FormControl({value: (item.quantidade * item.valorUnitario), disabled: true}),
      obs: ''
    }));
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

  setTotal(i){
    let  valor = this.produto.at(i).get('quantidade').value * this.produto.at(i).get('valor_unitario').value;
    this.produto.at(i).get('valor_total').setValue(valor);
  }
  
  CarregarProdutosRepresentada(id) {
    this.clientservice.getProdutosRepresentada(id).subscribe(res => {
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
  
  updateDate(input: string, event: MatDatepickerInputEvent<Date>) {
    this.form.get(input).setValue(moment(event.value, 'DD-MM-YYYY').format("YYYY-MM-DD"));
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
    this.clientservice.addOrcamento(this.form.value).subscribe(res => {
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
}
