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
import { A } from "@angular/cdk/keycodes";

@Component({
  selector: "app-dialog-body",
  templateUrl: "./dialog-body.component.html",
  styleUrls: ["./dialog-body.component.css"],
})
export class DialogBodyComponent implements OnInit {
  public form: FormGroup;

  fieldTipoVolk: boolean[] = [];
  dados: any = "";
  clientes: any = [];
  $clientes: any = [];
  produtos: any = [];
  classifications: any = [];
  $produtos: any = [];
  pageTitle: string = "";
  clienteBusca = new FormControl("");
  cnpj = new FormControl("00000000000000");
  tipoCliente = new FormControl("");
  size: number[] = [];
  treinamento = true;

  constructor(
    public dialogRef: MatDialogRef<DialogBodyComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
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
    this.clientservice.getClassificacoes().subscribe((res: any) => {
      this.classifications = res.data;
    });
  }

  ngOnInit() {
    if (this.data != null) {
      this.pageTitle = "Editar Homologação";
      this.form = this.fb.group({
        cliente_id: [this.data[0].cliente_id, Validators.required],
        hideRequired: true,
        floatLabel: "auto",
        homologation_products: this.fb.array([]),
      });
      this.clienteBusca.disable();
      this.setCliente(this.data[0]);
      this.data.forEach((element, index) => {
        this.addEditProdutoHomologacao(element, index);
      });
    } else {
      this.pageTitle = "Cadastrar Homologação";
      this.form = this.fb.group({
        cliente_id: [null, Validators.required],
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
    if (this.data != null) {
      this.clienteBusca.setValue(cliente.razao_social);
    }
    this.form.get("cliente_id").setValue(cliente.id);
    this.cnpj.setValue(cliente.cnpj);
    // Uppercase first letter
    if(cliente.tipo_cliente != null){
      this.tipoCliente.setValue(
        cliente.tipo_cliente.charAt(0).toUpperCase() +
          cliente.tipo_cliente.slice(1)
      );
    }
    
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
          d.codigo_importacao.toLowerCase().match(re) ||
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
    h.controls[index].get("tipo_volk").setValue(produto.classification.name);
    // Checks whether the products is from VOLK and enable field tipo_volk
    this.isVolk(produto.representada_id, index);
  }

  isVolk(representada_id, index) {
    if (representada_id === 9) {
      this.fieldTipoVolk[index] = true;
      this.size[index] = 23;
    } else {
      this.fieldTipoVolk[index] = false;
      this.size[index] = 32;
    }
  }

  addNovoProdutoHomologacao(data: any = null) {
    const produto_homologacao = this.form.controls
      .homologation_products as FormArray;
    produto_homologacao.push(
      this.fb.group({
        produto_id: null,
        cliente_id: this.form.get('cliente_id').value,
        contato: "WhatsApp/Online",
        produto_nome: null,
        codigo: null,
        ca: null,
        representada: null,
        tipo_volk: null,
        status: "Em teste",
        venda: null,
        data_inicial: new FormControl(new Date()),
        data_final: null
      })
    );
  }

  addEditProdutoHomologacao(data: any = null, index) {
    const produto_homologacao = this.form.controls
      .homologation_products as FormArray;
    produto_homologacao.push(
      this.fb.group({
        id: data.id,
        homologation_id: data.homologation_id,
        produto_id: data.produto_id,
        cliente_id: data.cliente_id,
        contato: data.contato,
        produto_nome: data.produto_nome,
        codigo: data.codigo,
        ca: data.ca,
        representada: data.representada,
        tipo_volk: data.tipo_volk,
        status: data.status,
        venda: data.venda,
        data_inicial: data.data_inicial,
        data_final: data.data_final
      })
    );
    if(data.tipo_volk != null){
      this.isVolk(9,index);
    }else{
      this.isVolk(1,index);
    }
  }

  delProduto(index) {
    const produto_homologacao = this.form.controls.homologation_products as FormArray;
    if (produto_homologacao.controls[index].get('id') != null) { 
      this.clientservice.delHomologacao(produto_homologacao.controls[index].get('id').value).subscribe( res => console.log(res));
    }
    produto_homologacao.removeAt(index);
  }

  close() {
    this.dialogRef.close();
  }

  Submit() {
    if (this.data != undefined) {
      let lastID: number = 0;
      this.form.value.homologation_products.map(e => {
        if(lastID < e.homologation_id){
          lastID = e.homologation_id;
        }
      });
      this.form.value.homologation_products.forEach(element => {
        if(element.homologation_id != undefined) {
          this.clientservice.updateHomologacao(element).subscribe(() => {
            this.notificationService.notify("Atualizado com Sucesso!");
          });
        }else{
          element.homologation_id = lastID;
          this.clientservice.addProdutoHomologacao(element).subscribe(() => {
            this.notificationService.notify("Atualizado com Sucesso!");
          });
        }
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
