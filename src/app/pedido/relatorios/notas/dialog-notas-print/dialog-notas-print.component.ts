import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExcelExportService } from '../../../../shared/services/excel-export.service';

@Component({
  selector: 'app-dialog-notas-print',
  templateUrl: './dialog-notas-print.component.html',
  styleUrls: ['./dialog-notas-print.component.css']
})
export class DialogNotasPrintComponent implements OnInit {

  displayedColumns: string[] = ['cliente', 'area_venda', 'num_nota', 'num_pedido', 'data_faturamento', 'obs', 'valor_liquido', 'valor_total', 'e-mail']; // 'valor_liquido'
  dataSource: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  public dialogRef: MatDialogRef<DialogNotasPrintComponent>, private excelExport: ExcelExportService) {
    this.dataSource = data;
    this.dataSource.forEach( (notas)=> {
      notas['valor_total'] = 0;
      notas['valor_liquido'] = 0;
      notas.nota_produtos.forEach( produto => {
        let valor = ((produto.qtd * produto.pedido_produto.valor_unitario) - (produto.qtd * produto.pedido_produto.valor_unitario * produto.pedido_produto.desconto)/100);
        let ipi = (valor * produto.pedido_produto.ipi)/100;

        notas['valor_total'] +=  valor + ipi;
        notas['valor_liquido'] = ((produto.qtd * produto.pedido_produto.valor_unitario) - (produto.qtd * produto.pedido_produto.valor_unitario * produto.pedido_produto.desconto)/100 ) + notas['valor_liquido'];
      });
    });
    if(data.form.ordenacao == "valor"){
      if(data.form.tipo == "asc"){
        this.dataSource.sort( (a,b) => a.valor_total - b.valor_total);
      }else{
        this.dataSource.sort( (a,b) => b.valor_total - a.valor_total);
      }
    }
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
    this.dataSource.map((nota) => {
      total = nota.valor_total + total;
    })
    return total;
  }

  somarTotalLiquido() {
    let total = 0;
    this.dataSource.map((nota) => {
      total = nota.valor_liquido + total;
    })
    return total;
  }

  exportar(){
    let export_array = [];

    this.dataSource.forEach( nota => {
      export_array.push({
        cliente: nota.pedido.cliente.nome_fantasia,
        area_venda: nota.pedido.area_venda.nome,
        num_nota: nota.num_nota,
        num_pedido: nota.pedido.num_pedido,
        faturamento: nota.data_faturamento,
        observa????o: nota.obs,
        valor_liquido: nota.valor_liquido,
        valor_nota: nota.valor_total,
        email: nota.pedido.cliente.email
      })
    });
    export_array.push({
      cliente: "Total: ",
      num_nota: null,
      num_pedido: null,
      faturamento: null,
      observa????o: null,
      valor_nota: this.somarTotal(),
      //valor_liquido: this.somarTotalLiquido(),
      email: null
    })
    this.excelExport.exportToExcel(export_array, "Relatorio de Notas")
  }

}