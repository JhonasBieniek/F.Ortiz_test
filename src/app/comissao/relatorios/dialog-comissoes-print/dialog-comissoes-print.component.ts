import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import * as XLSX from "xlsx";
import { MaskPipe } from 'ngx-mask';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-comissoes-print',
  templateUrl: './dialog-comissoes-print.component.html',
  styleUrls: ['./dialog-comissoes-print.component.css'],
  providers:[
    DatePipe,MaskPipe
  ]
})
export class DialogComissoesPrintComponent implements OnInit {

  @ViewChild('table', { static: true }) table: any = Object.create(null);
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public datepipe: DatePipe, public ngxmask:MaskPipe) { 
  }

  ngOnInit(): void {
  }

  somar(tipo: string){
    let total = 0;

    this.data.registros.map( (row) =>{
      if(tipo === 'notas'){
        total += row.valor;
      }

      if(tipo === 'devolucao'){
        total += row.devolucao;
      }

      if(tipo === 'comissao'){
        total += row.comissao;
      }
    });

    return total;
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

  printWindowCurrent() {
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
                  body {
                    color: unset !important;
                    font-weight: unset !important;
                    background: unset !important;
                  }

                  body .table-striped {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
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

  export_to_excell(){
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    let aoaArray: any[] = [
      [ 'Data Inicio', this.data.form.dtInicio.format('DD-MM-yyyy') , 'Data Final', this.data.form.dtFinal.format('DD-MM-yyyy')],
      [ 'Representada', this.data.form.representada_id != null ? this.data.representada.nome_fantasia : null],
      [ 'Área de Venda', this.data.form.area_venda_id != null ? this.data.area.nome : null],
      [ 'Funcionario', this.data.form.funcionario_id != null ? this.data.funcionario.nome : null],
      [ null],
      ['Área de Venda', 'Valor Notas', "Devoluções", 'Comissão'],
    ];

    this.data.registros.forEach((row:any) => {
        let new_conta = [
          row.area_venda.nome,
          row.valor,
          row.devolucao,
          row.comissao,
        ];

        aoaArray.push(new_conta);
    });

    let worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(
      aoaArray
    );

    XLSX.utils.book_append_sheet(wb, worksheet, 'planilha');
    
    /* save to file */
    XLSX.writeFile(wb,'Relatorio de Comissoes.xlsx');
  }

}
