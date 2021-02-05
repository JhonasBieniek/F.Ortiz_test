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
} from "@angular/material";
import { AlertComponent } from "../../../alert/alert.component";
import { map } from "rxjs/operators";

@Component({
  selector: "app-dialog-body-cliente",
  templateUrl: "./dialog-body-cliente.component.html",
  styleUrls: ["./dialog-body-cliente.component.css"],
})
export class DialogBodyClienteComponent implements OnInit {
  public form: FormGroup;
  cep: any;
  modelCidade: any;
  modelEstado: any;
  modelBairro;
  modelLogradouro;
  representadas: any = [];
  areas: any = [];
  ramos: any = [];
  bancos: any = [];
  estados: any = [];
  pageTitle: string = "Cadastrar Cliente";

  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    public dialogRef: MatDialogRef<DialogBodyClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    if (data != null) {
      if (data.action != "edit") {
        this.chargeCnpj(data);
      } else {
        this.pageTitle = "Editar Cliente";
        this.clientservice.getClientesId(data.id).subscribe((res: any) => {
          this.addEnderecos(res.data.enderecos_clientes);
          this.addVencimentos(res.data.cliente_vencimentos);
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
      area_venda_id: [null, Validators.compose([Validators.required])],
      ramo_atividade_id: [null],
      limite: null,
      categoria_volk: null,
      tipo_cliente: null,
      pagamento_tipo: null,
      obs: [null, Validators.compose([Validators.maxLength(100)])],
      status: true,
      enderecos_clientes: this.fb.array([]),
      cliente_vencimentos: this.fb.array([]),
    });
  }

  addEndereco(data: any = null) {
    const endereco = this.form.controls.enderecos_clientes as FormArray;
    endereco.push(
      this.fb.group({
        endereco: this.fb.group({
          id: data ? data.id : null,
          cep: data ? data.cep : null,
          logradouro: data ? data.logradouro : null,
          numero: data ? data.numero : null,
          complemento: data ? data.complemento : null,
          bairro: data ? data.bairro : null,
          cidade: data ? data.cidade : null,
          estado_id: data ? data.estado_id : null,
          pais: "Brasil",
        }),
      })
    );
  }

  delEndereco(index) {
    const endereco = this.form.controls.enderecos_clientes as FormArray;
    endereco.removeAt(index);
  }

  addEnderecos(data: any) {
    data.forEach(async (e: any) => {
      await this.addEndereco(e);
    });
  }

  clearVencimento() {
    const endereco = this.form.controls.cliente_vencimentos as FormArray;
    endereco.clear();
  }

  addVencimento(data: any = null, type) {
    const endereco = this.form.controls.cliente_vencimentos as FormArray;

    if (type == "v") {
      endereco.clear();
    } else if (endereco.length == 3) {
      alert("Número limite de vencimentos");
    } else
      endereco.push(
        this.fb.group({
          id: data ? data.id : null,
          vencimento: data ? data.vencimento : null,
        })
      );
  }

  delVencimento(index) {
    const vencimento = this.form.controls.cliente_vencimentos as FormArray;
    vencimento.removeAt(index);
  }

  addVencimentos(data: any) {
    data.forEach(async (e: any) => {
      await this.addVencimento(e, "i");
    });
  }

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
      cep: data.cep,
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
      `test2.fortiz.com.br/api/produtos/download/${representada_id}/${this.data.id}.pdf`,
      "_blank"
    );
  }

  onBlurMethod(index) {
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
      this.clientservice.updateCliente(this.form.value).subscribe(() => {
        this.notificationService.notify("Atualizado com Sucesso!");
      });
    } else {
      this.clientservice.addCliente(this.form.value).subscribe((res: any) => {
        if (res.status == "success") {
          this.notificationService.notify(`Cadastro Efetuado com Sucesso!`);
          this.dialogRef.close(res);
        } else {
          this.notificationService.notify(`Erro contate o Administrador`);
          this.dialogRef.close();
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
}
