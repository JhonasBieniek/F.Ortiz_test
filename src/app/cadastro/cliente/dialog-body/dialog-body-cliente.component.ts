import { Component, OnInit, Inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  FormArray,
} from "@angular/forms";
import { ClientService } from "../../../shared/services/client.service.component";
import { NotificationService } from "../../../shared/messages/notification.service";
import { CustomValidators } from "ng2-validation";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
  MatDialogConfig,
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE,
} from "@angular/material";
import { AlertComponent } from "../../../alert/alert.component";
import { map } from "rxjs/operators";
import moment from "moment";
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { findIndex } from "rxjs-compat/operator/findIndex";
import { RelatorioClientePedidosComponent } from "./relatorio-cliente-pedidos/relatorio-cliente-pedidos.component";
import { DialogProdutosCorporativoComponent } from "./dialog-produtos-corporativo/dialog-produtos-corporativo.component";

export const MY_FORMATS = {
  parse: {
    dateInput: 'S'
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'S',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: "app-dialog-body-cliente",
  templateUrl: "./dialog-body-cliente.component.html",
  styleUrls: ["./dialog-body-cliente.component.css"],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['S'],
        },
        display: {
          dateInput: 'S',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'SS',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ]
})
export class DialogBodyClienteComponent implements OnInit {
  public form: FormGroup;
  cep: any;
  modelCidade: any;
  modelEstado: any;
  modelBairro;
  modelLogradouro;
  representadas: any = [];
  areas: any[] = [];
  ramos: any = [];
  bancos: any = [];
  estados: any = [];
  isReadOnly: boolean = false;
  pageTitle: string = "Cadastrar Cliente";
  readonly: boolean = false;

