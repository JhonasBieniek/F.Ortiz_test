import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ClientService } from '../../shared/services/client.service.component';
import { MatDialog, MatDialogConfig, MatTabChangeEvent } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import page from './steps.json';
import { OrcamentoComponent } from './orcamento/orcamento.component';
import { DialogConfirmarDeleteComponent } from '../../cadastro/dialog-confirmar-delete/confirmar-delete.component';
import { ViewPedidoOrcamentoComponent } from '../view-pedido/view-pedido.component';
import { ImportComponent } from '../pedido-listar/import/import.component';
import { ViewOrcamentoComponent } from '../view-orcamento/view-orcamento.component';
import { DialogCancelarOrcamentosAntigosComponent } from './dialog-cancelar-orcamentos-antigos/dialog-cancelar-orcamentos-antigos.component';

@Component({
  selector: 'app-orc-listar',
  templateUrl: './orc-listar.component.html',
  styleUrls: ['./orc-listar.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class OrcListarComponent implements OnInit {

  editing = {};
  rows: any = [];
  temp: any = [];
  selected: any = [];
  page: any = page;
  steps: any = this.page.pedidos;
  defaultTab = 0;

  action: string = "orcamento";

  loadingIndicator = true;
  reorderable = true;

  isEditable = {};

  dialogConfig = new MatDialogConfig();


  constructor(
    private clientservice: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog) {
    this.loadData()
  }

  loadData() {
    this.clientservice.getOrcamentosForUsers().subscribe((res: any) => {
      let i = 0;
      console.log(res)
      this.steps.forEach(e => {
        this.temp[i] = res.data.filter(d => d.situation == e.step);
        i++;
      });
      this.rows = [...this.temp.sort((a, b) => a.id - b.id)];
    });
  }

  ngOnInit() {
    this.dialogConfig = {
      width: '98vw',
      height: '98vh'
    }
  }
  add(tipo) {
    this.dialogConfig.data = {
      tipo: tipo
    };
    let dialogRef = this.dialog.open(OrcamentoComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      this.loadData();
    })
  }
  // import(tipo) {
  //   this.dialogConfig.data = {
  //     tipo: tipo
  //   };
  //   let dialogRef = this.dialog.open(OrcamentoComponent, this.dialogConfig);
  //   dialogRef.afterClosed().subscribe(value => {
  //     this.loadData();
  //   })
  // }
  edit(row) {
    this.dialogConfig.data = {
      tipo: 'edit',
      orcamento: row
    }
    let dialogRef = this.dialog.open(OrcamentoComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      this.loadData();
    })
  }
  // gerar(row){
  //   this.dialogConfig.data = {
  //     tipo: 'orc',
  //     orc: row
  //   }
  //   let dialogRef = this.dialog.open(ImportComponent, this.dialogConfig);
  //   dialogRef.afterClosed().subscribe(value =>{
  //     if(value != undefined){
  //       this.clientservice.updateOrcamento(
  //         {id: row.id, orderGen: true}
  //       ).subscribe( res => console.log(res))
  //     }
  //     this.loadData();
  //   })
  // }
  view(row){
    this.dialogConfig.data = {
      tipo: 'orcamentos',
      pedido: row
    }
    let dialogRef = this.dialog.open(ViewOrcamentoComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(value =>{
      this.loadData();
    })
  }

  delete(row) {
    const dialogConfig = new MatDialogConfig();
    let tipo = 'orcamentos'
    dialogConfig.data = row
    dialogConfig.data.nome = row.id
    dialogConfig.data.tipo = tipo
    let dialogRef = this.dialog.open(DialogConfirmarDeleteComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(value => { (value != 1) ? this.loadData() : null });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows[this.defaultTab] = this.temp[this.defaultTab].filter(function (d) {
      if (d.cliente.nome_fantasia.toLowerCase().indexOf(val) !== -1 || !val ||
        d.representada.nome_fantasia.toLowerCase().indexOf(val) !== -1 || !val)
        return d
    });
  }

  onTabChange(event: MatTabChangeEvent) {
    this.defaultTab = event.index;
    window.dispatchEvent(new Event('resize'));
    this.selected =[];
  }

  cancelar(){
    let dialogRef = this.dialog.open(DialogCancelarOrcamentosAntigosComponent,
      this.dialogConfig
    );
    dialogRef.afterClosed().subscribe(value => { 
      this.loadData()
    });
  }

}
