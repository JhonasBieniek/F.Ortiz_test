import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExcelExportService } from '../../../../shared/services/excel-export.service';

@Component({
  selector: 'app-dialog-produtos-vendidos-print',
  templateUrl: './dialog-produtos-vendidos-print.component.html',
  styleUrls: ['./dialog-produtos-vendidos-print.component.css']
})
export class DialogProdutosVendidosPrintComponent implements OnInit {

  displayedColumns: string[] = ['codigo', 'nome', 'tamanho', 'quantidade', 'valor_total'];
  dataSource: any[] = [];
  total = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  public dialogRef: MatDialogRef<DialogProdutosVendidosPrintComponent>,
  private excelExport: ExcelExportService) { 
    this.dataSource = data;

  }
  ngOnInit(): void {
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

  close(){
    this.dialogRef.close();
  }

  printWindowCurrent() {

    const printContent = document.getElementById("impressao");
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

  somarTotalProdutos() {
    let total = 0;
    this.data.map((venda) => {
      total = venda.quantidade + total;
    })
    return total;
  }

  exportar(){
    let export_array = [];

    this.dataSource.forEach( produto => {
      export_array.push({
        codigo: produto.codigo,
        nome: produto.nome,
        tamanho: produto.tamanho,
        quantidade: produto.quantidade,
        total_vendido: produto.valor_total
      })
    });
    export_array.push({
      codigo: "Total: ",
      nome: null,
      tamanho: null,
      quantidade: this.somarTotalProdutos(),
      total_vendido: this.somarTotal()
    });
    this.excelExport.exportToExcel(export_array, "Relatorio de Produtos Vendidos")
  }
}