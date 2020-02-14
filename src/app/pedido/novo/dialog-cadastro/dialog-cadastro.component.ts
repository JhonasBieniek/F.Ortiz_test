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
        codigo: element.codigo,
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

  areaVendasSubmit() : Promise<any> { 
    return new Promise((resolve, reject) => {
    this.form.value.camposForm.forEach(element => {
      let dados = {
        nome : element.nome,
        embalagem: element.embalagem,
        certificado_aprovacao: "",
        representada_id: element.representada_id,
        tamanho: element.tamanho,
        codigo: element.codigo,
        ipi: element.ipi,
        unidade_id: element.unidade,
        status:element.active,
      }
    this.send(
            dados, 
            element.valorUnitario, 
            element.quantidade, 
            element.desconto, 
            element.comissao,
            element.tamanho);
    })
  })
}
  send(dados, valorUnitario, quantidade, desconto, comissao, tamanho){
    console.log(quantidade, "dados do send");
    this.clientservice.addProdutos(dados).subscribe((res:any) => {
      if(res.success == true){
        res.data.valorUnitario = valorUnitario
        res.data.quantidade = quantidade
        res.data.desconto = desconto
        res.data.comissao = comissao
        res.data.tamanho = tamanho
        this.resposta.push(res.data);
        this.notificationService.notify(`Produto cadastrado com Sucesso!`)
        setTimeout(()=>{ this.close(), 1000});
      }else{
        this.notificationService.notify(`Erro contate o Administrador`)
      }}
    );
  }

  close() {
    console.log(this.resposta, "resposta")
    this.dialogRef.close(this.resposta);
  }
  

}
