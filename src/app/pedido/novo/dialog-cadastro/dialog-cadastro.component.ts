import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { CustomValidators } from 'ng2-validation';
import { NotificationService } from '../../../shared/messages/notification.service';
import { OrderService } from '../../../shared/services/order.service.component';

@Component({
  selector: 'app-dialog-cadastro',
  templateUrl: './dialog-cadastro.component.html',
  styleUrls: ['./dialog-cadastro.component.css']
})
export class DialogCadastroComponent implements OnInit {

  public form: FormGroup;
  dados:any= "";
  unidades =[]
  selectedUnidade: string;
  resposta: any =[];
  prods = [];
  aux:any = [];

  constructor(public dialogRef: MatDialogRef<DialogCadastroComponent>, 
                                @Inject(MAT_DIALOG_DATA) public data: any,
                                private fb: FormBuilder,
                                private clientservice: ClientService,
                                private notificationService : NotificationService,
                                private orderservice : OrderService

                                )
    {
      this.form = this.fb.group({
        camposForm: this.fb.array([]),
      })
      this.clientservice.getUnidades().subscribe((res:any) =>{
        this.unidades = res.data; 
      });      
      dialogRef.disableClose = true;
  }
                              
  ngOnInit() {
    const campos = this.form.controls.camposForm as FormArray;
    this.data.forEach(element => {
      campos.push(this.fb.group({
        nome: element.nome,
        embalagem: element.embalagem,
        tamanho: element.tamanho,
        codigo: element.codigo_catalogo,
        ipi: element.ipi,
        unidade: '',
        active: 1,
        valorUnitario: element.valorUnitario,
        quantidade: element.quantidade,
        desconto: element.desconto,
        comissao: element.comissao,
        representada_id : element.representada_id
      }));
    });
  }

  submit(){ 
    this.clientservice.addProdutosLote(this.form.value.camposForm).subscribe((res:any)=>{
      this.dialogRef.close(res.data);
    });
  }

  async send(dados): Promise<any> {
      return new Promise((resolve, reject) => {
      this.clientservice.addProdutos(dados).subscribe((res:any) => {
        this.aux.push(1);
        if(res.success == true){
          res.data.valorUnitario = dados.valorUnitario
          res.data.quantidade = dados.quantidade
          res.data.desconto = dados.desconto
          res.data.comissao = dados.comissao
          res.data.tamanho = dados.tamanho
          resolve(this.resposta.push(res.data));
          if( this.form.value.camposForm.length == this.aux.length ){
            this.close();
          }
        }else{
          this.notificationService.notify(`Erro contate o Administrador`)
        }}
      )
    })
  }

  close() {
    // this.dialogRef.close(this.resposta);
    this.dialogRef.close('fechar');
  }
  
}
