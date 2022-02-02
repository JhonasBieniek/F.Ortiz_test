import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExcelExportService } from '../../../../shared/services/excel-export.service';

@Component({
  selector: 'app-dialog-novos-clientes-print',
  templateUrl: './dialog-novos-clientes-print.component.html',
  styleUrls: ['./dialog-novos-clientes-print.component.css']
})
export class DialogNovosClientesPrintComponent implements OnInit {

  displayedColumns: string[] = ['nome', 'cnpj', 'contato', 'telefone', 'celular', 'criacao', 'data', 'valor', 'condicao'];
  dataSource: any[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  public dialogRef: MatDialogRef<DialogNovosClientesPrintComponent>, private excelExport: ExcelExportService) { 
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

  exportar(){
    let export_array = [];

    this.dataSource.forEach( cliente => {
      export_array.push({
        nome: cliente.nome_fantasia,
        cnpj: cliente.cnpj,
        contato: cliente.representante,
        telefone_fixo: cliente.telefone,
        telefone_celular: cliente.celular,
        dt_cadastro: cliente.created,
        ultima_compra: cliente.pedido ? cliente.pedido.data_emisao : null,
        valor: cliente.pedido ? cliente.pedido.valor_total : null,
        condicao: cliente.pedido ? cliente.pedido.condicao_comercial.nome : null
      })
    });

    export_array.push({
      nome: "Total :",
      cnpj: null,
      contato: null,
      telefone_fixo: null,
      telefone_celular: null,
      dt_cadastro: null,
      ultima_compra: null,
      valor: this.somarTotal(),
      condicao: null
    });
    this.excelExport.exportToExcel(export_array, "Relatorio de novos clientes")
  }

  somarTotal() {
    let total = 0;
    this.dataSource.map((cliente) => {
      if(cliente.pedido){
        total = cliente.pedido.valor_total + total;
      }
    })
    return total;
  }

}
