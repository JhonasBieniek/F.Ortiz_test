import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExcelExportService } from '../../../../shared/services/excel-export.service';

@Component({
  selector: 'app-dialog-pedidos-print',
  templateUrl: './dialog-pedidos-print.component.html',
  styleUrls: ['./dialog-pedidos-print.component.css']
})
export class DialogPedidosPrintComponent implements OnInit {

  displayedColumns: string[] = ['CLIENTE', 'CNPJ', 'NUMERO', 'REPRESENTADA', 'DT PEDIDO', 'DT ENTREGA', `VALOR`];
  dataSource = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogPedidosPrintComponent>,
  private excelExport: ExcelExportService) {
    this.dataSource = data;
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

  somarTotal() {
    let total = 0;
    this.data.map((venda) => {
      total = venda.valor_total + total;
    })
    return total;
  }

  exportar(){
    let export_array = [];

    this.dataSource.forEach( pedido => {
      export_array.push({
        cliente: pedido.cliente.nome_fantasia,
        cnpj: pedido.cliente.cnpj,
        numero: pedido.num_pedido,
        representada: pedido.representada.nome_fantasia,
        emissao: pedido.data_emissao,
        entrega: pedido.data_entrega,
        valor: pedido.valor_total
      })
    });
    export_array.push({
      cliente: "Total: ",
      cnpj: null,
      numero: null,
      emissao: null,
      entrega: null,
      valor: this.somarTotal()
    });
    this.excelExport.exportToExcel(export_array, "Relatorio de Pedidos")
  }

}
