import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ClientService } from "../../../shared/services/client.service.component";
import * as XLSX from "xlsx";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-dialog-update-price",
  templateUrl: "./dialog-update-price.component.html",
  styleUrls: ["./dialog-update-price.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DialogUpdatePriceComponent implements OnInit {
  representadas: any = [];
  itemsNew = [];
  arrayBuffer: any;
  planilha: any;
  linha: any;
  campos = [];
  representada: any;
  prods: any = [];
  produtos: any = [];
  produtosNaoEncontrados = [];

  constructor(
    private clientservice: ClientService,
    private spinner: NgxSpinnerService
  ) {
    this.clientservice.getRepresentadasFunc().subscribe((res: any) => {
      this.representadas = res.data;
    });
    this.clientservice.getProdutosSoftPrice().subscribe((res: any) => {
      this.prods = res.data;
    });
  }

  ngOnInit() {}

  incomingfile(event) {
    var file: File;
    this.itemsNew = [];
    file = event.target.files[0];
    this.importar(file);
  }

  importar(file) {
    let representada = "";
    this.planilha = new FileReader();
    this.planilha.onload = (e) => {
      this.arrayBuffer = this.planilha.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary", raw: true });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var json = XLSX.utils.sheet_to_json(worksheet, { raw: true, header: 1 });
      if (this.representada.id === 9) {
        representada = "volk";
        //ICMS 4%
        var sheet4 = workbook.SheetNames[0];
        var worksheet4 = workbook.Sheets[sheet4];
        var json4 = XLSX.utils.sheet_to_json(worksheet4, {
          raw: true,
          header: 1,
        });
        //ICMS 12%
        var sheet12 = workbook.SheetNames[1];
        var worksheet12 = workbook.Sheets[sheet12];
        var json12 = XLSX.utils.sheet_to_json(worksheet12, {
          raw: true,
          header: 1,
        });
        //ICMS 18%
        var sheet18 = workbook.SheetNames[2];
        var worksheet18 = workbook.Sheets[sheet18];
        var json18 = XLSX.utils.sheet_to_json(worksheet18, {
          raw: true,
          header: 1,
        });
      }
      if (this.representada.id === 20) {
        representada = "bettanin";
        //ICMS 12% PR - SP - SC
        var sheet = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[sheet];
        var json = XLSX.utils.sheet_to_json(worksheet, {
          raw: true,
          header: 1,
        });
      }
      if (this.representada.id === 18) {
        representada = "camper";
        //ICMS 12% PR - SP - SC
        var sheet = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[sheet];
        var json = XLSX.utils.sheet_to_json(worksheet, {
          raw: true,
          header: 1,
        });
      }
      if (this.representada.id === 10) {
        representada = "brasmo";
        //Raiz
        var sheet = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[sheet];
        var json = XLSX.utils.sheet_to_json(worksheet, {
          raw: true,
          header: 1,
        });
        //MS
        var sheetms = workbook.SheetNames[1];
        var worksheetms = workbook.Sheets[sheetms];
        var jsonms = XLSX.utils.sheet_to_json(worksheetms, {
          raw: true,
          header: 1,
        });
        //PR
        var sheetpr = workbook.SheetNames[2];
        var worksheetpr = workbook.Sheets[sheetpr];
        var jsonpr = XLSX.utils.sheet_to_json(worksheetpr, {
          raw: true,
          header: 1,
        });
        //SC
        var sheetsc = workbook.SheetNames[3];
        var worksheetsc = workbook.Sheets[sheetsc];
        var jsonsc = XLSX.utils.sheet_to_json(worksheetsc, {
          raw: true,
          header: 1,
        });
      }
        if (this.representada.id === 9) {
          this[representada](json4, json12, json18);
        }
        else if (this.representada.id === 10) {
          this[representada](json, jsonms, jsonpr, jsonsc);
        } else {
          this[representada](json);
        }
    };
    if (file != undefined) {
      this.spinner.show();
      this.planilha.readAsArrayBuffer(file);
    }
  }

  async volk(data4, data12, data18) {
    let produtos = [];
      data4.forEach((element) => {
        if (
          element[1] != "CÓDIGO" &&
          element[9] != "4% - R$" &&
          element.length > 2 &&
          element[9] != undefined
        ) {
          var produto = [
            { preco: element[9], codigo: element[1], estado_id: 12, tipo: null }, // MS
            { preco: element[9], codigo: element[1], estado_id: 24, tipo: null }, // SC
            { preco: element[9], codigo: element[1], estado_id: 25, tipo: null }, // SP
          ];
          produtos.push(produto);
        }
      });
      data12.forEach((element) => {
        if (
          element[1] != "CÓDIGO" &&
          element[10] != "12% - R$" &&
          element.length > 2 &&
          element[10] != undefined
        ) {
          var produto = [
            {
              preco: element[10],
              codigo: element[1],
              estado_id: 16,
              tipo: "revendedor",
            },
          ];
          produtos.push(produto);
        }
      });
      data18.forEach((element) => {
        if (
          element[1] != "CÓDIGO" &&
          element[10] != "18% - R$" &&
          element.length > 2 &&
          element[10] != undefined
        ) {
          var produto = [
            {
              preco: element[10],
              codigo: element[1],
              estado_id: 16,
              tipo: "final",
            },
          ];
          produtos.push(produto);
        }
      });
    produtos.forEach((element) => {
      element.forEach((elementIn) => {
        this.prods.map((e: any) => {
          if (e.codigo_catalogo == elementIn.codigo) {
            e.produto_estados_precos.map((f) => {
              if (
                f.estado_id == elementIn.estado_id &&
                f.tipo == elementIn.tipo &&
                f.preco != elementIn.preco.toFixed(2)
              ) {
                let data = {
                  id: f.id,
                  preco: elementIn.preco.toFixed(2),
                };
                this.clientservice
                  .updateProdutoEstadoPreco(data)
                  .subscribe((res) => {
                    console.log(res);
                  });
              }
            });
          }
        });
      });
    });
    this.productsNotFound(produtos);
    this.spinner.hide();
  }
  async bettanin(data) {
    let produtos = [];
    data.forEach((element) => {
      if (typeof element[4] == "number" && element[4] > 0) {
        /**
         * TODO: Implementar no front a seleção para MS quando for importar 
         */
        var produto = [
          { preco: element[5], codigo: element[1], estado_id: 12, tipo: null },
          // { preco: element[5], codigo: element[1], estado_id: 16, tipo: null },
          // { preco: element[5], codigo: element[1], estado_id: 24, tipo: null },
          // { preco: element[5], codigo: element[1], estado_id: 25, tipo: null },
        ];
        produtos.push(produto);
      }
    });
    produtos.forEach((element) => {
      element.forEach((elementIn) => {
        this.prods.map((e: any) => {
          if (e.codigo_catalogo == elementIn.codigo) {
            e.produto_estados_precos.map((f) => {
              if (
                f.estado_id == elementIn.estado_id &&
                f.preco != elementIn.preco.toFixed(2)
              ) {
                let data = {
                  id: f.id,
                  preco: elementIn.preco.toFixed(2),
                };
                this.clientservice
                  .updateProdutoEstadoPreco(data)
                  .subscribe((res) => {

                  });
              }
            });
          }
        });
      });
    });
    this.productsNotFound(produtos);
    this.spinner.hide();
  }
  async camper(data) {
    let produtos = [];
    data.forEach((element) => {
      if (element[4] == "---") {
        var produto = [
          {
            preco: parseFloat(element[2].replace("R$ ", "").replace(",", ".")),
            codigo: element[0],
            estado_id: 12,
            tipo: null,
          },
          {
            preco: parseFloat(element[2].replace("R$ ", "").replace(",", ".")),
            codigo: element[0],
            estado_id: 16,
            tipo: null,
          },
          {
            preco: parseFloat(element[2].replace("R$ ", "").replace(",", ".")),
            codigo: element[0],
            estado_id: 18,
            tipo: null,
          },
          {
            preco: parseFloat(element[2].replace("R$ ", "").replace(",", ".")),
            codigo: element[0],
            estado_id: 24,
            tipo: null,
          },
          {
            preco: parseFloat(element[2].replace("R$ ", "").replace(",", ".")),
            codigo: element[0],
            estado_id: 25,
            tipo: null,
          },
        ];
        produtos.push(produto);
      }
    });
    produtos.forEach((element) => {
      element.forEach((elementIn) => {
        this.prods.map((e: any) => {
          if (e.codigo_catalogo == elementIn.codigo) {
            e.produto_estados_precos.map((f) => {
              console.log(f.preco, elementIn.preco.toFixed(2))
              if (
                f.estado_id == elementIn.estado_id &&
                f.preco != elementIn.preco.toFixed(2) && 
                elementIn.preco.toFixed(2) != '0.00'
              ) {
                let data = {
                  id: f.id,
                  preco: elementIn.preco.toFixed(2),
                };
                this.clientservice
                  .updateProdutoEstadoPreco(data)
                  .subscribe((res) => {
                    console.log(res);
                  });
              }
            });
          }
        });
      });
    });
    this.productsNotFound(produtos);
    this.spinner.hide();
  }
  async brasmo(data, datams, datapr, datasc) {
    let produtos = [];
    data.forEach((element) => {
      if (typeof element[9] == "number") {
        var produto = [
          { preco: element[9], codigo: element[0], estado_id: 25, tipo: null },
        ];
        produtos.push(produto);
      }
    });
    datams.forEach((element) => {
      if (typeof element[9] == "number") {
        var produto = [
          { preco: element[9], codigo: element[0], estado_id: 12, tipo: null },
        ];
        produtos.push(produto);
      }
    });
    datapr.forEach((element) => {
      if (typeof element[9] == "number") {
        var produto = [
          { preco: element[9], codigo: element[0], estado_id: 16, tipo: null },
        ];
        produtos.push(produto);
      }
    });
    datasc.forEach((element) => {
      if (typeof element[9] == "number") {
        var produto = [
          { preco: element[9], codigo: element[0], estado_id: 24, tipo: null },
        ];
        produtos.push(produto);
      }
    });
    console.log(produtos);

    // produtos.forEach((element) => {
    //   element.forEach((elementIn) => {
    //     this.prods.map((e: any) => {
    //       if (e.codigo_catalogo == elementIn.codigo) {
    //         e.produto_estados_precos.map((f) => {
    //           if (
    //             f.estado_id == elementIn.estado_id &&
    //             f.preco != elementIn.preco.toFixed(2)
    //           ) {
    //             let data = {
    //               id: f.id,
    //               preco: elementIn.preco.toFixed(2),
    //             };
    //             console.log(data);
    //             this.clientservice
    //               .updateProdutoEstadoPreco(data)
    //               .subscribe((res) => {
    //                 console.log(res);
    //               });
    //           }
    //         });
    //       }
    //     });
    //   });
    // });
    this.productsNotFound(produtos);
    this.spinner.hide();
  }
  //Function for insert default price  for MS ou todos
  // teste() {
  //   this.prods.map(d => {
  //     if (d.representada_id == 10) {
  //       d.produto_estados_precos.push(
  //         {
  //           "preco": 1,
  //           "produto_id": d.id,
  //           "estado_id": 12,
  //           "tipo": null
  //         },
  //         {
  //           "preco": 1,
  //           "produto_id": d.id,
  //           "estado_id": 16,
  //           "tipo": 'final'
  //         },
  //         {
  //           "preco": 1,
  //           "produto_id": d.id,
  //           "estado_id": 16,
  //           "tipo": 'revendedor'
  //         },
  //         {
  //           "preco": 1,
  //           "produto_id": d.id,
  //           "estado_id": 24,
  //           "tipo": null
  //         },
  //         {
  //           "preco": 1,
  //           "produto_id": d.id,
  //           "estado_id": 25,
  //           "tipo": null
  //         },
  //       )
  //     }
  //   }
  //   )
  //   this.prods.forEach(element => {
  //     this.clientservice.updateProduto(element).subscribe(res => console.log(res))
  //   });
  // }
  // Functionm for add produto_aplications
  // teste() {
  //   let teste = [];
  //   this.prods.map(e=> {
  //     if(e.produto_aplications.length == 0 )
  //     teste.push(e)
  //   })
  //   // teste.map(element => {
  //   //   element.produto_aplications.push(
  //   //       {"nome": "Alimentícia"},
  //   //       {"nome": "Frigoríficas"},
  //   //       {"nome": "Restaurantes"},
  //   //       {"nome": "Mercados"},
  //   //       {"nome": "Açougues"},
  //   //       {"nome": "Mercearias"},
  //   //       {"nome": "Laticínios"}
  //   //   )
  //   // });
  //   console.log(teste)
  //   // teste.forEach(element => {
  //   //       this.clientservice.updateProduto(element).subscribe(res => console.log(res))
  //   //     });
  // }
  productsNotFound(produtos) {
    var x = [];
    var y = [];
    let produtosNaoEncontrados = [];
    this.prods.map((e) => {
      if (e.representada_id === this.representada.id) {
        x.push(e.codigo_catalogo.replace(/ /g, ""));
      }
    });
    produtos.map((a) =>
      a.map((b) => {
        if (!y.includes("" + b.codigo)) {
          y.push("" + b.codigo);
        }
      })
    );
    //console.log(x, y);
    produtosNaoEncontrados = y.filter(function (obj) {
      return x.indexOf(obj) == -1;
    });
    this.produtosNaoEncontrados = produtosNaoEncontrados;
    console.log(produtosNaoEncontrados);
  }
}
