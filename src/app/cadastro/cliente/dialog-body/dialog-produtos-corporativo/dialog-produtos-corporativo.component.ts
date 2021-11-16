import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotificationService } from '../../../../shared/messages/notification.service';
import { ClientService } from '../../../../shared/services/client.service.component';
import { DialogRepresentadaConfirmacaoComponent } from './dialog-representada-confirmacao/dialog-representada-confirmacao.component';

@Component({
  selector: 'app-dialog-produtos-corporativo',
  templateUrl: './dialog-produtos-corporativo.component.html',
  styleUrls: ['./dialog-produtos-corporativo.component.css']
})
export class DialogProdutosCorporativoComponent implements OnInit {

  public form: FormGroup;
  hide = false;

  //* Variaveis para produtos corporativos
  representadas: any = [];
  produtos: any[] = [];
  produtosByRepresentada: any[] = [];
  readonly: boolean = false;
  prevMatSelectValue: any;
  
  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    public dialogRef: MatDialogRef<DialogProdutosCorporativoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService,
    private dialog: MatDialog
    ) { 
      this.form = this.fb.group({
        client_representeds: this.fb.array([]),
      });

      this.clientservice.getRepresentadasFunc().subscribe((res: any) => {
        this.representadas = res.data;

        this.clientservice.getProdutosSoft().subscribe((res: any) => {
          this.produtos = res.data;
          this.produtos.map((e) => {
            e.display = e.nome +' - '+ e.codigo_catalogo;
            e.value = e.id.toString();
          });

          this.representadas.forEach(representada => {
            let produtos = this.produtos.filter( (produto:any) => { 
              if(produto.representada_id == representada.id) return produto;
            });
            this.produtosByRepresentada[representada.id] = produtos;

          });
          if(this.data.action == 'view'){
            this.readonly = true;
          }
          this.load(this.data);
        });

      });
    }

  ngOnInit() {
  }
  load(data){

    for (let index = 0; index < data.client_representeds.length; index++) {
      this.addRepresentada();
      for (let indexProducts = 0; indexProducts < data.client_representeds[index].client_represented_products.length; indexProducts++) {
        this.addRepresentadaProdutos(index);

        //* Precisa transformar o integer em string para que o select dos produtos funcione
        data.client_representeds[index].client_represented_products[indexProducts].produto_id = data.client_representeds[index].client_represented_products[indexProducts].produto_id.toString();
      }
    }

    this.form.get('client_representeds').patchValue(data.client_representeds);
  }
  //* Controla as representadas
  client_representeds(): FormArray{
    return this.form.get("client_representeds") as FormArray
  }
  
  novaRepresentada(): FormGroup{
    return this.fb.group({
      id: '',
      representada_id: [null, Validators.required],
      cliente_id: '',
      client_represented_products: this.fb.array([]),
    })
  }

  addRepresentada(){
    this.client_representeds().push(this.novaRepresentada());
  }

  checkExistRepresentada(representadaIndex: any, id: any){
    this.client_representeds().controls.forEach((e:any, k:any) => {
      if(e.get('representada_id').value == id && k != representadaIndex){
        this.notificationService.notify('Representada ja selecionada !.')
        this.client_representeds().removeAt(representadaIndex);
      }
    })
  }

  removeRepresentada(representadaIndex: number){
    this.client_representeds().removeAt(representadaIndex);
  }

  //* Fim do controle das representadas

  //* Controla cada produto da representada
  
  client_represented_products(representadaIndex: number) : FormArray{
    return this.client_representeds().at(representadaIndex).get("client_represented_products") as FormArray
  }

  addRepresentadaProdutos(representadaIndex: number){
    this.client_represented_products(representadaIndex).push(this.addProduto());
  }

  addProduto(): FormGroup {
    return this.fb.group({
      id: '',
      client_represented_id: '',
      produto_id: [null,Validators.required],
      valor_outros: [null,Validators.required],
      valor_pr: [null,Validators.required],
    })
  }

  removeRepresentadaProduto(representadaIndex: number, produtosIndex: number){
    this.client_represented_products(representadaIndex).removeAt(produtosIndex);
  }

  produtosIndex(representada_id){
    let index = this.produtosByRepresentada.findIndex((representada:any) => { return representada.representada_id == representada_id });
    return index;
  }

  produtosRepresentada(representadaIndex){
    return this.produtosByRepresentada[this.produtosIndex(this.client_representeds().at(representadaIndex).get('representada_id').value)].produtos
  }

  representadaChangeValidate(event, index){
    if(event.value != this.prevMatSelectValue && this.prevMatSelectValue != null){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = []
        dialogConfig.data.antiga = this.representadas.find((representada:any) => { return representada.id == this.prevMatSelectValue });
        dialogConfig.data.nova = this.representadas.find((representada:any) => { return representada.id == event.value });
        let dialogRef = this.dialog.open(DialogRepresentadaConfirmacaoComponent,
          dialogConfig
        );
        dialogRef.afterClosed().subscribe(value => {
          if(value == true){
              while (this.client_represented_products(index).length !== 0) {
                this.client_represented_products(index).removeAt(0)
              }
          }else{
            this.client_representeds().at(index).get("representada_id").setValue(this.prevMatSelectValue);
          }
        });
      
    }
  }

  public onMatSelectOpen(form: AbstractControl, index, event): void {
    if(event){
      this.prevMatSelectValue = form.value.client_representeds[index].representada_id;
    }
    
  }

  validar(){
    if(this.form.valid){
      this.dialogRef.close(this.form.get('client_representeds').value);
    }else{
      this.form.markAllAsTouched();
    }
    
  }

  close(){
    this.dialogRef.close()
  }

}
