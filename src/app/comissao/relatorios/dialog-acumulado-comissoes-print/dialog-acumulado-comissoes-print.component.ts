import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExcelExportService } from '../../../shared/services/excel-export.service';

@Component({
  selector: 'app-dialog-acumulado-comissoes-print',
  templateUrl: './dialog-acumulado-comissoes-print.component.html',
  styleUrls: ['./dialog-acumulado-comissoes-print.component.css']
})
export class DialogAcumuladoComissoesPrintComponent implements OnInit {

  displayedColumns: string[] = ['area', 'notas_valor', 'valor_devolucoes', 'comissao_recebida' ,'percentual_recebido', 'comissao_paga', 'percentual_pago'];  // , 'total_liquido'
  dataSource: any[] = [];
  total = {
    nota: 0,
    devolucao: 0,
    comissao_recebida: 0,
    percentual_recebido: 0,
    comissao_paga: 0,
    percentual_pago: 0,
  };
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  public dialogRef: MatDialogRef<DialogAcumuladoComissoesPrintComponent>, private excelExport: ExcelExportService) { 
    //this.somar();
    this.calcular();
    console.log(data)
  }
  ngOnInit(): void {
  }

  calcular(){
    this.data.registros.forEach( value => {
      let area = {
        area: value.area_venda.nome,
        notas_valor: value.valor,
        valor_devolucoes: value.devolucao,
        comissao_recebida: value.comissao_recebido,
        percentual_recebido: (value.comissao_recebido*100)/(value.valor),
        comissao_paga: value.comissao_paga,
        percentual_pago: (value.comissao_paga*100 )/value.valor
      };
      this.dataSource.push(area);
    });

    this.somar();
  }

  somar(){
    this.dataSource.forEach( area => {
      this.total.nota += area.notas_valor;
      this.total.devolucao += area.valor_devolucoes;
      this.total.comissao_recebida += area.comissao_recebida;
      this.total.comissao_paga += area.comissao_paga;
    });
    this.percent();
  }

  percent(){
    this.total.percentual_recebido = (this.total.comissao_recebida * 100)/(this.total.nota);
    this.total.percentual_pago = (this.total.comissao_paga * 100)/(this.total.nota);
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

  exportar(){
    let export_array = [...this.dataSource];

    export_array.push({
      area: "Total: ",
      notas_valor: this.total.nota,
      valor_devolucoes: this.total.devolucao,
      comissao_recebida: this.total.comissao_recebida,
      percentual_recebido: this.total.percentual_recebido,
      comissao_paga: this.total.comissao_paga,
      percentual_pago: this.total.percentual_pago
    });
    this.excelExport.exportToExcel(export_array, "Relatório Acumulado de Comissões")
  }
}
