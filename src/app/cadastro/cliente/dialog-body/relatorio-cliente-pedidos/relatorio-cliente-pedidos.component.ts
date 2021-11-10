import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-relatorio-cliente-pedidos',
  templateUrl: './relatorio-cliente-pedidos.component.html',
  styleUrls: ['./relatorio-cliente-pedidos.component.css']
})
export class RelatorioClientePedidosComponent implements OnInit {

  displayedColumns: string[] = ['num_pedido', 'data_emissao', 'codigo_catalogo', 'nome', 'valor'];
  dataSource = [];
  
  pedidoProdutos: any[] = [];
  endereco = 'Não possui endereço';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<RelatorioClientePedidosComponent>) {
    if(data.enderecos_clientes.length > 0){
      this.endereco = data.enderecos_clientes[0].endereco.logradouro + ', '+ data.enderecos_clientes[0].endereco.bairro + ', ' + data.enderecos_clientes[0].endereco.numero + ', ' + 
      data.enderecos_clientes[0].endereco.cidade + ', '+ data.enderecos_clientes[0].endereco.estado.nome;
    }
    
    data.pedidos.forEach(pedido => {
      pedido.pedido_produtos.forEach(produto => {
        this.pedidoProdutos.push({
          num_pedido: pedido.num_pedido,
          data_emissao: pedido.data_emissao,
          codigo_catalogo: produto.produto.codigo_catalogo,
          nome: produto.produto.nome,
          valor: produto.valor_unitario,
        })
      });
    });

    this.dataSource = this.pedidoProdutos;

  }

  ngOnInit(): void {
  }

  private getTagsHtml(tagName: keyof HTMLElementTagNameMap): string {
    const htmlStr: string[] = [];
    const elements = document.getElementsByTagName(tagName);
    for (let idx = 0; idx < elements.length; idx++) {
      htmlStr.push(elements[idx].outerHTML);
    }

    return htmlStr.join('\r\n');
  }

  close() {
    this.dialogRef.close();
  }

  printWindowCurrent() {

    const printContent = document.getElementById("impressao");
    const stylesHtml = this.getTagsHtml('style');
    const linksHtml = this.getTagsHtml('link');
    const WindowPrt = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

    if (WindowPrt != null) {
      if (printContent != null) {
        WindowPrt.document.open();
        WindowPrt.document.write(`
            <html>
                <head>
                  <style>
                    @media print {
                      body .mat-row:nth-child(even){
                          -webkit-print-color-adjust: exact;
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

}
