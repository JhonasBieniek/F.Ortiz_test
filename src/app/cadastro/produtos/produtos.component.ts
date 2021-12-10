import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialogConfig, MatDialog } from "@angular/material";
import { ClientService } from "../../shared/services/client.service.component";
import { DialogBodyProdutoComponent } from "./dialog-body-produto/dialog-body-produto.component";
import { DialogConfirmarDeleteComponent } from "../dialog-confirmar-delete/confirmar-delete.component";
import { NgxSpinnerService } from "ngx-spinner";
import * as XLSX from "xlsx";
import { DialogUpdatePriceComponent } from "./dialog-update-price/dialog-update-price.component";

@Component({
  selector: "app-produtos",
  templateUrl: "./produtos.component.html",
  styleUrls: ["./produtos.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ProdutosComponent implements OnInit {
  itemsNew = [];
  arrayBuffer: any;
  planilha: any;
  linha: any;
  campos = [];
  representada: any;
  prods: any = [];
  produtos: any = [];

  data: any = [];
  editing = {};
  dados: any = [];
  rows = [];
  temp = [];

  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  columns = [
    { prop: "id" },
    { prop: "codigo" },
    { prop: "nome" },
    { prop: "representada.nome_fantasia" },
  ];

  @ViewChild(ProdutosComponent, { static: false }) table: ProdutosComponent;
  constructor(
    private clientservice: ClientService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {
    this.refreshTable();
    this.clientservice.getProdutosSoft().subscribe((res: any) => {
      this.prods = res.data;
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      if(d.certificado_aprovacao == null) {
        d.certificado_aprovacao = '';
      }
      return (
        d.nome.toLowerCase().indexOf(val) !== -1 ||
        d.representada.nome_fantasia.toLowerCase().indexOf(val) !== -1 ||
        d.codigo_importacao.toLowerCase().indexOf(val) !== -1 ||
        d.certificado_aprovacao.toLowerCase().indexOf(val) !== -1 ||
        d.codigo_catalogo.toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.rows = temp;
    this.table = this.data;
  }

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + "-" + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }

  updatePrice() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: "100vw",
      maxHeight: "100vh",

      width: "95vw",
      height: "95vh",
    };
    //dialogConfig.data = this.dados.data;
    let dialogRef = this.dialog.open(DialogUpdatePriceComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((value) => {
      this.refreshTable();
    });
  }

  openDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: "100vw",
      maxHeight: "100vh",

      width: "95vw",
      height: "95vh",
    };
    //dialogConfig.data = this.dados.data;
    let dialogRef = this.dialog.open(DialogBodyProdutoComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((value) => {
      this.refreshTable();
    });
  }

  refreshTable() {
    this.clientservice.getProdutosSoft().subscribe((res) => {
      this.data = res;
      this.rows = this.data.data.sort((a, b) => a.id - b.id);
      this.temp = [...this.data.data];
    });
  }
  
  delete(row) {
    const dialogConfig = new MatDialogConfig();
    let tipo = "produtos";
    dialogConfig.data = row;
    dialogConfig.data.nome = row.nome;
    dialogConfig.data.tipo = tipo;
    let dialogRef = this.dialog.open(
      DialogConfirmarDeleteComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe((value) => {
      value != 1 ? this.refreshTable() : null;
    });
  }
  edit(row) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: "100vw",
      maxHeight: "100vh",

      width: "95vw",
      height: "95vh",
    };
    dialogConfig.data = row;
    dialogConfig.data.action = "edit";
    let dialogRef = this.dialog.open(DialogBodyProdutoComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((value) => {
      value != 1 ? this.refreshTable() : null;
    });
  }
  view(row) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: "100vw",
      maxHeight: "100vh",

      width: "95vw",
      height: "95vh",
    };
    dialogConfig.data = row;
    dialogConfig.data.action = "view";
    let dialogRef = this.dialog.open(DialogBodyProdutoComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((value) => {
      value != 1 ? this.refreshTable() : null;
    });
  }
  ngOnInit() {}
}
