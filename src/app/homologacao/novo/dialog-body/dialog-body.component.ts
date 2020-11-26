import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from "@angular/material";
import { FormBuilder, FormGroup, Validators, ValidationErrors, FormControl } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyComponent implements OnInit {

  public form: FormGroup;

  fieldTipoVolk = false;
  dados:any= "";
  clientes:any = [];
  $clientes:any = [];
  produtos:any = [];
  $produtos:any = [];
  pageTitle:string = "";
  clienteBusca = new FormControl("");
  produtoBusca = new FormControl("");
  cnpj = new FormControl("00000000000000");
  tipoCliente = new FormControl("");
  codigo = new FormControl("");
  ca = new FormControl("");
  representada = new FormControl("");
  size:number = 50;

  constructor(public dialogRef: MatDialogRef<DialogBodyComponent>, 
                                @Inject(MAT_DIALOG_DATA) public data: any,
                                private fb: FormBuilder,
                                private notificationService: NotificationService,
                                private clientservice: ClientService
                                )
    {
      this.clientservice.getClientes().subscribe((res:any) =>{
        this.clientes = res.data;
      }); 
      this.clientservice.getProdutos().subscribe((res:any) =>{
        this.produtos = res.data;
      }); 
  }
                              
  ngOnInit() {
    if(this.data != null){
      this.form.patchValue(this.data);
      this.pageTitle = 'Editar Homologação'
    }else{
      this.pageTitle = 'Cadastrar Homologação'
      this.form = this.fb.group({
        cliente_id: [null, Validators.required],
        produto_id: [null, Validators.required],
        data_inicial: [null, Validators.required],
        data_final: [null],
        num_pedido: [null],
        tipo_volk: [null],
        status: ["Em teste", Validators.required],
        obs: [null],
        hideRequired: true,
        floatLabel: 'auto',
      });
    }
  }

  searchCliente() {
    let $cliente: Observable<any[]>;
    let nome = this.clienteBusca.value;
    if(nome != "" ){
      const val = nome.toLowerCase().split(" ");
      let xp = "";
      val.forEach(e => {
        xp += `(?=.*${e})`;
      });
      const re = new RegExp(xp, 'g');
      this.$clientes = this.clientes.filter(function(d) {
        if( d.razao_social.toLowerCase().match(re) || d.cnpj.toLowerCase().match(re) || !val)
        return d
      });
    }else{
      this.$clientes = $cliente;
    }
  }

  setCliente(cliente) {
    console.log(cliente)
    this.form.get('cliente_id').setValue(cliente.id);
    this.cnpj.setValue(cliente.cnpj);
    // Uppercase first letter
    this.tipoCliente.setValue(cliente.tipo_cliente.charAt(0).toUpperCase() + cliente.tipo_cliente.slice(1));
  }

  searchProduto() {
    let $produto: Observable<any[]>;
    let nome = this.produtoBusca.value;
    if(nome != "" ){
      const val = nome.toLowerCase().split(" ");
      let xp = "";
      val.forEach(e => {
        xp += `(?=.*${e})`;
      });
      const re = new RegExp(xp, 'g');
      this.$produtos = this.produtos.filter(function(d) {
        if( d.codigo_catalogo.toLowerCase().match(re) || d.nome.toLowerCase().match(re) || !val)
        return d
      });
    }else{
      this.$produtos = $produto;
    }
  }

  setProduto(produto) {
    console.log(produto)
    this.form.get('produto_id').setValue(produto.id);
    this.codigo.setValue(produto.codigo_catalogo);
    this.ca.setValue(produto.certificado_aprovacao);
    // Uppercase first letter
    this.representada.setValue(produto.representada.nome_fantasia);
    // Checks whether the products is from VOLK and enable field tipo_volk
    if(produto.representada_id === 9){
      this.fieldTipoVolk = true;
      this.size = 38;
    }else{
      this.fieldTipoVolk = false;
      this.size = 50;
    }
  }

  Submit() { 
    if(this.data != undefined){
      this.clientservice.updateHomologacao(this.form.value).subscribe( () =>{
        this.notificationService.notify("Atualizado com Sucesso!")
      })
    }else{
      this.clientservice.addHomogacao(this.form.value)  
    }
  }

  close() {
    this.dialogRef.close(
    );
  }

  getFormValidationErrors() {
    const result = [];
    Object.keys(this.form.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.form.get(key).errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          result.push({
            'control': key,
            'error': keyError,
            'value': controlErrors[keyError]
          });
        });
      }
    });
    console.log(result);
  }

}
