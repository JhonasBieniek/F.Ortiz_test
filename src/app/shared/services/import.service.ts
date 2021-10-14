import { Injectable } from '@angular/core';
import * as XLSX from "xlsx";
import { ClientService } from './client.service.component';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(
    private clientservice: ClientService) { }

  async importar(file: File)  {
    return new Promise<any>((resolve, reject) => {
      let filereader = new FileReader();
      let arrayBuffer: any;
      filereader.onload = (e) => {
        arrayBuffer = filereader.result;
        var data = new Uint8Array(arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i)
          arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary", raw: true });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        var json = XLSX.utils.sheet_to_json(worksheet, { raw: true, header: 1 });
        resolve(json)
      };

      filereader.readAsArrayBuffer(file);
    });
  }

  async importarPedido(file: File, representada:any)  {
    //representada.func // nome da representada
    //representada.id
    return new Promise<any>((resolve, reject) => {
      let filereader = new FileReader();
      let arrayBuffer: any;
      filereader.onload = async (e) => {
        arrayBuffer = filereader.result;
        var data = new Uint8Array(arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i)
          arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary", raw: true });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        var json = XLSX.utils.sheet_to_json(worksheet, { raw: true, header: 1 });
        let itens = await this[representada.func](json, representada.id);
        resolve({json, itens})
      };

      filereader.readAsArrayBuffer(file);
    });
  }

  async volk(data, representada_id: number) {
    let item = [];
    let newItem = [];
    return new Promise<any>(async (resolve, reject) => {
      var inicial = 0;
      var final = 0;

      while (inicial <= final) {
        while (data[final][0] != "Valor Produtos.....:") {
          final++;
          while (data[inicial][0] != "Produto") {
            inicial++;
          }
        }
        if (
          data[inicial][0] != "Produto" &&
          data[inicial][0] != "Valor Produtos.....:"
        ) {
          var produto = {
            codigo_catalogo: data[inicial][0],
            nome: data[inicial][2],
            quantidade: data[inicial][5],
            tamanho: data[inicial][1],
            ipi: data[inicial][9],
            valor_unitario: data[inicial][6],
            comissao: data[inicial][11],
          };
          await this.consultaCod(produto, representada_id).then((res: any) => {
            if(res.item != undefined){
              item.push(res.item);
            }else {
              newItem.push(res.newItem);
            }
            /*console.log("consulta Cod")
            console.log(res);
            if (res != undefined) {
              //console.log(res);
              //this.addItem(res); //* Adiciona item à item que já esteja cadastrado no banco
            }*/
          });
        }
        inicial++;
      }
      resolve({
        item: item,
        newItem: newItem,
        valorTotal: data[final][1]
      })
      // if (inicial > final) {
      //   if (this.itemsNew.length > 0) {
      //     this.openDialogProdutos();
      //   }
      // }
    });
  }

  async camper(data, representada_id: number) {
    let item = [];
    let newItem = [];
    return new Promise<any>(async (resolve, reject) => {
      var inicial = 0;
      var final = 0;

      while (inicial <= final) {
        while (
          data[final][0] != "Peso bruto total:" &&
          data[final][0] != "Valor Total:"
        ) {
          final++;
          while (data[inicial][0] != "Produto") {
            inicial++;
          }
        }
  
        if (
          data[inicial][0] != "Produto" &&
          data[inicial][0] != "Peso bruto total:" &&
          data[final][0] != "Valor Total:"
        ) {
          var produto = {
            codigo_catalogo: data[inicial][0].split(" - ")[0].trim(),
            nome: data[inicial][0].split(" - ")[1],
            quantidade: parseInt(data[inicial][1].replace(/\./g, "")),
            tamanho: null,
            ipi: null,
            valor_unitario:
              data[inicial][3].match(/\d+/g)[0] +
              "." +
              data[inicial][3].match(/\d+/g)[1],
            comissao: null,
          };
          await this.consultaCod(produto, representada_id).then((res: any) => {
            if(res.item != undefined){
              item.push(res.item);
            }else {
              newItem.push(res.newItem);
            }
          });
        }
        inicial++;
      }
      resolve({
        item: item,
        newItem: newItem,
        valorTotal: data[final+3][4].replace(/[^\d,-]/g, '').replace(',', "."),
        final: final
      })
    });
  }

  //* tirar por enquanto
  async kadesh(data, representada_id: number) {
    let item = [];
    let newItem = [];
    return new Promise<any>(async (resolve, reject) => {
      var inicial = 0;
      var final = 0;

      while (data[final][0] != "Soma Quant.") {
        final++;
        while (data[inicial][0].toString().split(" ", 1)[0] != "Descrição") {
          inicial++;
          if (data[inicial + 1][0] === undefined) {
            inicial += 2;
          }
        }
      }

      let i = inicial + 1;
      for (i; i < final; i += 3) {
        let rowTam = i + 1;
        let rowQtd = i + 2;
        let dados = data[i][0].toString().replace(/  +/g, " ");
        
        let produto = {
          codigo_catalogo: dados.split(/\s+/g)[1],
          nome: dados.match(new RegExp("(?<=-\\s)([^.]+)(?=PR)"))[0].trim(),
          quantidade: null,
          tamanho: null,
          ipi: 0,
          valor_unitario: dados.split(" ").slice(-2)[0].replace(",", "."),
          comissao: null,
        };

        for (let j = 0; j <= data[rowTam].length; j++) {
          if (data[rowTam][j] != undefined || data[rowQtd][j] != undefined) {
            produto.tamanho = data[rowTam][j];
            produto.quantidade = data[rowQtd][j];
            await this.consultaCod(produto, representada_id).then((res: any) => {
              if(res.item != undefined){
                item.push(res.item);
              }else {
                newItem.push(res.newItem);
              }
            });
          }
        }
      }

      resolve({
        item: item,
        newItem: newItem,
        valorTotal: data[final + 7][0],
        final: final
      })
    });
  }

  async betanin(data, representada_id: number) {
    let item = [];
    let newItem = [];
    return new Promise<any>(async (resolve, reject) => {
      var inicial = 0;
      var final = 0;
      while (inicial <= final) {
        while (data[final][0] != "Texto da nota\r\nDescontos de cabeçalho" ) {
          final++;
          while (data[inicial][0] != "Item") {
            inicial++;
          }
        }
        if (
          data[inicial][0] != "Item" &&
          data[inicial][0] != "Texto da nota\r\nDescontos de cabeçalho" &&
          data[inicial][0] != undefined
        ) {
          // old quantidade quantidade: data[inicial][15].split("/")[1].replace(".", ""),
          // old valorUnitario: data[inicial][28].match(/\d+/g)[0] + "." + data[inicial][28].match(/\d+/g)[1],
          // old desconto: data[inicial][24].match(/\d+/g)[0] + "." + data[inicial][24].match(/\d+/g)[1],
          var produto = {
            codigo_catalogo: data[inicial][1],
            nome: data[inicial][4],
            quantidade: isNaN(data[inicial][12]) ? data[inicial][11].split("/")[1].replace(".", "") : data[inicial][12],
            ipi: data[inicial][17] == 0 ? data[inicial][28] : data[inicial][29],
            valor_unitario: data[inicial][17] == 0 ? data[inicial][27] :  data[inicial][28],
            desconto: data[inicial][17] == 0 ? data[inicial][21] :  data[inicial][22]
          };
          await this.consultaCod(produto, representada_id).then((res: any) => {
            if(res.item != undefined){
              item.push(res.item);
            }else {
              newItem.push(res.newItem);
            }
          });
        }
        inicial++;
      }
      resolve({
        item: item,
        newItem: newItem,
        valorTotal: data[final + 8][26] == "Total NF" ? data[final + 8][31] : data[final + 8][32],
        final: final,
        subst: data[final + 7][26] == "Total Subst." ? data[final + 7][31] : data[final + 7][32]
      })
    });
  }
  //* é calfor
  async italbotas(data, representada_id: number) {
    let item = [];
    let newItem = [];
    return new Promise<any>(async (resolve, reject) => {
      var inicial = 7;
      var final = 0;

      while (data[final][21] != "TOTAL:") {
        final++;
      }
      let i = inicial;
      for (i; i < final; i += 3) {
        let rowTam = i + 2;
        let produto = {
          codigo_catalogo: data[rowTam][0],
          nome: data[rowTam][1].toString().split(" - ")[0],
          quantidade: data[i][14],
          tamanho: data[rowTam][1].toString().split(" - ")[1],
          ipi: 0,
          valor_unitario: data[i][19],
          comissao: data[i][29],
        };
        await this.consultaCod(produto, representada_id).then((res: any) => {
          if(res.item != undefined){
            item.push(res.item);
          }else {
            newItem.push(res.newItem);
          }
        });
      }
      resolve({
        item: item,
        newItem: newItem,
        valorTotal: data[final][24],
        final: final
      })
    });
  }

  async consultaCod(produto: any, representada_id: number): Promise<any> {
    let campos;
    let newItem;
    return new Promise(async (resolve, reject) => {
      this.clientservice
        .getProdutoCode(produto.codigo_catalogo)
        .subscribe((res: any) => {
          if (res.success == true) {
            campos = produto;
            campos.embalagem = res.data.produto_embalagem.nome
            //campos.unidade = (res.data.unidade != null) ? res.data.unidade : null;
            campos.id = res.data.id;
          } else {
            newItem = produto;
            newItem.certificado_aprovacao = "";
            newItem.embalagem = "";
            newItem.representada_id = representada_id;
            //newItem.unidade_id = '';
            newItem.status = 1;
            //this.itemsNew.push(newItem);
          }
          
          resolve({
            item: campos,
            newItem: newItem
          });
        });
    });
  }

  //* old volk
  // async volkOld(data) {
  //   var inicial = 0;
  //   var final = 0;
  //   var clienteCnpj = data[7][3].toString().length == 13 ? "0" + data[7][3] : data[7][3];
  //   var pedido = data[21][12] != undefined ? data[6][1] + "/" + data[21][12] : data[6][1];
  //   this.condComercial = data[12][1];
  //   this.form.get("num_pedido").setValue(pedido);
  //   this.form.get("transportadora").setValue(data[18][2]);
  //   this.form.get("data_emissao").setValue(moment(data[6][3].replace(/\//g, "-"), "DD-MM-YYYY").format("YYYY-MM-DD"));
  //   this.form.get("data_entrega").setValue(moment(data[21][4], "DD-MM-YYYY").format("YYYY-MM-DD"));
  //   this.form.get("frete").setValue(data[17][1] == "C" ? "Cliente" : "Representada");

  //   while (inicial <= final) {
  //     while (data[final][0] != "Valor Produtos.....:") {
  //       final++;
  //       while (data[inicial][0] != "Produto") {
  //         inicial++;
  //       }
  //     }
  //     if (
  //       data[inicial][0] != "Produto" &&
  //       data[inicial][0] != "Valor Produtos.....:"
  //     ) {
  //       var produto = {
  //         codigo_catalogo: data[inicial][0],
  //         nome: data[inicial][2],
  //         quantidade: data[inicial][5],
  //         tamanho: data[inicial][1],
  //         ipi: data[inicial][9],
  //         valor_unitario: data[inicial][6],
  //         comissao: data[inicial][11],
  //       };
  //       await this.consultaCod(produto).then((res: any) => {
  //         if (res != undefined) {
  //           this.addItem(res);
  //         }
  //       });
  //     }
  //     inicial++;
  //   }

  //   this.ValorTotal = data[final][1];
  //   if (inicial > final) {
  //     if (this.itemsNew.length > 0) {
  //       this.openDialogProdutos();
  //     }
  //   }

  //   if (String(clienteCnpj).length == 14) {
  //     this.clientservice.getClientesCnpj(clienteCnpj).subscribe((res: any) => {
  //       if (res.success == true) {
  //         this.form.get("cliente_id").setValue(res.data.id);
  //         this.setAreaDeVenda(res.data.area_venda_id);
  //       } else {
  //         this.openDialogCNPJ(clienteCnpj);
  //       }
  //     });
  //   } else {
  //     this.notificationService.notify("CNPJ INCORRETO!");
  //   }

  //   this.CarregarProdutosRepresentada();
  //   this.spinner.hide();
  // }
    //* old Camper
  // async oldcamper(data) {
  //   var inicial = 0;
  //   var final = 0;

  //   let clienteCnpj = data[2][0].toString().match(new RegExp("\\d{2}\\.\\d{3}\\.\\d{3}\\/\\d{4}\\-\\d{2}", "g"))[0];
  //   clienteCnpj = clienteCnpj.replace(/[^\d]+/g, "");
  //   clienteCnpj = clienteCnpj.length == 13 ? "0" + clienteCnpj : clienteCnpj;
  //   this.form.get("num_pedido").setValue(data[0][0].toString().match(new RegExp("\\d+", "g"))[0]);
  //   this.form.get("frete").setValue("Representada");
  //   while (inicial <= final) {
  //     while (
  //       data[final][0] != "Peso bruto total:" &&
  //       data[final][0] != "Valor Total:"
  //     ) {
  //       final++;
  //       while (data[inicial][0] != "Produto") {
  //         inicial++;
  //       }
  //     }

  //     if (
  //       data[inicial][0] != "Produto" &&
  //       data[inicial][0] != "Peso bruto total:" &&
  //       data[final][0] != "Valor Total:"
  //     ) {
  //       var produto = {
  //         codigo_catalogo: data[inicial][0].split(" - ")[0].trim(),
  //         nome: data[inicial][0].split(" - ")[1],
  //         quantidade: parseInt(data[inicial][1].replace(/\./g, "")),
  //         tamanho: null,
  //         ipi: null,
  //         valorUnitario:
  //           data[inicial][3].match(/\d+/g)[0] +
  //           "." +
  //           data[inicial][3].match(/\d+/g)[1],
  //         comissao: null,
  //       };
  //       await this.consultaCod(produto).then((res: any) => {
  //         if (res != undefined) {
  //           this.addItem(res);
  //         }
  //       });
  //     }
  //     inicial++;
  //   }

  //   if (data[final + 1][0] == "Valor total em produtos:") {
  //     this.condComercial = data[final + 3][0]
  //       .split(":")[1]
  //       .replace("  Data de Emissão", "")
  //       .trim();
  //     this.form
  //       .get("data_emissao")
  //       .setValue(
  //         moment(data[final + 3][0].split(":")[2], "DD-MM-YYYY").format(
  //           "YYYY-MM-DD"
  //         )
  //       );
  //     this.form.get("obs").setValue(data[final + 5][0].split(":")[1]);
  //   } else {
  //     this.condComercial = data[final + 2][0]
  //       .split(":")[1]
  //       .replace("  Data de Emissão", "")
  //       .trim();
  //     this.form
  //       .get("data_emissao")
  //       .setValue(
  //         moment(data[final + 2][0].split(":")[2], "DD-MM-YYYY").format(
  //           "YYYY-MM-DD"
  //         )
  //       );
  //     this.form.get("obs").setValue(data[final + 4][0].split(":")[1]);
  //   }
  //   this.ValorTotal = data[final][1];
  //   if (inicial > final) {
  //     if (this.itemsNew.length > 0) {
  //       this.openDialogProdutos();
  //     }
  //   }

  //   if (String(clienteCnpj).length == 14) {
  //     this.clientservice.getClientesCnpj(clienteCnpj).subscribe((res: any) => {
  //       if (res.success == true) {
  //         this.form.get("cliente_id").setValue(res.data.id);
  //         this.setAreaDeVenda(res.data.area_venda_id);
  //       } else {
  //         this.openDialogCNPJ(clienteCnpj);
  //       }
  //     });
  //   } else {
  //     this.notificationService.notify("CNPJ INCORRETO!");
  //   }

  //   this.CarregarProdutosRepresentada();
  //   this.spinner.hide() 
  // }
  //* old Kadesh
  // async Oldkadesh(data) {
  //   var inicial = 0;
  //   var final = 0;
  //   this.condComercial = data[12][0].split(" ")[0] + " " + data[12][0].split(" ")[1];

  //   let clienteCnpj = data[7][0].toString().match(new RegExp("\\d{14}", "g"))[0];
  //   this.form.get("num_pedido").setValue(data[3][0]);
  //   this.form.get("data_emissao").setValue(moment(data[4][0].match(new RegExp("\\d{2}\\/\\d{2}\\/\\d{4}", "g"))[0].replace(/\//g, "-"),"DD-MM-YYYY").format("YYYY-MM-DD"));

  //   while (data[final][0] != "Soma Quant.") {
  //     final++;
  //     while (data[inicial][0].toString().split(" ", 1)[0] != "Descrição") {
  //       inicial++;
  //       if (data[inicial + 1][0] === undefined) {
  //         inicial += 2;
  //       }
  //     }
  //   }

  //   let i = inicial + 1;
  //   for (i; i < final; i += 3) {
  //     let rowTam = i + 1;
  //     let rowQtd = i + 2;
  //     let dados = data[i][0].toString().replace(/  +/g, " ");
  //     let produto = {
  //       codigo_catalogo: dados.split(/\s+/g)[1],
  //       nome: dados.match(new RegExp("(?<=-\\s)([^.]+)(?=PR)"))[0].trim(),
  //       quantidade: null,
  //       tamanho: null,
  //       ipi: 0,
  //       valorUnitario: dados.split(" ").slice(-2)[0].replace(",", "."),
  //       comissao: null,
  //     };
  //     for (let j = 0; j <= data[rowTam].length; j++) {
  //       if (data[rowTam][j] != undefined || data[rowQtd][j] != undefined) {
  //         produto.tamanho = data[rowTam][j];
  //         produto.quantidade = data[rowQtd][j];
  //         await this.consultaCod(produto).then((res: any) => {
  //           if (res != undefined) {
  //             this.addItem(res); //* Adiciona item à item que já esteja cadastrado no banco
  //           }
  //         });
  //       }
  //     }
  //   }

  //   this.form.get("valor_total").setValue(data[final + 7][0]);
  //   this.form.get("frete").setValue(data[final + 9][0] == "CIF Destino" ? "Cliente" : "Representada");
  //   this.form.get("transportadora").setValue(data[final + 11][0]);

  //   if (i == final) {
  //     if (this.itemsNew.length > 0) {
  //       this.openDialogProdutos();
  //     }
  //   }

  //   if (String(clienteCnpj).length == 14) {
  //     this.clientservice.getClientesCnpj(clienteCnpj).subscribe((res: any) => {
  //       if (res.success == true) {
  //         this.form.get("cliente_id").setValue(res.data.id);
  //         this.setAreaDeVenda(res.data.area_venda_id);
  //       } else {
  //         this.openDialogCNPJ(clienteCnpj);
  //       }
  //     });
  //   } else {
  //     this.notificationService.notify("CNPJ INCORRETO!");
  //   }
  //   this.CarregarProdutosRepresentada();
  //   this.spinner.hide();
  // }
  //* old betanin
  // async oldbetanin(data) {
  //   var inicial = 0;
  //   var final = 0;
  //   this.condComercial = data[2][31];

  //   let clienteCnpj = data[5][5].replace(/[^\d]+/g, "");
  //   clienteCnpj = clienteCnpj.length == 13 ? "0" + clienteCnpj : clienteCnpj;
  //   this.form.get("num_pedido").setValue(data[1][31]);
  //   this.form.get("data_emissao").setValue(moment(data[3][31].replace(/\//g, "-"), "DD-MM-YYYY").format("YYYY-MM-DD"));

  //   while (inicial <= final) {
  //     while (data[final][0] != "Texto da nota") {
  //       final++;
  //       while (data[inicial][0] != "Item") {
  //         inicial++;
  //       }
  //     }
  //     if (
  //       data[inicial][0] != "Item" &&
  //       data[inicial][0] != "Texto da nota" &&
  //       data[inicial][0] != undefined
  //     ) {
  //       var produto = {
  //         codigo_catalogo: data[inicial][3],
  //         nome: data[inicial][6],
  //         quantidade: data[inicial][15].split("/")[1].replace(".", ""),
  //         ipi: data[inicial][33],
  //         valorUnitario:
  //           data[inicial][28].match(/\d+/g)[0] +
  //           "." +
  //           data[inicial][28].match(/\d+/g)[1],
  //         desconto:
  //           data[inicial][24].match(/\d+/g)[0] +
  //           "." +
  //           data[inicial][24].match(/\d+/g)[1],
  //       };
  //       await this.consultaCod(produto).then((res: any) => {
  //         if (res != undefined) {
  //           //this.addItem(res);
  //         }
  //       });
  //     }
  //     inicial++;
  //   }
  //   this.form.get("valor_total").setValue(data[final + 9][31]);
  //   this.form.get("frete").setValue(data[final + 8][5] == "CIF" ? "Cliente" : "Representada");
  //   this.form.get("transportadora").setValue(data[final + 7][5]);

  //   if (inicial > final) {
  //     if (this.itemsNew.length > 0) {
  //       this.openDialogProdutos();
  //     }
  //   }

  //   if (String(clienteCnpj).length == 14) {
  //     this.clientservice.getClientesCnpj(clienteCnpj).subscribe((res: any) => {
  //       if (res.success == true) {
  //         this.form.get("cliente_id").setValue(res.data.id);
  //         this.setAreaDeVenda(res.data.area_venda_id);
  //       } else {
  //         this.openDialogCNPJ(clienteCnpj);
  //       }
  //     });
  //   } else {
  //     this.notificationService.notify("CNPJ INCORRETO!");
  //   }
  //   this.CarregarProdutosRepresentada();
  //   this.spinner.hide();
  // }
    //* old italbotas
  // async olditalbotas(data) {
  //   var inicial = 0;
  //   var final = 0;
  //   this.condComercial = data[6][18];

  //   let clienteCnpj = data[5][17];
  //   clienteCnpj = clienteCnpj.length == 13 ? "0" + clienteCnpj : clienteCnpj;
  //   this.form.get("num_pedido").setValue(data[5][1].trim() + "/" + data[6][27].trim());
  //   this.form.get("data_emissao").setValue(moment(data[6][4].match(new RegExp("\\d{2}\\/\\d{2}\\/\\d{4}", "g"))[0].replace(/\//g, "-"),"DD-MM-YYYY").format("YYYY-MM-DD"));
  //   this.form.get("data_entrega").setValue(moment(data[6][10].match(new RegExp("\\d{2}\\/\\d{2}\\/\\d{4}", "g"))[0].replace(/\//g, "-"),"DD-MM-YYYY").format("YYYY-MM-DD"));

  //   inicial = 7;
  //   while (data[final][21] != "TOTAL:") {
  //     final++;
  //   }
  //   let i = inicial;
  //   for (i; i < final; i += 3) {
  //     let rowTam = i + 2;
  //     let produto = {
  //       codigo_catalogo: data[rowTam][0],
  //       nome: data[rowTam][1].toString().split(" - ")[0],
  //       quantidade: data[i][14],
  //       tamanho: data[rowTam][1].toString().split(" - ")[1],
  //       ipi: 0,
  //       valorUnitario: data[i][19],
  //       comissao: data[i][29],
  //     };
  //     await this.consultaCod(produto).then((res: any) => {
  //       if (res != undefined) {
  //         this.addItem(res);
  //       }
  //     });
  //   }

  //   if (i == final) {
  //     if (this.itemsNew.length > 0) {
  //       this.openDialogProdutos();
  //     }
  //   }

  //   if (String(clienteCnpj).length == 14) {
  //     this.clientservice.getClientesCnpj(clienteCnpj).subscribe((res: any) => {
  //       if (res.success == true) {
  //         this.form.get("cliente_id").setValue(res.data.id);
  //         this.setAreaDeVenda(res.data.area_venda_id);
  //       } else {
  //         this.openDialogCNPJ(clienteCnpj);
  //       }
  //     });
  //   } else {
  //     this.notificationService.notify("CNPJ INCORRETO!");
  //   }
  //   this.CarregarProdutosRepresentada();
  //   this.spinner.hide();
  // }

}
