import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExcelExportService } from '../../../../shared/services/excel-export.service';

@Component({
  selector: 'app-dialog-ranking-print',
  templateUrl: './dialog-ranking-print.component.html',
  styleUrls: ['./dialog-ranking-print.component.css']
})
export class DialogRankingPrintComponent implements OnInit {

  displayedColumns: string[] = ['ranking', 'cliente', 'cnpj', 'total', 'total_liquido', 'percentual'];
  dataSource: any[] = [];
  total = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  public dialogRef: MatDialogRef<DialogRankingPrintComponent>, private excelExport: ExcelExportService) { 
    this.dataSource = data;

    this.somar();
  }
  ngOnInit(): void {
  }

  somar(){
    this.dataSource.forEach( cliente =>{
      this.total = this.total + cliente.valor_total; 
    });
    this.percent();
  }

  percent(){
    this.dataSource.forEach( cliente =>{
      cliente['percentual'] = ( cliente.valor_total * 100 ) / this.total;
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

  somarTotalLiquido() {
    let total = 0;
    this.data.map((venda) => {
      total = venda.valor_liquido + total;
    })
    return total;
  }

  somarTotalPorcentagem() {
    let total = 0;
    this.data.map((venda) => {
      total = venda.percentual + total;
    })
    return total;
  }

  exportar(){
    let export_array = [];

    this.dataSource.forEach( (cliente, index) => {
      export_array.push({
        colocação: index+1,
        cliente: cliente.cliente.nome_fantasia,
        cnpj: cliente.cliente.cnpj,
        total: cliente.valor_total,
        total_liquido: cliente.valor_liquido,
        porcentagem: cliente.percentual,
      })
    });
    export_array.push({
      colocação: "Total: ",
      cliente: null,
      cnpj: null,
      total: this.somarTotal(),
      total_liquido: this.somarTotalLiquido(),
      porcentagem: this.somarTotalPorcentagem(),
    });
    this.excelExport.exportToExcel(export_array, "Relatorio de Ranking")
  }

}