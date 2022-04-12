import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExcelExportService } from '../../../../shared/services/excel-export.service';

@Component({
  selector: 'dialog-produtos-vendidos-client-print',
  templateUrl: './dialog-produtos-vendidos-client-print.component.html',
  styleUrls: ['./dialog-produtos-vendidos-client-print.component.css']
})
export class DialogProdutosVendidosClientComponent implements OnInit {

  displayedColumns: string[] = ['Cliente', 'Cnpj', 'Número Pedido', 'Data Emissão', 'Qtd'];
  dataSource: any[] = [];
  meses: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogProdutosVendidosClientComponent>, private excelExport: ExcelExportService) {
    //this.dataSource = data;
    this.gerarRel();
  }

  gerarRel() {
    this.data.forEach((pedido, index) => {
      this.dataSource.push({
        Cliente: pedido.cliente.razao_social,
        Cnpj: pedido.cliente.cnpj,
        'Número Pedido': pedido.num_pedido,
        'Data Emissão': pedido.data_emissao,
      });
      pedido.pedido_produtos.forEach(produto => {
        if (this.data.form.produto_id == produto.produto_id) {
          this.dataSource[index].Qtd = produto.quantidade;
        }
      });
    });
    console.log(this.dataSource);
  }

  ngOnInit(): void {
  }

  total(){
    let total:number =0;
    this.dataSource.map((produto) => {
        total += produto.Qtd;
      })
      return total;
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
                    @page { size: landscape; }
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

  exportar() {
    let export_array = [];
    this.dataSource.forEach(produto => {
      export_array.push({
        Cliente: produto.Cliente,
        Cnpj: produto.Cnpj,
        'Número Pedido': produto['Número Pedido'],
        'Data Emissão': produto['Data Emissão'],
        Qtd: produto.Qtd
      });
    });
    this.excelExport.exportToExcel(export_array, "Relatorio de produto comprado por cliente")
  }

}
