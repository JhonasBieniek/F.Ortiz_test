import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog } from "@angular/material";
import { ClientService } from '../../shared/services/client.service.component';
import { DialogBodyProdutoComponent } from './dialog-body-produto/dialog-body-produto.component';
import { DialogConfirmarDeleteComponent } from '../dialog-confirmar-delete/confirmar-delete.component';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent implements OnInit {

  itemsNew = [];
  arrayBuffer: any;
  planilha: any;
  linha: any;
  campos = [];
  representada: any;
  prods:any = [];
  produtos:any = [];

  data:any = [];
  editing = {};
  dados:any = [];
  rows = [];
  temp = [];
  
  loadingIndicator: boolean = true;
  reorderable: boolean = true;                           

  columns = [
      { prop: 'id' },
      { prop: 'codigo' },
      { prop: 'nome' },
      { prop: 'representada.nome_fantasia' }
  ];       

  @ViewChild(ProdutosComponent, {static: false}) table: ProdutosComponent;
  constructor(private clientservice: ClientService, private dialog: MatDialog, private spinner: NgxSpinnerService,) {
    this.refreshTable();                    
    this.clientservice.getProdutosSoft().subscribe((res:any) => {
      this.prods = res.data;
    })        
  }

  incomingfile(event) {
    var file: File;
    this.itemsNew = [];
    file = event.target.files[0];
    this.importar(file);
  }

  importar(file) {
    this.planilha = new FileReader();
    this.planilha.onload = (e) => {
      this.arrayBuffer = this.planilha.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary", raw: true });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var json = XLSX.utils.sheet_to_json(worksheet, { raw: true, header: 1 });
      if( this.representada === 'volk'){
        let produtos = [];
        //ICMS 4%
        var sheet4 = workbook.SheetNames[0];
        var worksheet4 = workbook.Sheets[sheet4];
        var json4 = XLSX.utils.sheet_to_json(worksheet4, { raw: true, header: 1 });
        //ICMS 12%
        var sheet12 = workbook.SheetNames[1];
        var worksheet12 = workbook.Sheets[sheet12];
        var json12 = XLSX.utils.sheet_to_json(worksheet12, { raw: true, header: 1 });
        //ICMS 18%
        var sheet18 = workbook.SheetNames[2];
        var worksheet18 = workbook.Sheets[sheet18];
        var json18 = XLSX.utils.sheet_to_json(worksheet18, { raw: true, header: 1 });
      }
      this.volk(json4, json12, json18);
    }
    if (file != undefined) {
      this.spinner.show();
      this.planilha.readAsArrayBuffer(file);
    }
  }

  async volk(data4, data12, data18) {
    let produtos = [];

    data4.forEach(element => {
      if (element[1] != "CÓDIGO" && element[9] != "4% - R$" && element.length > 2) {
        var produto = [
          {"preco": element[9], "codigo": element[1], "estado_id": 24, "tipo": null},
          {"preco": element[9], "codigo": element[1], "estado_id": 25, "tipo": null}
        ]
        produtos.push(produto)
      }
    });
    data12.forEach(element => {
      if (element[1] != "CÓDIGO" && element[9] != "12% - R$" && element.length > 2) {
        var produto = [
          {"preco": element[9], "codigo": element[1], "estado_id": 16, "tipo": "revendedor"},
        ]
        produtos.push(produto)
      }
    });
    data18.forEach(element => {
      if (element[1] != "CÓDIGO" && element[9] != "18% - R$" && element.length > 2) {
        var produto = [
          {"preco": element[9], "codigo": element[1], "estado_id": 16, "tipo": "final"},
        ]
        produtos.push(produto)
      }
    });
    produtos.forEach(element => {
     this.prods.map(e => {
       if(e.produto != null){
        if(e.produto.codigo_catalogo == element[0].codigo && e.estado_id == element[0].estado_id && 
          e.tipo == element[0].tipo && e.preco != element[0].preco.toFixed(2)){
          let data = {
            id: e.id,
            preco: element[0].preco.toFixed(2)
          }
          console.log(data)
          // this.clientservice.updateProdutoEstadoPreco(data).subscribe(res => {
          //   console.log(res);
          // })
        }
       }
     })
    })

    this.spinner.hide();
  }
  
  updateFilter(event) {
  const val = event.target.value.toLowerCase();
  const temp = this.temp.filter(function(d) {
    return d.nome.toLowerCase().indexOf(val) !== -1 || !val 
    || d.representada.nome_fantasia.toLowerCase().indexOf(val) !== -1 || !val
    || d.codigo_importacao.toLowerCase().indexOf(val) !== -1 || !val;
  }); 
  this.rows = temp;
  this.table = this.data;
  }

  updateValue(event, cell, rowIndex) { 
  this.editing[rowIndex + '-' + cell] = false;
  this.rows[rowIndex][cell] = event.target.value;
  this.rows = [...this.rows];
  }

  openDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '100vw',
      maxHeight: '100vh',
    
      width: '95vw',
      height: '95vh'
    }
    //dialogConfig.data = this.dados.data;
    let dialogRef = this.dialog.open(
      DialogBodyProdutoComponent, 
      dialogConfig, 
    
  );
    dialogRef.afterClosed().subscribe(value => {
        this.refreshTable();
      });
  }
  refreshTable(){
    this.clientservice.getProdutosSoft().subscribe(res =>{
      this.data = res;
      this.rows = this.data.data.sort((a,b)=> a.id - b.id);;
      this.temp = [...this.data.data];
      setTimeout(() => { this.loadingIndicator = false; }, 1500); 
    });
  }
  delete(row){
    const dialogConfig = new MatDialogConfig();
      let tipo = 'produtos'
      dialogConfig.data = row
      dialogConfig.data.nome = row.nome
      dialogConfig.data.tipo = tipo
      let dialogRef = this.dialog.open(DialogConfirmarDeleteComponent,
      dialogConfig   
    );
    dialogRef.afterClosed().subscribe(value => {
      (value != 1) ? this.refreshTable() : null
    });
  }
  edit(row){
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '100vw',
      maxHeight: '100vh',
    
      width: '95vw',
      height: '95vh'
    }
      dialogConfig.data = row
      dialogConfig.data.action = 'edit'
      let dialogRef = this.dialog.open(DialogBodyProdutoComponent,
      dialogConfig   
    );
    dialogRef.afterClosed().subscribe(value => {

     (value != 1) ? this.refreshTable() : null

      });
    }
  ngOnInit() {
   
  }

}
