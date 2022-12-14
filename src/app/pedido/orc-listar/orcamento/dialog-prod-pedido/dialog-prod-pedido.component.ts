import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-dialog-prod-pedido',
  templateUrl: './dialog-prod-pedido.component.html',
  styleUrls: ['./dialog-prod-pedido.component.css']
})

export class DialogProdPedidoComponent implements OnInit {
  
  public form: FormGroup;
  cores: any[] = [];
  tamanhos: any[] = [];
  displayedColumns: string[] = ['Nome', 'Cor', 'Tamanho', 'Quantidade', 'Vlr Unit.', 'Vlr total'];
  dataSource: any[] = [];
  produtos: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogProdPedidoComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog) { 
                
      this.cores = this.data.produto_cores.length == 0 ? [{nome: 'Sem cor cadastrada!'}] : this.data.produto_cores
      this.tamanhos = this.data.produto_tamanhos.length == 0 ? [{nome: 'Sem tamanho cadastrado!'}] : this.data.produto_tamanhos
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: this.data.id,
      codigo_catalogo: this.data.codigo_catalogo,
      nome: this.data.nome,
      embalagem: this.data.produto_embalagem.nome,
      ipi: this.data.ipi,
      valor_unitario: [this.data.produto_estados_precos[0].preco],
      tamanho: [null],
      obs: [null],
      quantidade: [null,Validators.required],
      cor: [ this.cores[0].nome],
      valor_total: [null,Validators.required]
    });
  }
  save(){
    this.dialogRef.close(this.dataSource);
  }

  addProduto(){
    this.dataSource = [];
    this.produtos.push(this.form.value);
    this.dataSource = [...this.produtos];
    this.limparProdutos();
  }

  limparProdutos(){
    this.form = this.fb.group({
      id: this.data.id,
      codigo_catalogo: this.data.codigo_catalogo,
      nome: this.data.nome,
      embalagem: this.data.produto_embalagem.nome,
      ipi: this.data.ipi,
      valor_unitario: [this.data.produto_estados_precos[0].preco],
      tamanho: [null],
      quantidade: [null,Validators.required],
      cor: [ this.cores[0].nome],
      valor_total: [null,Validators.required]
    });
  }

  setTotal() {
    if( this.form.get('quantidade').value > 0){
      this.form.get('valor_total').setValue( this.form.get('valor_unitario').value * this.form.get('quantidade').value);
    }else{
      this.form.get('valor_total').setValue( 0);
    }
    
  }

}
