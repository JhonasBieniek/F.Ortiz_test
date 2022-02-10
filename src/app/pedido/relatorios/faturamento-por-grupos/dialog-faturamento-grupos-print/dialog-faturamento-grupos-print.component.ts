import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExcelExportService } from '../../../../shared/services/excel-export.service';

@Component({
  selector: 'app-dialog-faturamento-grupos-print',
  templateUrl: './dialog-faturamento-grupos-print.component.html',
  styleUrls: ['./dialog-faturamento-grupos-print.component.css']
})
export class DialogFaturamentoGruposPrintComponent implements OnInit {

  displayedColumns: string[] = ['NAME', 'TOTAL'];
  dataSource: any[] = [];
  representadas: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  public dialogRef: MatDialogRef<DialogFaturamentoGruposPrintComponent>,  private excelExport: ExcelExportService) {
    console.log(data);
    this.agruparPedidos();
  }

  agruparPedidos(){
    this.data.registros.forEach( (pedido:any) => {
      //* Verifica se a representada ja foi adicionada;
      let indexRep = this.representadas.findIndex( representada => representada.representada_id === pedido.representada_id);

      if(indexRep === -1){ //* Adiciona a representada
        let representada = {
          representada_id: pedido.representada_id,
          nome_fantasia: pedido.representada.nome_fantasia,
          razao_social: pedido.representada.razao_social,
          total: 0,
          total_faturado: 0,
          total_aberto: 0,
          areas: []
        };
        let area = {
          area_venda_id: pedido.area_venda_id,
          nome: pedido.area_venda.nome,
          total:  pedido.valor_liquido,
          faturado: 0,
          aberto: 0,
        }

        if(pedido.situacao === "faturado"){
          area.faturado = pedido.valor_liquido;
        }else if(pedido.situacao === "pendente"){
          area.aberto = pedido.valor_liquido;
        }else{
          let totalLiquido = this.somarNotaLiquido(pedido.notas);
          area.faturado = totalLiquido;
          area.aberto = (pedido.valor_liquido - totalLiquido);
        }
        representada.total = area.total;
        representada.total_faturado = area.faturado;
        representada.total_aberto = area.aberto;
        representada.areas.push(area);
        this.representadas.push(representada);
      }else{
        let indexArea = this.representadas[indexRep].areas.findIndex( area => area.area_venda_id === pedido.area_venda_id);

        if(indexArea === -1){
          let area = {
            area_venda_id: pedido.area_venda_id,
            nome: pedido.area_venda.nome,
            total:  pedido.valor_liquido,
            faturado: 0,
            aberto: 0,
          }
  
          if(pedido.situacao === "faturado"){
            area.faturado = pedido.valor_liquido;
          }else if(pedido.situacao === "pendente"){
            area.aberto = pedido.valor_liquido;
          }else{
            let totalLiquido = this.somarNotaLiquido(pedido.notas);
            area.faturado = totalLiquido;
            area.aberto = (pedido.valor_liquido - totalLiquido);
          }
          this.representadas[indexRep].total += area.total;
          this.representadas[indexRep].total_faturado += area.faturado;
          this.representadas[indexRep].total_aberto += area.aberto;
          this.representadas[indexRep].areas.push(area);
        }else{

          this.representadas[indexRep].areas[indexArea].total += pedido.valor_liquido;
          this.representadas[indexRep].total += pedido.valor_liquido;
          
          if(pedido.situacao === "faturado"){
            this.representadas[indexRep].areas[indexArea].faturado += pedido.valor_liquido;
            this.representadas[indexRep].total_faturado += pedido.valor_liquido;
          }else if(pedido.situacao === "pendente"){
            this.representadas[indexRep].areas[indexArea].aberto += pedido.valor_liquido;
            this.representadas[indexRep].total_aberto += pedido.valor_liquido;
          }else{
            let totalLiquido = this.somarNotaLiquido(pedido.notas);
            this.representadas[indexRep].areas[indexArea].faturado += totalLiquido;
            this.representadas[indexRep].areas[indexArea].aberto += (pedido.valor_liquido - totalLiquido);

            this.representadas[indexRep].total_faturado += totalLiquido;
            this.representadas[indexRep].total_aberto += (pedido.valor_liquido - totalLiquido);
          }
        }
      }
    });

    console.log(this.representadas);
  }
  
  somarNotaLiquido(notas: any[]){
    let total = 0;
    notas.forEach( nota => {
      nota.nota_produtos.forEach( produto => {
        if(produto.qtd > 0){
          total = total + (produto.qtd * produto.pedido_produto.valor_unitario);
        }
      });
    });
    return total;
  }

  somarNotaBruto(notas: any[]){
    let total = 0;
    notas.forEach( nota => {
      nota.nota_produtos.forEach( produto => {
        if(produto.qtd > 0){
          let ipi = 0;
          if(produto.pedido_produto.ipi){
            ipi = (produto.qtd * produto.pedido_produto.valor_unitario * produto.pedido_produto.ipi) / 100;
          }
          total += (produto.qtd * produto.pedido_produto.valor_unitario) + ipi;
        }
      });
    });
    return total;
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

  // somarTotal() {
  //   let total = 0;
  //   this.dataSource.map((mes) => {
  //     total = mes.total + total;
  //   })
  //   return total;
  // }

  // exportar(){
  //   let export_array = [];

  //   this.dataSource.forEach( mes => {
  //     export_array.push({
  //       mes: mes.name,
  //       total: mes.total,
  //     });
  //   });
  //   export_array.push({
  //     mes: 'Total: ',
  //     total: this.somarTotal(),
  //   })
  //   this.excelExport.exportToExcel(export_array, "Relatorio de comparativo de vendas")
  // }
}
