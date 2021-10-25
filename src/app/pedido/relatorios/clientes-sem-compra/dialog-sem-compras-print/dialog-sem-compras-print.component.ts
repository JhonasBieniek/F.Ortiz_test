import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-sem-compras-print',
  templateUrl: './dialog-sem-compras-print.component.html',
  styleUrls: ['./dialog-sem-compras-print.component.css']
})
export class DialogSemComprasPrintComponent implements OnInit {

  displayedColumns: string[] = ['nome', 'cnpj', 'contato', 'telefone', 'celular', 'data', 'valor'];
  dataSource: any[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  public dialogRef: MatDialogRef<DialogSemComprasPrintComponent>) { 
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

}
