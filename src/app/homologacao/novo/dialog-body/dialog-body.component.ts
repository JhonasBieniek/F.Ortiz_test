import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
} from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  FormControl,
  FormArray,
} from "@angular/forms";
import { ClientService } from "../../../shared/services/client.service.component";
import { NotificationService } from "../../../shared/messages/notification.service";
import { Observable } from "rxjs";
import { Homologation } from "../../homologation.model";

@Component({
  selector: "app-dialog-body",
  templateUrl: "./dialog-body.component.html",
  styleUrls: ["./dialog-body.component.css"],
})
export class DialogBodyComponent implements OnInit {
  public form: FormGroup;

  fieldTipoVolk = false;
  dados: any = "";
  clientes: any = [];
  $clientes: any = [];
  produtos: any = [];
  $produtos: any = [];
  pageTitle: string = "";
  clienteBusca = new FormControl("");
  cnpj = new FormControl("00000000000000");
  tipoCliente = new FormControl("");
  size: number = 50;
  treinamento = true;

  constructor(
    public dialogRef: MatDialogRef<DialogBodyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Homologation,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private clientservice: ClientService
  ) {
    this.clientservice.getClientes().subscribe((res: any) => {
      this.clientes = res.data;
    });
    this.clientservice.getProdutosHomologation().subscribe((res: any) => {
      this.produtos = res.data;
    });
  }

  ngOnInit() {
    if (this.data != null) {
      this.pageTitle = "Editar Homologação";
      this.form = this.fb.group({
        id: this.data.id,
        cliente_id: [this.data.cliente_id, Validators.required],
        data_inicial: [this.data.data_inicial, Validators.required],
        data_final: [this.data.data_final],
        contato: [this.data.contato],
        tipo_volk: [this.data.tipo_volk],
        status: [this.data.status, Validators.required],
        obs: [this.data.obs],
        hideRequired: true,
        floatLabel: "auto",
        homologation_products: this.fb.array([]),
      });
      this.data.homologation_products.filter(e => {
        if(e.tipo_volk != null){
          this.isVolk(9);
        }
      })
      this.isVolk(9);
      this.setCliente(this.data.cliente);
      this.addNovosProdutoHomologacao(this.data.homologation_products);
      this.form.patchValue(this.data);
    } else {
      this.pageTitle = "Cadastrar Homologação";
      this.form = this.fb.group({
        cliente_id: [null, Validators.required],
        data_inicial: [null, Validators.required],
        data_final: [null],
        contato: [null],
        descricao: [null],
        tipo_volk: [null],
        status: ["Em teste", Validators.required],
        obs: [null],
        hideRequired: true,
        floatLabel: "auto",
        homologation_products: this.fb.array([]),
      });
    }
  }

  searchCliente() {
    let $cliente: Observable<any[]>;
    let nome = this.clienteBusca.value;
    if (nome != "") {
      const val = nome.toLowerCase().split(" ");
      let xp = "";
      val.forEach((e) => {
        xp += `(?=.*${e})`;
      });
      const re = new RegExp(xp, "g");
      this.$clientes = this.clientes.filter(function (d) {
        if (
          d.razao_social.toLowerCase().match(re) ||
          d.cnpj.toLowerCase().match(re) ||
          !val
        )
          return d;
      });
    } else {
      this.$clientes = $cliente;
    }
  }

  setCliente(cliente) {
    console.log(cliente);
    if (this.data != null) {
      this.clienteBusca.setValue(cliente.razao_social);
    }
    this.form.get("cliente_id").setValue(cliente.id);
    this.cnpj.setValue(cliente.cnpj);
    // Uppercase first letter
    this.tipoCliente.setValue(
      cliente.tipo_cliente.charAt(0).toUpperCase() +
        cliente.tipo_cliente.slice(1)
    );
  }

  searchProduto(value) {
    let $produto: Observable<any[]>;
    if (value != "") {
      const val = value.toLowerCase().split(" ");
      let xp = "";
      val.forEach((e) => {
        xp += `(?=.*${e})`;
      });
      const re = new RegExp(xp, "g");
      this.$produtos = this.produtos.filter(function (d) {
        if (
          d.codigo_catalogo.toLowerCase().match(re) ||
          d.nome.toLowerCase().match(re) ||
          !val
        )
          return d;
      });
    } else {
      this.$produtos = $produto;
    }
  }

  setProduto(produto, index: number) {
    const h = this.form.controls.homologation_products as FormArray;
    console.log(h.controls[index].get("representada"));
    if (this.data != null) {
      h.controls[index].get("produto_nome").setValue(produto.nome);
      h.controls[index]
        .get("representada")
        .setValue(produto.representada.nome_fantasia);
    } else {
      h.controls[index]
        .get("representada")
        .setValue(produto.representada.nome_fantasia);
    }
    h.controls[index].get("produto_id").setValue(produto.id);
    h.controls[index].get("codigo").setValue(produto.codigo_catalogo);
    h.controls[index].get("ca").setValue(produto.certificado_aprovacao);
    // Checks whether the products is from VOLK and enable field tipo_volk
    this.isVolk(produto.representada_id);
  }

  isVolk(representada_id) {
    if (representada_id === 9) {
      this.fieldTipoVolk = true;
      this.size = 38;
    } else {
      this.fieldTipoVolk = false;
      this.size = 50;
    }
  }

  addNovoProdutoHomologacao(data: any = null) {
    const produto_homologacao = this.form.controls
      .homologation_products as FormArray;
    produto_homologacao.push(
      this.fb.group({
        produto_id: null,
        produto_nome: null,
        codigo: null,
        ca: null,
        representada: null,
        tipo_volk: null,
      })
    );
  }

  addNovosProdutoHomologacao(data: any) {
    data.forEach(async (e: any) => {
      this.addNovoProdutoHomologacao(e);
    });
  }

  delProduto(index) {
    const produto_homologacao = this.form.controls
      .homologation_products as FormArray;
    produto_homologacao.removeAt(index);
  }

  close() {
    this.dialogRef.close();
  }

  Submit() {
    if (this.data != undefined) {
      this.clientservice.updateHomologacao(this.form.value).subscribe(() => {
        this.notificationService.notify("Atualizado com Sucesso!");
      });
    } else {
      this.clientservice.addHomogacao(this.form.value);
    }
  }

  // getFormValidationErrors() {
  //   const result = [];
  //   Object.keys(this.form.controls).forEach(key => {
  //     const controlErrors: ValidationErrors = this.form.get(key).errors;
  //     if (controlErrors) {
  //       Object.keys(controlErrors).forEach(keyError => {
  //         result.push({
  //           'control': key,
  //           'error': keyError,
  //           'value': controlErrors[keyError]
  //         });
  //       });
  //     }
  //   });
  //   console.log(result);
  // }
}
