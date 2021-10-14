import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ClientService } from '../../../../shared/services/client.service.component';
import { CustomValidators } from 'ng2-validation';
import { NotificationService } from '../../../../shared/messages/notification.service';
import { OrderService } from '../../../../shared/services/order.service.component';

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
      //console.log(data)
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

  private getTagsHtml(tagName: keyof HTMLElementTagNameMap): string
  {
      const htmlStr: string[] = [];
      const elements = document.getElementsByTagName(tagName);
      for (let idx = 0; idx < elements.length; idx++)
      {
          htmlStr.push(elements[idx].outerHTML);
      }

      return htmlStr.join('\r\n');
  }

  imprimir() {

    const printContent = document.getElementById("imprimir");
    const stylesHtml = this.getTagsHtml('style');
    const linksHtml = this.getTagsHtml('link');
    const WindowPrt = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

    if(WindowPrt != null){
      if(printContent != null){
        WindowPrt.document.open();
        WindowPrt.document.write(`
            <html>
                <head>
                <style>
                  @media print {
                  body .pessoa-color{

                    -webkit-print-color-adjust: exact;}
                  }
                }
                </style>
                    <title>Tela de Impressao</title>
                    ${linksHtml}
                    ${stylesHtml}
                    <script type="text/javascript">
                      function myFunction(){
                        window.print();
                        window.onafterprint = function(){ window.close()};
                        setTimeout(function () { window.close(); }, 600);
                      }
                    </script>
                </head>
                <body onload="myFunction()">
                    ${printContent.innerHTML}
                </body>
            </html>
            `
        );
        WindowPrt.document.close();
      }
    }
  }

  close() {
    // this.dialogRef.close(this.resposta);
    this.dialogRef.close('fechar');
  }
  
}
