import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MaskPipe } from 'ngx-mask';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-dialog-recebimento-print',
  templateUrl: './dialog-recebimento-print.component.html',
  styleUrls: ['./dialog-recebimento-print.component.css'],
  providers:[
    DatePipe,MaskPipe
  ]
})
export class DialogRecebimentoPrintComponent implements OnInit {

  @ViewChild('table', { static: true }) table: any = Object.create(null);
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public datepipe: DatePipe, public ngxmask:MaskPipe) { 
  }

  ngOnInit(): void {
  }

  somar(tipo: string){
    let total = 0;

    this.data.registros.map( (row) =>{
      if(tipo === 'total'){
        total += row.total;
      }

      if(tipo === 'comissao'){
        total += ( (row.total * row.pedido.comissao_media) / 100);
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

  transformDate(date: any){
    return this.datepipe.transform(date, 'dd-MM-yyyy')
  }

  export_to_excell(){
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    let aoaArray: any[] = [
      [ 'Data Inicio', this.data.form.dtInicio.format('DD-MM-yyyy') , 'Data Final', this.data.form.dtFinal.format('DD-MM-yyyy'), 'por Data de', this.data.form.tipo === 'data_faturamento' ? 'Faturamento' : this.data.form.tipo === 'data_recebimento' ? 'Recebimento' : 'Vencimento' ],
      [ 'Representada', this.data.form.representada_id != null ? this.data.representada.nome_fantasia : null],
      [ 'Área de Venda', this.data.form.area_venda_id != null ? this.data.area.nome : null],
      [ 'Cliente', this.data.form.cliente_id != null ? this.data.cliente.razao_social : null],
      [ 'Situação', this.data.form.filtro, 'Ordenação', this.data.form.ordenacao == 'num_nota' ? 'Nota' : this.data.form.ordenacao == 'Pedidos.num_pedido' ? 'Pedido' : this.data.form.ordenacao == 'data_faturamento' ? 'Data' : 'Cliente', this.data.form.ordenacao_tipo == 'asc' ? 'Crescente' : 'Descrecente'],
      [ null],
      ['Representada', 'Cliente', "Núm. Nota", 'Núm. Pedido', 'Data', 'Valor Total', 'Comissão', 'Comissão %'],
    ];

    this.data.registros.forEach((row:any) => {
        let new_conta = [
          row.pedido.representada.nome_fantasia,
          row.pedido.cliente.razao_social,
          row.num_nota,
          row.pedido.num_pedido,
          this.transformDate(row.data_faturamento),
          row.total,
          ((row.total * row.pedido.comissao_media) / 100),
          row.pedido.comissao_media + ' %'
        ];

        aoaArray.push(new_conta);

        //* Parcelas
        row.nota_parcelas.forEach((parcela:any) => {
          let new_parcela = [
            null,
            null,
            null,
            parcela.parcela,
            this.transformDate(parcela.data_vencimento),
            parcela.valor,
            ( (parcela.valor * row.pedido.comissao_media )  / 100),
            null
          ];

          aoaArray.push(new_parcela);
        });
        
    });

    let worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(
      aoaArray
    );

    XLSX.utils.book_append_sheet(wb, worksheet, 'planilha');
    
    /* save to file */
    XLSX.writeFile(wb,'Relatorio de Recebimento.xlsx');
  }

}
