import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExcelExportService } from '../../../../shared/services/excel-export.service';

@Component({
  selector: 'app-dialog-ranking-print',
  templateUrl: './dialog-ranking-print.component.html',
  styleUrls: ['./dialog-ranking-print.component.css']
})
export class DialogRankingPrintComponent implements OnInit {

  displayedColumns: string[] = ['ranking', 'cliente', 'cnpj', 'total', 'total_liquido' ,'percentual'];  // , 'total_liquido'
  dataSource: any[] = [];
  total = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  public dialogRef: MatDialogRef<DialogRankingPrintComponent>, private excelExport: ExcelExportService) { 
    //this.somar();
    this.agruparClientes();
  }
  ngOnInit(): void {
  }

  agruparClientes(){
    this.data.forEach( pedido => {
      if(pedido.notas.length > 0) {
        let index = this.dataSource.findIndex( cliente => cliente.cnpj === pedido.cliente.cnpj);
        if(this.data.form.status == "todos"){
          if(this.dataSource.length == 0 || index === -1){
            this.dataSource.push({
              cliente: pedido.cliente.nome_fantasia,
              cnpj: pedido.cliente.cnpj,
              valor_total: this.somarNotaBruto(pedido.notas) - (pedido.subst != null ? pedido.subst : 0),
              valor_liquido: this.somarNotaLiquido(pedido.notas),
              porcentagem: 0
            });
          }else{
            this.dataSource[index].valor_total += (this.somarNotaBruto(pedido.notas) - (pedido.subst != null ? pedido.subst : 0));
            this.dataSource[index].valor_liquido += this.somarNotaLiquido(pedido.notas);
          }
        }else{
          if(this.dataSource.length == 0 || index === -1){
            if(pedido.situacao == "faturado" || pedido.situacao == "pendente"){
              this.dataSource.push({
                cliente: pedido.cliente.nome_fantasia,
                cnpj: pedido.cliente.cnpj,
                valor_total: this.somarNotaBruto(pedido.notas) - (pedido.subst != null ? pedido.subst : 0),
                valor_liquido: this.somarNotaLiquido(pedido.notas),
                porcentagem: 0
              });
            }else if(pedido.situacao == "parcial"){
              let totalBruto = this.somarNotaBruto(pedido.notas);
              let totalLiquido = this.somarNotaLiquido(pedido.notas);

              if(this.data.form.status == "faturado"){
                this.dataSource.push({
                  cliente: pedido.cliente.nome_fantasia,
                  cnpj: pedido.cliente.cnpj,
                  valor_total: totalBruto,
                  valor_liquido: totalLiquido,
                  porcentagem: 0
                });
              }else if(this.data.form.status == "pendente"){
                this.dataSource.push({
                  cliente: pedido.cliente.nome_fantasia,
                  cnpj: pedido.cliente.cnpj,
                  valor_total: ( (this.somarNotaBruto(pedido.notas) - (pedido.subst != null ? pedido.subst : 0) ) - totalBruto ),
                  valor_liquido: ( this.somarNotaLiquido(pedido.notas) - totalLiquido ),
                  porcentagem: 0
                });
              }
            }
          }else{
            if(pedido.situacao == "faturado" || pedido.situacao == "pendente"){

              this.dataSource[index].valor_total += (this.somarNotaBruto(pedido.notas) - (pedido.subst != null ? pedido.subst : 0));
              this.dataSource[index].valor_liquido += this.somarNotaLiquido(pedido.notas);

            }else if(pedido.situacao == "parcial"){

              let totalBruto = this.somarNotaBruto(pedido.notas);
              let totalLiquido = this.somarNotaLiquido(pedido.notas);
              if(this.data.form.status == "faturado"){
                this.dataSource[index].valor_total += totalBruto;
                this.dataSource[index].valor_liquido += totalLiquido;
              }else if(this.data.form.status == "pendente"){
                this.dataSource[index].valor_total += ( (this.somarNotaBruto(pedido.notas) - (pedido.subst != null ? pedido.subst : 0) ) - totalBruto );
                this.dataSource[index].valor_liquido += (this.somarNotaLiquido(pedido.notas) - totalLiquido);
              }

            }
          }
        }
      }
    });

    if(this.data.form.ordenacao == "valor"){
      if(this.data.form.tipo == "asc"){
        this.dataSource.sort( (a,b) => a.valor_total - b.valor_total);
      }else{
        this.dataSource.sort( (a,b) => b.valor_total - a.valor_total);
      }
    }else{
      if(this.data.form.tipo == "asc"){
        this.dataSource.sort( (a,b) => (a.color < b.color) ? 1 : -1);
        
      }else{
        this.dataSource.sort( (a,b) => (a.color > b.color) ? 1 : -1);
      }
    }

    this.somar();
  }

  somarNotaLiquido(notas: any[]){

    let total = 0;
    notas.forEach( nota => {
      nota.nota_produtos.forEach( produto => {
        if(produto.qtd > 0){
          total = total + (produto.qtd * produto.pedido_produto.valor_unitario - (produto.qtd * produto.pedido_produto.valor_unitario * produto.pedido_produto.desconto/100));
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
          total += (produto.qtd * produto.pedido_produto.valor_unitario) + ipi - (produto.qtd * produto.pedido_produto.valor_unitario * produto.pedido_produto.desconto/100);
        }
      });
    });
    return total;
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
    this.dataSource.map((venda) => {
      total += venda.valor_total;
    })
    return total;
  }

  somarTotalLiquido() {
    let total = 0;
    this.dataSource.map((venda) => {
      total += venda.valor_liquido;
    })
    return total;
  }

  somarTotalPorcentagem() {
    let total = 0;
    this.dataSource.map((venda) => {
      total += venda.percentual;
    })
    return total;
  }

  exportar(){
    let export_array = [];

    this.dataSource.forEach( (cliente, index) => {
      export_array.push({
        colocação: index+1,
        cliente: cliente.cliente,
        cnpj: cliente.cnpj,
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