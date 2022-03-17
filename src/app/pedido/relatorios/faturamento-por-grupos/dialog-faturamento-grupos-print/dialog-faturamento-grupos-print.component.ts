import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExcelExportService } from '../../../../shared/services/excel-export.service';

@Component({
  selector: 'app-dialog-faturamento-grupos-print',
  templateUrl: './dialog-faturamento-grupos-print.component.html',
  styleUrls: ['./dialog-faturamento-grupos-print.component.css']
})
export class DialogFaturamentoGruposPrintComponent implements OnInit {

  representadas: any[] = [];
  total = {
    total_pedidos: 0,
    total_faturado: 0,
    total_aberto: 0,
    total_pedidos_bruto: 0,
    total_faturado_bruto: 0,
    total_aberto_bruto: 0,
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogFaturamentoGruposPrintComponent>, private excelExport: ExcelExportService) {
    //console.log(data);
    this.agruparPedidos();
  }

  agruparPedidos() {
    this.data.registros.forEach((pedido: any) => {
      if (pedido.notas.length > 0) {
        //* Verifica se a representada ja foi adicionada;
        let indexRep = this.representadas.findIndex(representada => representada.representada_id === pedido.representada_id);

        if (indexRep === -1) { //* Adiciona a representada o grupo e a area
          let representada = {
            representada_id: pedido.representada_id,
            nome_fantasia: pedido.representada.nome_fantasia,
            razao_social: pedido.representada.razao_social,
            total: 0,
            total_faturado: 0,
            total_aberto: 0,
            total_bruto: 0,
            total_faturado_bruto: 0,
            total_aberto_bruto: 0,
            grupos: [],
            //areas: []
          };

          let grupo = {
            grupo_id: pedido.area_venda.area_venda_grupo_area_vendas.length === 0 ? null : pedido.area_venda.area_venda_grupo_area_vendas[0].area_venda_grupo_id,
            grupo_name: pedido.area_venda.area_venda_grupo_area_vendas.length === 0 ? 'SEM GRUPO' : pedido.area_venda.area_venda_grupo_area_vendas[0].area_venda_grupo.name,
            areas: [],
            total: 0,
            total_faturado: 0,
            total_aberto: 0,
            total_bruto: 0,
            total_faturado_bruto: 0,
            total_aberto_bruto: 0,
          };
          let area = {
            area_venda_id: pedido.area_venda_id,
            nome: pedido.area_venda.nome,
            total: pedido.valor_liquido,
            faturado: 0,
            aberto: 0,
            total_bruto: pedido.valor_total,
            faturado_bruto: 0,
            aberto_bruto: 0,
          }

          if (pedido.situacao === "faturado") {
            area.faturado = pedido.valor_liquido;
            area.faturado_bruto = pedido.valor_total;
          } else if (pedido.situacao === "pendente") {
            area.aberto = pedido.valor_liquido;
            area.aberto_bruto = pedido.valor_total;
          } else {
            let totalLiquido = this.somarNotaLiquido(pedido.notas);
            let totalBruto = this.somarNotaBruto(pedido.notas);

            area.faturado = totalLiquido;
            area.aberto = (pedido.valor_liquido - totalLiquido);

            area.faturado_bruto = totalBruto;
            area.aberto_bruto = (pedido.valor_total - totalBruto);
          }
          //total liquido
          grupo.total = area.total;
          grupo.total_faturado = area.faturado;
          grupo.total_aberto = area.aberto;

          representada.total = area.total;
          representada.total_faturado = area.faturado;
          representada.total_aberto = area.aberto;

          //total bruto
          representada.total_bruto = area.total_bruto;
          representada.total_faturado_bruto = area.faturado_bruto;
          representada.total_aberto_bruto = area.aberto_bruto;

          grupo.total_bruto = area.total_bruto;
          grupo.total_faturado_bruto = area.faturado_bruto;
          grupo.total_aberto_bruto = area.aberto_bruto;

          grupo.areas.push(area);
          representada.grupos.push(grupo);
          this.representadas.push(representada);

        } else {

          let grupo_id = pedido.area_venda.area_venda_grupo_area_vendas.length === 0 ? null : pedido.area_venda.area_venda_grupo_area_vendas[0].area_venda_grupo_id
          let grupoIndex = this.representadas[indexRep].grupos.findIndex(grupo => grupo.grupo_id === grupo_id);

          if (grupoIndex === -1) { //* adicina o grupo e a area alem das somatorias
            let grupo = {
              grupo_id: pedido.area_venda.area_venda_grupo_area_vendas.length === 0 ? null : pedido.area_venda.area_venda_grupo_area_vendas[0].area_venda_grupo_id,
              grupo_name: pedido.area_venda.area_venda_grupo_area_vendas.length === 0 ? 'SEM GRUPO' : pedido.area_venda.area_venda_grupo_area_vendas[0].area_venda_grupo.name,
              areas: [],
              total: 0,
              total_faturado: 0,
              total_aberto: 0,
              total_bruto: 0,
              total_faturado_bruto: 0,
              total_aberto_bruto: 0,
            };

            let area = {
              area_venda_id: pedido.area_venda_id,
              nome: pedido.area_venda.nome,
              total: pedido.valor_liquido,
              faturado: 0,
              aberto: 0,
              total_bruto: pedido.valor_total,
              faturado_bruto: 0,
              aberto_bruto: 0,
            }

            if (pedido.situacao === "faturado") {
              area.faturado = pedido.valor_liquido;
              area.faturado_bruto = pedido.valor_total;
            } else if (pedido.situacao === "pendente") {
              area.aberto = pedido.valor_liquido;
              area.aberto_bruto = pedido.valor_total;
            } else {
              let totalLiquido = this.somarNotaLiquido(pedido.notas);
              let totalBruto = this.somarNotaBruto(pedido.notas);

              area.faturado = totalLiquido;
              area.aberto = (pedido.valor_liquido - totalLiquido);

              area.faturado_bruto = totalBruto;
              area.aberto_bruto = (pedido.valor_total - totalBruto);
            }
            //total liquido
            grupo.total = area.total;
            grupo.total_faturado = area.faturado;
            grupo.total_aberto = area.aberto;

            this.representadas[indexRep].total += area.total;
            this.representadas[indexRep].total_faturado += area.faturado;
            this.representadas[indexRep].total_aberto += area.aberto;

            //total bruto
            grupo.total_bruto = area.total_bruto;
            grupo.total_faturado_bruto = area.faturado_bruto;
            grupo.total_aberto_bruto = area.aberto_bruto;

            this.representadas[indexRep].total_bruto += area.total_bruto;
            this.representadas[indexRep].total_faturado_bruto += area.faturado_bruto;
            this.representadas[indexRep].total_aberto_bruto += area.aberto_bruto;


            grupo.areas.push(area);
            this.representadas[indexRep].grupos.push(grupo);

          } else { //* verifica a area e as somatorias ja tem representada e grupo
            let indexArea = this.representadas[indexRep].grupos[grupoIndex].areas.findIndex(area => area.area_venda_id === pedido.area_venda_id);

            if (indexArea === -1) { //*  nao tem area adiciona a area e a somatoria
              let area = {
                area_venda_id: pedido.area_venda_id,
                nome: pedido.area_venda.nome,
                total: pedido.valor_liquido,
                faturado: 0,
                aberto: 0,
                total_bruto: pedido.valor_total,
                faturado_bruto: 0,
                aberto_bruto: 0,
              }

              if (pedido.situacao === "faturado") {
                area.faturado = pedido.valor_liquido;
                area.faturado_bruto = pedido.valor_total;
              } else if (pedido.situacao === "pendente") {
                area.aberto = pedido.valor_liquido;
                area.aberto_bruto = pedido.valor_total;
              } else {
                let totalLiquido = this.somarNotaLiquido(pedido.notas);
                let totalBruto = this.somarNotaBruto(pedido.notas);

                area.faturado = totalLiquido;
                area.aberto = (pedido.valor_liquido - totalLiquido);

                area.faturado_bruto = totalBruto;
                area.aberto_bruto = (pedido.valor_total - totalBruto);
              }
              //total liquido
              this.representadas[indexRep].grupos[grupoIndex].total += area.total;
              this.representadas[indexRep].grupos[grupoIndex].total_faturado += area.faturado;
              this.representadas[indexRep].grupos[grupoIndex].total_aberto += area.aberto;

              this.representadas[indexRep].total += area.total;
              this.representadas[indexRep].total_faturado += area.faturado;
              this.representadas[indexRep].total_aberto += area.aberto;

              //total bruto
              this.representadas[indexRep].grupos[grupoIndex].total_bruto += area.total_bruto;
              this.representadas[indexRep].grupos[grupoIndex].total_faturado_bruto += area.faturado_bruto;
              this.representadas[indexRep].grupos[grupoIndex].total_aberto_bruto += area.aberto_bruto;

              this.representadas[indexRep].total_bruto += area.total_bruto;
              this.representadas[indexRep].total_faturado_bruto += area.faturado_bruto;
              this.representadas[indexRep].total_aberto_bruto += area.aberto_bruto;

              this.representadas[indexRep].grupos[grupoIndex].areas.push(area);
            } else { //* ja tem as areas apenas soma

              //total liquido
              this.representadas[indexRep].grupos[grupoIndex].areas[indexArea].total += pedido.valor_liquido;
              this.representadas[indexRep].total += pedido.valor_liquido;
              this.representadas[indexRep].grupos[grupoIndex].total += pedido.valor_liquido;

              //total bruto
              this.representadas[indexRep].grupos[grupoIndex].areas[indexArea].total_bruto += pedido.valor_total;
              this.representadas[indexRep].total_bruto += pedido.valor_total;
              this.representadas[indexRep].grupos[grupoIndex].total_bruto += pedido.valor_total;

              if (pedido.situacao === "faturado") {
                //total liquido
                this.representadas[indexRep].grupos[grupoIndex].areas[indexArea].faturado += pedido.valor_liquido;
                this.representadas[indexRep].total_faturado += pedido.valor_liquido;
                this.representadas[indexRep].grupos[grupoIndex].total_faturado += pedido.valor_liquido;

                //total bruto
                this.representadas[indexRep].grupos[grupoIndex].areas[indexArea].faturado_bruto += pedido.valor_total;
                this.representadas[indexRep].total_faturado_bruto += pedido.valor_total;
                this.representadas[indexRep].grupos[grupoIndex].total_faturado_bruto += pedido.valor_total;
              } else if (pedido.situacao === "pendente") {
                //total liquido
                this.representadas[indexRep].grupos[grupoIndex].areas[indexArea].aberto += pedido.valor_liquido;
                this.representadas[indexRep].total_aberto += pedido.valor_liquido;
                this.representadas[indexRep].grupos[grupoIndex].total_aberto += pedido.valor_liquido;

                //total bruto
                this.representadas[indexRep].grupos[grupoIndex].areas[indexArea].aberto_bruto += pedido.valor_total;
                this.representadas[indexRep].total_aberto_bruto += pedido.valor_total;
                this.representadas[indexRep].grupos[grupoIndex].total_aberto_bruto += pedido.valor_total;
              } else {
                //total liquido
                let totalLiquido = this.somarNotaLiquido(pedido.notas);
                this.representadas[indexRep].grupos[grupoIndex].areas[indexArea].faturado += totalLiquido;
                this.representadas[indexRep].grupos[grupoIndex].areas[indexArea].aberto += (pedido.valor_liquido - totalLiquido);

                this.representadas[indexRep].total_faturado += totalLiquido;
                this.representadas[indexRep].total_aberto += (pedido.valor_liquido - totalLiquido);

                this.representadas[indexRep].grupos[grupoIndex].total_faturado += totalLiquido;
                this.representadas[indexRep].grupos[grupoIndex].total_aberto += (pedido.valor_liquido - totalLiquido);

                //total bruto
                let totalBruto = this.somarNotaBruto(pedido.notas);
                this.representadas[indexRep].grupos[grupoIndex].areas[indexArea].faturado_bruto += totalBruto;
                this.representadas[indexRep].grupos[grupoIndex].areas[indexArea].aberto_bruto += (pedido.valor_total - totalBruto);

                this.representadas[indexRep].total_faturado_bruto += totalBruto;
                this.representadas[indexRep].total_aberto_bruto += (pedido.valor_total - totalBruto);

                this.representadas[indexRep].grupos[grupoIndex].total_faturado_bruto += totalBruto;
                this.representadas[indexRep].grupos[grupoIndex].total_aberto_bruto += (pedido.valor_total - totalBruto);
              }
            }
          }
        }
      } else if (pedido.data_emissao >= this.data.form.dtInicio.format("YYYY-MM-DD") && pedido.data_emissao <= this.data.form.dtFinal.format("YYYY-MM-DD")) {
        //* Verifica se a representada ja foi adicionada;
        console.log(pedido)
        let indexRep = this.representadas.findIndex(representada => representada.representada_id === pedido.representada_id);

        if (indexRep === -1) { //* Adiciona a representada o grupo e a area
          let representada = {
            representada_id: pedido.representada_id,
            nome_fantasia: pedido.representada.nome_fantasia,
            razao_social: pedido.representada.razao_social,
            total: 0,
            total_faturado: 0,
            total_aberto: 0,
            total_bruto: 0,
            total_faturado_bruto: 0,
            total_aberto_bruto: 0,
            grupos: [],
            //areas: []
          };

          let grupo = {
            grupo_id: pedido.area_venda.area_venda_grupo_area_vendas.length === 0 ? null : pedido.area_venda.area_venda_grupo_area_vendas[0].area_venda_grupo_id,
            grupo_name: pedido.area_venda.area_venda_grupo_area_vendas.length === 0 ? 'SEM GRUPO' : pedido.area_venda.area_venda_grupo_area_vendas[0].area_venda_grupo.name,
            areas: [],
            total: 0,
            total_faturado: 0,
            total_aberto: 0,
            total_bruto: 0,
            total_faturado_bruto: 0,
            total_aberto_bruto: 0,
          };
          let area = {
            area_venda_id: pedido.area_venda_id,
            nome: pedido.area_venda.nome,
            total: pedido.valor_liquido,
            faturado: 0,
            aberto: 0,
            total_bruto: pedido.valor_total,
            faturado_bruto: 0,
            aberto_bruto: 0,
          }


          area.aberto = pedido.valor_liquido;
          area.aberto_bruto = pedido.valor_total;

          area.faturado = pedido.valor_liquido;
          area.faturado_bruto = pedido.valor_total;

          //total liquido
          grupo.total = area.total;
          grupo.total_aberto = area.aberto;

          representada.total = area.total;
          representada.total_aberto = area.aberto;

          //total bruto
          representada.total_bruto = area.total_bruto;
          representada.total_aberto_bruto = area.aberto_bruto;

          grupo.total_bruto = area.total_bruto;
          grupo.total_aberto_bruto = area.aberto_bruto;

          grupo.areas.push(area);
          representada.grupos.push(grupo);
          this.representadas.push(representada);

        } else {

          let grupo_id = pedido.area_venda.area_venda_grupo_area_vendas.length === 0 ? null : pedido.area_venda.area_venda_grupo_area_vendas[0].area_venda_grupo_id
          let grupoIndex = this.representadas[indexRep].grupos.findIndex(grupo => grupo.grupo_id === grupo_id);

          if (grupoIndex === -1) { //* adicina o grupo e a area alem das somatorias
            let grupo = {
              grupo_id: pedido.area_venda.area_venda_grupo_area_vendas.length === 0 ? null : pedido.area_venda.area_venda_grupo_area_vendas[0].area_venda_grupo_id,
              grupo_name: pedido.area_venda.area_venda_grupo_area_vendas.length === 0 ? 'SEM GRUPO' : pedido.area_venda.area_venda_grupo_area_vendas[0].area_venda_grupo.name,
              areas: [],
              total: 0,
              total_faturado: 0,
              total_aberto: 0,
              total_bruto: 0,
              total_faturado_bruto: 0,
              total_aberto_bruto: 0,
            };

            let area = {
              area_venda_id: pedido.area_venda_id,
              nome: pedido.area_venda.nome,
              total: pedido.valor_liquido,
              faturado: 0,
              aberto: 0,
              total_bruto: pedido.valor_total,
              faturado_bruto: 0,
              aberto_bruto: 0,
            }

            area.aberto = pedido.valor_liquido;
            area.aberto_bruto = pedido.valor_total;

            area.faturado = pedido.valor_liquido;
            area.faturado_bruto = pedido.valor_total;

            //total liquido
            grupo.total = area.total;
            grupo.total_aberto = area.aberto;

            this.representadas[indexRep].total += area.total;
            this.representadas[indexRep].total_aberto += area.aberto;

            //total bruto
            grupo.total_bruto = area.total_bruto;
            grupo.total_aberto_bruto = area.aberto_bruto;

            this.representadas[indexRep].total_bruto += area.total_bruto;
            this.representadas[indexRep].total_aberto_bruto += area.aberto_bruto;


            grupo.areas.push(area);
            this.representadas[indexRep].grupos.push(grupo);

          } else { //* verifica a area e as somatorias ja tem representada e grupo
            let indexArea = this.representadas[indexRep].grupos[grupoIndex].areas.findIndex(area => area.area_venda_id === pedido.area_venda_id);

            if (indexArea === -1) { //*  nao tem area adiciona a area e a somatoria
              let area = {
                area_venda_id: pedido.area_venda_id,
                nome: pedido.area_venda.nome,
                total: pedido.valor_liquido,
                faturado: 0,
                aberto: 0,
                total_bruto: pedido.valor_total,
                faturado_bruto: 0,
                aberto_bruto: 0,
              }


              area.aberto = pedido.valor_liquido;
              area.aberto_bruto = pedido.valor_total;

              area.faturado = pedido.valor_liquido;
              area.faturado_bruto = pedido.valor_total;

              //total liquido
              this.representadas[indexRep].grupos[grupoIndex].total += area.total;
              this.representadas[indexRep].grupos[grupoIndex].total_aberto += area.aberto;

              this.representadas[indexRep].total += area.total;
              this.representadas[indexRep].total_aberto += area.aberto;

              //total bruto
              this.representadas[indexRep].grupos[grupoIndex].total_bruto += area.total_bruto;
              this.representadas[indexRep].grupos[grupoIndex].total_aberto_bruto += area.aberto_bruto;

              this.representadas[indexRep].total_bruto += area.total_bruto;
              this.representadas[indexRep].total_aberto_bruto += area.aberto_bruto;

              this.representadas[indexRep].grupos[grupoIndex].areas.push(area);
            } else { //* ja tem as areas apenas soma

              //total liquido
              this.representadas[indexRep].grupos[grupoIndex].areas[indexArea].total += pedido.valor_liquido;
              this.representadas[indexRep].total += pedido.valor_liquido;
              this.representadas[indexRep].grupos[grupoIndex].total += pedido.valor_liquido;

              //total bruto
              this.representadas[indexRep].grupos[grupoIndex].areas[indexArea].total_bruto += pedido.valor_total;
              this.representadas[indexRep].total_bruto += pedido.valor_total;
              this.representadas[indexRep].grupos[grupoIndex].total_bruto += pedido.valor_total;


              //total liquido
              this.representadas[indexRep].grupos[grupoIndex].areas[indexArea].aberto += pedido.valor_liquido;
              this.representadas[indexRep].total_aberto += pedido.valor_liquido;
              this.representadas[indexRep].grupos[grupoIndex].total_aberto += pedido.valor_liquido;

              //total bruto
              this.representadas[indexRep].grupos[grupoIndex].areas[indexArea].aberto_bruto += pedido.valor_total;
              this.representadas[indexRep].total_aberto_bruto += pedido.valor_total;
              this.representadas[indexRep].grupos[grupoIndex].total_aberto_bruto += pedido.valor_total;
            }
          }
        }

      }
    });

    console.log(this.representadas, 'teste');
    this.somarTotal();
    this.ordenar();
  }
  ordenar() {
    this.representadas.sort((a, b) => a.razao_social.localeCompare(b.razao_social));
    this.representadas.forEach(representada => {
      representada.grupos.sort((a, b) => a.grupo_name.localeCompare(b.grupo_name));
      representada.grupos.forEach(grupo => {
        grupo.areas.sort((a, b) => a.nome.localeCompare(b.nome));
      });
    });
  }
  somarNotaLiquido(notas: any[]) {
    let total = 0;
    notas.forEach(nota => {
      nota.nota_produtos.forEach(produto => {
        if (produto.qtd > 0) {
          total += (produto.qtd * produto.pedido_produto.valor_unitario - (produto.qtd * produto.pedido_produto.valor_unitario * produto.pedido_produto.desconto / 100));
        }
      });
    });
    return total;
  }

