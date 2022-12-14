import { Injectable } from '@angular/core';
import { rejects } from 'assert';
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
        var workbook = XLSX.read(bstr, { type: "binary", raw: true, cellDates: true });
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
        
        if(representada.id == 20){
          var workbook = XLSX.read(bstr, { type: "binary", raw: false, cellDates: true });
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          var json = XLSX.utils.sheet_to_json(worksheet, { raw: false, header: 1 });
        }else {
          var workbook = XLSX.read(bstr, { type: "binary", raw:true});
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          var json = XLSX.utils.sheet_to_json(worksheet, { raw: true, header: 1 });
        }
        this[representada.func](json, representada.id).then((res) => {
          resolve({json, itens: res})
        })
        .catch((rej) => {
          console.log(rej)
          resolve(false)
          //console.log(rej)
        });
        // let itens = await this[representada.func](json, representada.id);
        //console.log(itens)
        // resolve({json, itens})
      };

      filereader.readAsArrayBuffer(file);
    });
  }

  async volk(data, representada_id: number) {
    let item = [];
    let newItem = [];
    let valorTotal = 0;
    return new Promise<any>(async (resolve, reject) => {
      try{
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
                //this.addItem(res); //* Adiciona item ?? item que j?? esteja cadastrado no banco
              }*/
            });
            valorTotal += produto.quantidade * produto.valor_unitario
          }
          inicial++;
        }
        resolve({
          item: item,
          newItem: newItem,
          valorTotal: valorTotal
        })
        // if (inicial > final) {
        //   if (this.itemsNew.length > 0) {
        //     this.openDialogProdutos();
        //   }
        // }
      }catch(e){
        reject(e);
      }
    });
  }

  async camper(data, representada_id: number) {
    let item = [];
    let newItem = [];
    return new Promise<any>(async (resolve, reject) => {
      try{
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
          valorTotal: data[final+3][4] != undefined ? data[final+3][4].replace(/[^\d,-]/g, '').replace(',', ".") : data[final+3][5].replace(/[^\d,-]/g, '').replace(',', "."),
          final: final
        })
      }catch(e){
        reject(e);
      }
    });
  }

  //* tirar por enquanto
  async kadesh(data, representada_id: number) {
    let item = [];
    let newItem = [];
    return new Promise<any>(async (resolve, reject) => {
      try{
        var inicial = 0;
        var final = 0;

        while (data[final][0] != "Soma Quant.") {
          final++;
          while (data[inicial][0].toString().split(" ", 1)[0] != "Descri????o") {
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
      }catch(e){
        reject(e);
      }
    });
  }

  async betanin(data, representada_id: number) {
    let item = [];
    let newItem = [];
    return new Promise<any>(async (resolve, reject) => {
      try{
        var inicial = 0;
        var final = 0;
        var cabecalho = 0;
        while (inicial <= final) {
          while (data[final][0] != "Textos da Nota" ) {
            final++;
            while (data[inicial][0] != "Item") {
              inicial++;
            }
          }

          if(data[inicial][0] == "Item") {
            cabecalho = inicial;
          }
          if (
            data[inicial][0] != "Item" &&
            data[inicial][0] != "Textos da Nota" &&
            data[inicial][0] != undefined
          ) {
            let ipi;
            let unitario;
            let desconto;
            //* VALIDACAO IPI
            if(data[cabecalho][11] == "% IPI"){
              ipi = data[inicial][11];
            }//else if(data[cabecalho][27] == "% IPI"){
            //   ipi = data[inicial][27];
            // }else if(data[cabecalho][28] == "% IPI"){
            //   ipi = data[inicial][28];
            // }else{
            //   ipi = data[inicial][29];
            // }
            //* VALIDACAO VALOR UNITARIO 
            if(data[cabecalho][10] == "Pre??o L??quido"){
              unitario = data[inicial][10].replaceAll("R$", "").trim();
            }//else if(data[cabecalho][24] == "Pre??o\r\nLiquido"){
            //   unitario = data[inicial][26];
            // }else if(data[cabecalho][25] == "Pre??o\r\nLiquido"){
            //   unitario = data[inicial][27];
            // }else{
            //   unitario = data[inicial][28];
            // }
            //* VALIDACAO DESCONTO
            if(data[cabecalho][8] == "% Desc"){
              desconto = data[inicial][8];
             }//else if(data[cabecalho][21] == "% Desc"){
            //   desconto = data[inicial][21];
            // }else{
            //   desconto = data[inicial][22];
            // }
            var produto = {
              codigo_catalogo: data[inicial][1].toString(),
              nome: data[inicial][2],
              quantidade: parseFloat(data[inicial][5].split("/")[1].trim()),
              ipi: parseFloat(this.preformatFloat(ipi)),
              valor_unitario: parseFloat(this.preformatFloat(unitario)),
              desconto: isNaN(parseFloat(this.preformatFloat(desconto))) ? null : parseFloat(this.preformatFloat(desconto)),
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

        let subst;
        let valorTotal;
        //* VALIDACAO subst
        if(data[final + 11][4] == "Total Subst."){
          subst = data[final + 11][5].replaceAll("R$", "").trim();
         }//else if(data[final + 7][26] == "Total Subst."){
        //   subst = data[final + 7][31]
        // }else{
        //   subst = data[final + 7][32]
        // }
        //* VALIDACAO valorTotal
        if(data[final + 12][4] == "Total NF"){
          valorTotal = data[final + 12][5].replaceAll("R$", "").trim();
         }//else if(data[final + 8][26] == "Total NF"){
        //   valorTotal = data[final + 8][31]
        // }else{
        //   valorTotal = data[final + 8][32]
        // }
        
        resolve({
          item: item,
          newItem: newItem,
          valorTotal: parseFloat(this.preformatFloat(valorTotal)),
          final: final,
          subst: parseFloat(this.preformatFloat(subst))
        })
      }catch(e){
        reject(e);
      }
      
    });
  }

  preformatFloat(float){
    if(!float){
       return '';
    };
 
    //Index of first comma
    const posC = float.indexOf(',');
 
    if(posC === -1){
       //No commas found, treat as float
       return float;
    };
 
    //Index of first full stop
    const posFS = float.indexOf('.');
 
    if(posFS === -1){
       //Uses commas and not full stops - swap them (e.g. 1,23 --> 1.23)
       return float.replace(/\,/g, '.');
    };
 
    //Uses both commas and full stops - ensure correct order and remove 1000s separators
    return ((posC < posFS) ? (float.replace(/\,/g,'')) : (float.replace(/\./g,'').replace(',', '.')));
 };


  //* ?? calfor
  async italbotas(data, representada_id: number) {
    let item = [];
    let newItem = [];
    return new Promise<any>(async (resolve, reject) => {
      try{ 
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
      }catch(e){
        reject(e);
      }
    });
  }

  async consultaCod(produto: any, representada_id: number): Promise<any> {
    let campos;
    let newItem;
    return new Promise(async (resolve, reject) => {
      this.clientservice
        .getProdutoCode({"codigo":produto.codigo_catalogo})
        .subscribe((res: any) => {
          if (res.success == true) {
            campos = produto;
            campos.embalagem = res.data.produto_embalagem.nome
            //campos.unidade = (res.data.unidade != null) ? res.data.unidade : null;
            campos.id = res.data.id;
            if(representada_id == 18) campos.ipi = res.data.ipi;
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
  //       .replace("  Data de Emiss??o", "")
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
  //       .replace("  Data de Emiss??o", "")
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
  //     while (data[inicial][0].toString().split(" ", 1)[0] != "Descri????o") {
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
  //             this.addItem(res); //* Adiciona item ?? item que j?? esteja cadastrado no banco
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
