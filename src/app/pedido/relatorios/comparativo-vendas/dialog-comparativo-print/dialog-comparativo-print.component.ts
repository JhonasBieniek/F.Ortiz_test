import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExcelExportService } from '../../../../shared/services/excel-export.service';

@Component({
  selector: 'app-dialog-comparativo-print',
  templateUrl: './dialog-comparativo-print.component.html',
  styleUrls: ['./dialog-comparativo-print.component.css']
})
export class DialogComparativoPrintComponent implements OnInit {

  displayedColumns: string[] = ['NAME', 'TOTAL'];
  dataSource: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  public dialogRef: MatDialogRef<DialogComparativoPrintComponent>,  private excelExport: ExcelExportService) { 
    //console.log(data);
    //this.dataSource = data;
    this.gerarComparativo();
  }

  gerarComparativo(){
    this.data.forEach(pedido => {
      let periodo = new Date(pedido.data_emissao+ " 00:00:00");
      let periodoFormatado = (periodo.getMonth() + 1) +"/"+periodo.getFullYear();
      let Index = this.dataSource.findIndex(x => x.name ==  periodoFormatado);
      if(Index == -1){
        this.dataSource.push({
          name: periodoFormatado,
          total: pedido.valor_total
        })
      }else {
        this.dataSource[Index].total = pedido.valor_total + this.dataSource[Index].total
      }
    })
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
    this.dataSource.map((mes) => {
      total = mes.total + total;
    })
    return total;
  }

  exportar(){
    let export_array = [];

    this.dataSource.forEach( mes => {
      export_array.push({
        mes: mes.name,
        total: mes.total,
      });
    });
    export_array.push({
      mes: 'Total: ',
      total: this.somarTotal(),
    })
    this.excelExport.exportToExcel(export_array, "Relatorio de comparativo de vendas")
  }
}