  somarNotaBruto(notas: any[]) {
    let total = 0;
    notas.forEach(nota => {
      nota.nota_produtos.forEach(produto => {
        if (produto.qtd > 0) {
          let ipi = 0;
          if (produto.pedido_produto.ipi) {
            ipi = (((produto.qtd * produto.pedido_produto.valor_unitario) - (produto.qtd * produto.pedido_produto.valor_unitario * produto.pedido_produto.desconto / 100))
              * produto.pedido_produto.ipi) / 100;
          }
          total += ((produto.qtd * produto.pedido_produto.valor_unitario) - (produto.qtd * produto.pedido_produto.valor_unitario * produto.pedido_produto.desconto / 100)) + ipi;
        }
      });
    });
    return total;
  }

  ngOnInit(): void {
  }

  private getTagsHtml(tagName: keyof HTMLElementTagNameMap): string {
    const htmlStr: string[] = [];
    const elements = document.getElementsByTagName(tagName);
    for (let idx = 0; idx < elements.length; idx++) {
      htmlStr.push(elements[idx].outerHTML);
    }

    return htmlStr.join('\r\n');
  }

  close() {
    this.dialogRef.close();
  }

  printWindowCurrent() {

    const printContent = document.getElementById("impressao");
    const stylesHtml = this.getTagsHtml('style');
    const linksHtml = this.getTagsHtml('link');
    const WindowPrt = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

    if (WindowPrt != null) {
      if (printContent != null) {
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
    this.representadas.map((representada) => {
      this.total.total_pedidos += representada.total;
      this.total.total_faturado += representada.total_faturado;
      this.total.total_aberto += representada.total_aberto;

      this.total.total_pedidos_bruto += representada.total_bruto;
      this.total.total_faturado_bruto += representada.total_faturado_bruto;
      this.total.total_aberto_bruto += representada.total_aberto_bruto;
    })
  }

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
