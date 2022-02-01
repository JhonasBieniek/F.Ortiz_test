import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExcelExportService } from '../../../../shared/services/excel-export.service';

@Component({
  selector: 'app-dialog-consumo-print',
  templateUrl: './dialog-consumo-print.component.html',
  styleUrls: ['./dialog-consumo-print.component.css']
})
export class DialogConsumoPrintComponent implements OnInit {

  displayedColumns: string[] = ['Nome', 'Código', 'Embalagem'];
  dataSource: any[] = [];
  meses: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  public dialogRef: MatDialogRef<DialogConsumoPrintComponent>, private excelExport: ExcelExportService) { 
    //this.dataSource = data;
    this.gerarComparativo();
  }

  gerarComparativo(){
    let start = new Date(this.data.form.dtInicio);
    let end = new Date(this.data.form.dtFinal);
    //let meses: any[] = [];
    let periodoInicial = '';
    let periodoFinal = (end.getMonth() + 1) +"/"+end.getFullYear();
    while(periodoInicial != periodoFinal){
      periodoInicial = (start.getMonth() + 1) +"/"+start.getFullYear();
      this.meses.push({
        mes: periodoInicial,
        quantidade: 0
      });
      this.displayedColumns.push(periodoInicial)
      start.setMonth(start.getMonth()+1);
    }
    
    this.displayedColumns.push('Total')

    this.data.forEach(pedido => {
      let periodo = new Date(pedido.data_emissao+ " 00:00:00");
      let periodoFormatado = (periodo.getMonth() + 1) +"/"+periodo.getFullYear();
      let IndexMes = this.meses.findIndex(x => x.mes == periodoFormatado);

      pedido.pedido_produtos.forEach(produto => {
        if(this.data.form.produto_id != null){
          if(produto.produto_id == this.data.form.produto_id){
            let IndexProduto = this.dataSource.findIndex(x => x.Nome ==  produto.produto.nome);
            if(IndexProduto == -1){
              let mesSoma: any = this.meses.map( (e:any) => { return Object.assign( {}, e)});
              mesSoma[IndexMes].quantidade = produto.quantidade;

              let addProduto = {
                Nome:  produto.produto.nome,
                Código: produto.produto.codigo_catalogo,
                Embalagem: produto.embalagem,
                Total: produto.quantidade
              };
              mesSoma.forEach(mes => {
                addProduto[mes.mes] = mes.quantidade;
              });
              
              this.dataSource.push(addProduto)
              
            }else{
              let mes = this.meses[IndexMes].mes;
              this.dataSource[IndexProduto][mes] = this.dataSource[IndexProduto][mes] +  produto.quantidade;
              this.dataSource[IndexProduto].Total = this.dataSource[IndexProduto].Total + produto.quantidade;
            }
          }
        }else{
          let IndexProduto = this.dataSource.findIndex(x => x.Nome ==  produto.produto.nome);
          if(IndexProduto == -1){
            let mesSoma: any = this.meses.map( (e:any) => { return Object.assign( {}, e)});
            mesSoma[IndexMes].quantidade = produto.quantidade;

            let addProduto = {
              Nome:  produto.produto.nome,
              Embalagem: produto.embalagem,
              Código: produto.produto.codigo_catalogo,
              Total: produto.quantidade
            };
            mesSoma.forEach(mes => {
              addProduto[mes.mes] = mes.quantidade;
            });
            
            this.dataSource.push(addProduto)
            
          }else{
            let mes = this.meses[IndexMes].mes;
            this.dataSource[IndexProduto][mes] = this.dataSource[IndexProduto][mes] +  produto.quantidade;
            this.dataSource[IndexProduto].Total = this.dataSource[IndexProduto].Total + produto.quantidade;
          }
        }
      });
    });
    
    for (let index = 0; index < this.dataSource.length; index++) {
      this.dataSource[index]['Média'] = Math.round(this.dataSource[index].Total / this.meses.length);  
    }
    
    this.displayedColumns.push('Média')
  }

  getTotal(meses){
    let total;
    meses.forEach(mes => {
      total = total + mes.quantidade;
    });
    return total/meses.length;
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

  somarColuna(coluna: string){
    if(coluna != "Média"){
      let total = 0;
      this.dataSource.map((produto) => {
        total = produto[coluna] + total;
      })
      return total;
    }else{
      return '';
    }
  }

  exportar(){
    let export_array = [];
    this.dataSource.forEach( consumo => {
      let meses = {
      }
      this.meses.forEach( (mes) => {
        meses[mes.mes] = consumo[mes.mes]
      })

      export_array.push({
        Nome: consumo.Nome,
        Código: consumo.Código,
        Embalagem: consumo.Embalagem,
        ...meses,
        Total: consumo.Total,
        Média: consumo.Média
      });
    });
    this.excelExport.exportToExcel(export_array, "Relatorio de consumo")
  }

}
