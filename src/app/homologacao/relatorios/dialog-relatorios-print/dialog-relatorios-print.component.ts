import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-relatorios-print',
  templateUrl: './dialog-relatorios-print.component.html',
  styleUrls: ['./dialog-relatorios-print.component.css']
})
export class DialogRelatoriosPrintComponent implements OnInit {
  dataSource: any = [];
  dataSourceRepresentadas: any = [];
  dataSouceVolk: any = [];
  displayedColumns: string[] = ['name','quantidade'];
  volk: any[] = [];
  representadas: any[] = [];
  contato: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 

   
    data.homologacoes.forEach((e: any) =>{
      e.forEach(element => {
        var indexcontato = this.contato.findIndex((x:any)=>x.name == element.contato);
        if(indexcontato == -1){
          this.contato.push(
            {
              name: element.contato,
              quantidade: 1
            });
        }else {
          this.contato[indexcontato].quantidade++;
        }
      });

      e.forEach((products: any) => {
        var index = this.representadas.findIndex((x:any)=>x.name == products.representada);
        if(index == -1){
          this.representadas.push(
            {
              name: products.representada,
              quantidade: 1
            });
        }else {
          this.representadas[index].quantidade++;
        }
        
        if(products.representada == "VOLK"){
          var indexVolk = this.volk.findIndex((x:any)=>x.name == products.tipo_volk);
          if(indexVolk == -1){
            this.volk.push(
              {
                name: products.tipo_volk,
                quantidade: 1
              });
          }else {
            this.volk[indexVolk].quantidade++;
          }
        }
      });
    });

  }
  // <mat-option value="PLUS">PLUS</mat-option>
  //               <mat-option value="STANDARD">STANDARD</mat-option>
  //               <mat-option value="SLIM">SLIM</mat-option>
  ngOnInit() {
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
                  @media print {
                  body .pessoa-color{

                    -webkit-print-color-adjust: exact;}
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

}
