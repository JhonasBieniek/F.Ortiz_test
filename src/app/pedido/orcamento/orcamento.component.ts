import { Component, OnInit, Input, EventEmitter, Output, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ClientService } from '../../shared/services/client.service.component';
import { NotificationService } from '../../shared/messages/notification.service';

import { OrderItem } from '../order-item.model';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { MatDialog, MatDialogConfig, MatDatepickerInputEvent, MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { ItemPedido } from '../itemPedido.model';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogBodyClienteComponent } from '../../cadastro/cliente/dialog-body/dialog-body-cliente.component';
import { switchMap } from 'rxjs/operators';
import { DialogProdPedidoComponent } from './dialog-prod-pedido/dialog-prod-pedido.component';


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
  styleUrls: ['./orcamento.component.css']
})

export class OrcamentoComponent implements OnInit {

  matcher = new MyErrorStateMatcher();

  @Input() item: OrderItem
  @Output() add = new EventEmitter()

  public form: FormGroup;
  quantidade: any[] = [];

  clientes = [];
  representadas: [] = [];
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

  produtos: any = [];
  currentAction: string = "";
  pageTitle: string = "";
  orcamento: any;


  resposta: any;
  selectedAreaVendaID: any;

  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  columns = [
    { prop: 'codigo_catalogo', flexGrow: 0.5, name: 'Cod. Catalogo' },
    { prop: 'nome', flexGrow: 0.8 },
    { prop: 'descricao', flexGrow: 2, name: 'Descrição' },
    { prop: 'embalagem', flexGrow: 1.2 }
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
      this.representadas = res.data;
    });

    this.clientservice.getCondComerciais().subscribe((res: any) => {
      this.condComerciais = res.data;
    });

    this.clientservice.getAreaVenda().subscribe((res: any) => {
      this.areas = res.data;
    });

    this.getClientes();

  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      representada_id: [null, Validators.compose([Validators.required])],
      cliente_id: [null, Validators.compose([Validators.required])],
      data_emissao: [null, Validators.compose([Validators.required])],
      validade: ['30 dias', Validators.compose([Validators.required])],
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

    this.produtos = this.form.get('orcamento_produtos') as FormArray;
    this.setCurrentAction();
    this.loadOrcamento();
  }
  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    this.setPageTitle();
  }

  private loadOrcamento() {
    if (this.currentAction == 'edit')
      this.clientservice.getOrcamento(this.info.orcamento.id)
        .subscribe(
          (orcamento: any) => {
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
    if (this.info.tipo == "novo") {
      this.currentAction = "novo"
    } else {
      this.currentAction = "edit"
    }
  }
  private setPageTitle() {
    if (this.currentAction == 'novo') {
      this.pageTitle = 'Novo Orçamento '
    } else {
      const orc = (this.orcamento != undefined) ? this.orcamento.id : '';
      this.pageTitle = 'Editando orçamento: ' + orc;
    }
  }

  private getClientes() {
    this.clientservice.getClientes().subscribe((res: any) => {
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

  addProduto(item: any) {
    console.log(item)
    this.produtos.push(this.fb.group({
      // Quando estiver editando precisa carregar os produtos de dentro do {produto}
      id: (item.produto != undefined) ? item.produto.id : null,
      codigo_catalogo: item.codigo_catalogo || item.produto.codigo_catalogo,
      nome: item.nome || item.produto.nome,
      produto_id: item.id,
      quantidade: [item.quantidade, Validators.required],
      tamanho: item.tamanho,
      cor: item.cor,
      ipi: item.ipi,
      valor_unitario: [item.valorUnitario, Validators.required],
      valor_total: [(item.quantidade * item.valorUnitario), Validators.required],
      obs: ''
    }));
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our datas
    const temp = this.temp.filter(e => e.nome || e.descricao != null).filter(function (d) {
      return d.codigo_catalogo.toLowerCase().indexOf(val) !== -1 || !val ||
        d.nome.toLowerCase().indexOf(val) !== -1 || !val ||
        d.descricao.toLowerCase().indexOf(val) !== -1 || !val
    });
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table = this.data;
  }

  setTotal(i) {
    let valor = this.produtos.at(i).get('quantidade').value * this.produtos.at(i).get('valor_unitario').value;
    this.produtos.at(i).get('valor_total').setValue(valor);
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
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '100vw',
      maxHeight: '100vh',

      width: '50vw',
      height: '40vh'
    }
    dialogConfig.data = selected[0];
    let dialogRef = this.dialog.open(
      DialogProdPedidoComponent,
      dialogConfig,

    );
    dialogRef.afterClosed().subscribe(value => {
      this.addItem(value);
    });
  }

  updateDate(input: string, event: MatDatepickerInputEvent<Date>) {
    this.form.get(input).setValue(moment(event.value, 'DD-MM-YYYY').format("YYYY-MM-DD"));
  }

  valorTotal() {
    let total = 0;
    this.produtos.controls.forEach(element => {
      total += (element.get('quantidade').value * element.get('valor_unitario').value);
    })
    this.form.get('valor_total').setValue(total);
    return total;
  }

  enviarPedido() {
    if (this.currentAction == 'edit') {
      this.clientservice.updateOrcamento(this.form.value).subscribe((res: any) => {
        this.notificationService.notify("Atualizado com Sucesso!");
        this.dialogRef.close(res.data);
      })
    } else {
      this.clientservice.addOrcamento(this.form.value).subscribe((res: any) => {
        if (res.status == 'success') {
          this.notificationService.notify(`Orçamento Cadastrado com Sucesso!`);
          this.dialogRef.close(res.data);
        } else {
          this.notificationService.notify(`Erro contate o Administrador`);
          this.dialogRef.close(res.data);
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