  clienteRelatorio: any;

  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    public dialogRef: MatDialogRef<DialogBodyClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    if (data != null) {
      if (data.action != "edit" && data.action != "view") {
        this.chargeCnpj(data);
      } else {
        if (data.action == 'edit') {
          this.pageTitle = "Editar Cliente";
        } else {
          this.pageTitle = "Visualizar Cliente";
          this.readonly = true;
        }
        this.IsReadOnly();

        this.clientservice.getClientesId(data.id).subscribe((res: any) => {
          this.clienteRelatorio = res.data
          this.addEnderecos(res.data.enderecos_clientes);
          this.addAreaVendas(res.data.cliente_representada_area_vendas);
          this.addVencimentos(res.data.cliente_vencimentos);
          this.addContatos(res.data.cliente_contatos);
          this.form.patchValue(res.data);
        });
      }
    }
    this.clientservice.getRepresentadasFunc().subscribe((res: any) => {
      this.representadas = res.data;
    });
    this.clientservice.getAreaVenda().subscribe((res: any) => {
      this.areas = res.data;
    });
    this.clientservice.getRamos().subscribe((res: any) => {
      this.ramos = res.data;
    });
    this.clientservice.getEstados().subscribe((res: any) => {
      this.estados = res.data;
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      razao_social: [null, Validators.compose([Validators.required])],
      nome_fantasia: [null, Validators.compose([Validators.required])],
      cnpj: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(14),
          Validators.maxLength(14),
        ]),
      ],
      inscricao_estadual: [null],
      email: [null, Validators.compose([CustomValidators.email])],
      telefone: [null],
      celular: [null],
      representante: [
        null,
        Validators.compose([Validators.minLength(5), Validators.maxLength(50)]),
      ],
      ramo_atividade_id: null,
      limite: null,
      categoria_volk: 'C',
      tipo_cliente: 'revendedor',
      //pagamento_tipo: 'Faturamento',
      obs: [null, Validators.compose([Validators.maxLength(100)])],
      status: true,
      enderecos_clientes: this.fb.array([], Validators.required),
      cliente_vencimentos: this.fb.array([]),
      cliente_representada_area_vendas: this.fb.array([]),
      cliente_contatos: this.fb.array([]),
      client_representeds: ([]),
    });
  }
  IsReadOnly() {
    this.isReadOnly = true;
  }

  addEndereco(data: any = null) {
    const endereco = this.form.controls.enderecos_clientes as FormArray;
    endereco.push(
      this.fb.group({
        endereco: this.fb.group({
          cep: data ? data.cep : [null, Validators.required],
          logradouro: data ? data.logradouro : null,
          numero: data ? data.numero : [null, Validators.required],
          complemento: data ? data.complemento : null,
          bairro: data ? data.bairro : null,
          cidade: data ? data.cidade : null,
          estado_id: data ? data.estado_id : null,
          pais: "Brasil",
        }),
      })
    );
  }
  addEnderecoEdit(data: any = null) {
    const endereco = this.form.controls.enderecos_clientes as FormArray;
    endereco.push(
      this.fb.group({
        endereco: this.fb.group({
          id: data ? data.id : [null, Validators.required],
          cep: data ? data.cep : null,
          logradouro: data ? data.logradouro : null,
          numero: data ? data.numero : [null, Validators.required],
          complemento: data ? data.complemento : null,
          bairro: data ? data.bairro : null,
          cidade: data ? data.cidade : null,
          estado_id: data ? data.estado_id : null,
          pais: "Brasil",
        }),
      })
    );
  }

  addAreaVenda(data: any = null) {
    const area_venda = this.form.controls.cliente_representada_area_vendas as FormArray;
    area_venda.push(
      this.fb.group({
        cliente_id: '',
        area_venda_id: data ? data.area_venda_id : null,
        representada_id: data ? data.representada_id : null,
      })
    );
  }


  addAreaVendaEdit(data: any = null) {
    const area_venda = this.form.controls.cliente_representada_area_vendas as FormArray;
    area_venda.push(
      this.fb.group({
        id: data ? data.id : null,
        cliente_id: data ? data.cliente_id : null,
        area_venda_id: data ? data.area_venda_id : null,
        representada_id: data ? data.representada_id : null,
      })
    );
  }

  addContato(data: any = null) {
    const contato = this.form.controls.cliente_contatos as FormArray;
    contato.push(
      this.fb.group({
        id: data ? data.id : '',
        nome: data ? data.nome : null,
        cargo: data ? data.cargo : null,
        celular: data ? data.celular : null,
        email: data ? data.email : null,
        preferential: data ? data.preferential : null,
        aniversario: null,
        cliente_id: this.data ? this.data.id : null,
      })
    );
  }
  addContatoEdit(data: any = null) {
    const contato = this.form.controls.cliente_contatos as FormArray;
    contato.push(
      this.fb.group({
        id: data ? data.id : null,
        nome: data ? data.nome : null,
        cargo: data ? data.cargo : null,
        celular: data ? data.celular : null,
        email: data ? data.email : null,
        preferential: data ? data.preferential : null,
        aniversario: data ? moment(data.aniversario).format() : null,
        cliente_id: data ? data.cliente_id : null,
      })
    );
  }

  delEndereco(index) {
    const endereco = this.form.controls.enderecos_clientes as FormArray;
    endereco.removeAt(index);
  }

  addEnderecos(data: any) {
    data.forEach(async (e: any) => {
      if (this.data.action == 'edit' || this.data.action == 'view') {
        this.addEnderecoEdit(e);
      } else {
        this.addEndereco(e);
      }
    });
  }

  delAreaVenda(index) {
    const area_venda = this.form.controls.cliente_representada_area_vendas as FormArray;
    area_venda.removeAt(index);
  }

  addAreaVendas(data: any) {
    data.forEach(async (e: any) => {
      if (this.data.action == 'edit' || this.data.action == 'view') {
        this.addAreaVendaEdit(e);
      } else {
        this.addAreaVenda(e);
      }
    });
  }

  delContato(index) {
    const contato = this.form.controls.cliente_contatos as FormArray;
    contato.removeAt(index);
  }

  addContatos(data: any) {
    data.forEach(async (e: any) => {
      if (this.data.action == 'edit' || this.data.action == 'view') {
        this.addContatoEdit(e);
      } else {
        this.addContato(e);
      }
    });
  }

  addRepresentadaTipo(data: any = null) {
    const tipo = this.form.controls.cliente_vencimentos as FormArray;
    tipo.push(
      this.fb.group({
        cliente_id: '',
        tipo: data ? data.tipo : null,
        representada_id: data ? data.representada_id : null,
        cliente_vencimento_dias: this.fb.array([]),
      })
    );
  }


  addRepresentadaTipoEdit(data: any = null) {
    const tipo = this.form.controls.cliente_vencimentos as FormArray;
    tipo.push(
      this.fb.group({
        id: data ? data.id : null,
        cliente_id: data ? data.cliente_id : null,
        tipo: data ? data.tipo : null,
        representada_id: data ? data.representada_id : null,
        cliente_vencimento_dias: this.fb.array([]),
      })
    );
    let index = tipo.value.findIndex(vencimento => vencimento.id == data.id && vencimento.representada_id == data.representada_id);
    data.cliente_vencimento_dias.forEach(vencimento => {
      this.addVencimento(index);
    });
  }

  // A partir daqui seria feito o Add das faixas de taxa da bandeira //
  cliente_vencimento_dias(comIndex: number): FormArray {
    const tipo = this.form.controls.cliente_vencimentos as FormArray;
    return tipo.at(comIndex).get("cliente_vencimento_dias") as FormArray
  }

  addVencimentos(data: any) {
    data.forEach(async (e: any) => {
      if (this.data.action == 'edit' || this.data.action == 'view') {
        this.addRepresentadaTipoEdit(e);
      } else {
        this.addRepresentadaTipo(e);
      }
    });
  }

  delRepresentadaVencimento(index) {
    const representaVencimentos = this.form.controls.cliente_vencimentos as FormArray;
    representaVencimentos.removeAt(index);
  }

  delVencimento(comIndex: number, vencimentoIndex: number) {
    // const endereco = this.form.controls.cliente_vencimentos as FormArray;
    // endereco.clear();
    this.cliente_vencimento_dias(comIndex).removeAt(vencimentoIndex);
  }

  addVencimento(comIndex) {
    this.cliente_vencimento_dias(comIndex).push(
      this.fb.group({
        id: '',
        cliente_vencimento_id: '',
        vencimento: null,
      })
    );
  }

  // addVencimentos(data: any) {
  //   data.forEach(async (e: any) => {
  //     await this.addVencimento(e, "i");
  //   });
  // }

  chargeForm(data) {
    this.form.get("razao_social").setValue(data.nome);
    this.form.get("nome_fantasia").setValue(data.fantasia);
    this.form.get("email").setValue(data.email);
    if (data.telefone.split("/")[0] != null) {
      this.form
        .get("telefone")
        .setValue(this.removeSpecialChar(data.telefone.split("/")[0]));
    }
    if (data.telefone.split("/")[1]) {
      this.form
        .get("celular")
        .setValue(
          this.addDigitsNumber(
            this.removeSpecialChar(data.telefone.split("/")[1])
          )
        );
    }
    let endereco = {
      cep: this.removeSpecialChar(data.cep),
      logradouro: data.logradouro,
      numero: data.numero,
      complemnto: data.complemento,
      estado_id: this.getIdEstado(data.uf),
      bairro: data.bairro,
      cidade: data.municipio,
    };
    this.addEndereco(endereco);
  }

  removeSpecialChar(data) {
    return data.toString().replace(/\D+/g, "");
  }

  addDigitsNumber(cell) {
    if (cell.length == 10) {
      return cell.substr(0, 2) + "9" + cell.substr(2);
    }
  }
  consultPriceTable(representada_id) {
    window.open(
      `/api/produtos/download/${representada_id}/${this.data.id}.pdf`,
      "_blank"
    );
  }

  onBlurMethod(index) {
    if(this.readonly == false){
      const enderecos = this.form.controls.enderecos_clientes as FormArray;
      if (
        enderecos.at(index).get("endereco").get("cep").value != null &&
        enderecos.at(index).get("endereco").get("cep").value.length == 8
      ) {
        this.clientservice
          .getCep(enderecos.at(index).get("endereco").get("cep").value)
          .subscribe((res) => {
            this.cep = res;
            if (this.cep.success == true) {
              enderecos
                .at(index)
                .get("endereco")
                .get("cidade")
                .setValue(this.cep.data.cidade);
              enderecos
                .at(index)
                .get("endereco")
                .get("estado_id")
                .setValue(this.getIdEstado(this.cep.data.estado));
              enderecos
                .at(index)
                .get("endereco")
                .get("logradouro")
                .setValue(this.cep.data.logradouro);
              enderecos
                .at(index)
                .get("endereco")
                .get("bairro")
                .setValue(this.cep.data.bairro);
            } else {
              this.openAlert("Erro", "Cep Inválido");
            }
          });
      }
    }
  }

  getIdEstado(data) {
    const estado = this.estados.filter(
      (e: any) => e.sigla.toLowerCase() === data.toLowerCase()
    );
    if (estado.length != 0) {
      return estado[0].id;
    }
  }

  onBlurCnpj() {
    if (this.data == null) {
      if (this.form.get("cnpj").value != null) {
        this.clientservice
          .getApiCnpj(this.form.get("cnpj").value)
          .subscribe((res: any) => {
            if (res.status != "ERROR") {
              this.chargeForm(res);
            } else {
              this.openAlert("Erro", "Cnpj Inválido");
            }
          });
      }
    }
  }

  chargeCnpj(data) {
    this.clientservice.getApiCnpj(data).subscribe((res: any) => {
      if (res.status != "ERROR") {
        this.form.get("cnpj").setValue(data);
        this.chargeForm(res);
      } else {
        this.openAlert("Erro", "Cnpj Inválido");
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.data != undefined && this.data.action == "edit") {
      this.form.value.cliente_contatos.forEach(element => {
        if (element.aniversario != null)
          element.aniversario = moment(element.aniversario).format("YYYY-MM-DD");
        if (element.email != null)
          element.email = element.email.replace(/\s/g, '');
      });

      this.clientservice.updateCliente(this.form.value).subscribe((res) => {
        if (res.status == "error") {
          this.notificationService.notify("Falha ao atualizar!");
        } else {
          this.notificationService.notify("Atualizado com Sucesso!");

        }
        this.dialogRef.close(res);
      });
    } else {
      this.form.value.cliente_contatos.forEach(element => {
        if (element.aniversario != null)
          element.aniversario = moment(element.aniversario).format("YYYY-MM-DD");
      });
      this.clientservice.addCliente(this.form.value).subscribe((res: any) => {
        if (res.status == "success") {
          this.notificationService.notify(`Cadastro Efetuado com Sucesso!`);
          this.dialogRef.close(res);
        } else {
          console.log(this.form.value)
          this.notificationService.notify(`Erro contate o Administrador`);
          //this.dialogRef.close();
        }
      });
    }
  }

  getFormValidationErrors() {
    const result = [];
    Object.keys(this.form.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.form.get(key).errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach((keyError) => {
          result.push({
            control: key,
            error: keyError,
            value: controlErrors[keyError],
          });
        });
      }
    });
    console.log(result);
  }

  openAlert(titulo, msg) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      width: "250px",
      data: {
        titulo: titulo,
        msg: msg,
      },
    };
    this.dialog.open(AlertComponent, dialogConfig);
  }

  hide = true;


  areasFilter(representada_id) {
    let areas = this.areas.filter(area => area.representada_id == representada_id);
    return areas;
  }

  relatorioPedidos(){
    this.clientservice.pedidosRelatorioByCliente(this.form.get('id').value).subscribe((res: any) => {
      if(res.data.length > 0){
        let dialogConfig = new MatDialogConfig();
        dialogConfig = {
          maxWidth: '75vw',
          maxHeight: '100vh',
          width: '75vw',
          height: '90vh'
        }
        dialogConfig.data = this.clienteRelatorio;
        dialogConfig.data.pedidos = res.data;
        let dialogRef = this.dialog.open(RelatorioClientePedidosComponent,
          dialogConfig
        );
      }else{
        this.notificationService.notify(`Não possui pedidos!`);
      }
    });
  }

  produtosCorporativos(tipo: string){
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '75vw',
      maxHeight: '100vh',
      width: '75vw',
      height: '90vh'
    }
    dialogConfig.data = []
    dialogConfig.data.client_representeds = this.form.get('client_representeds').value;
    dialogConfig.data.action = tipo;
    let dialogRef = this.dialog.open(
      DialogProdutosCorporativoComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(value => {
      if(value){
        this.form.controls['client_representeds'].setValue(value);
      }
    });
  }
}
