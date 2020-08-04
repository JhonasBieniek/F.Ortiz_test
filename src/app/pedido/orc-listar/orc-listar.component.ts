import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ClientService } from '../../shared/services/client.service.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import page from './steps.json';
import { OrcamentoComponent } from '../orcamento/orcamento.component';
import { DialogConfirmarDeleteComponent } from '../../cadastro/dialog-confirmar-delete/confirmar-delete.component';
import { ViewPedidoOrcamentoComponent } from '../view-pedido-orcamento/view-pedido-orcamento.component';

@Component({
  selector: 'app-orc-listar',
  templateUrl: '../default.html',
  styleUrls: ['./orc-listar.component.css']
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
    this.clientservice.getOrcamentos().subscribe((res: any) => {
      let i = 0;
      this.steps.forEach(e => {
        this.temp[i] = res.data.filter(d => d.status == e.step);
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
  edit(row) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      tipo: 'edit',
      orcamento: row
    }
    let dialogRef = this.dialog.open(OrcamentoComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      this.loadData();
    })
  }
  view(row){
    this.dialogConfig.data = {
      tipo: 'view',
      pedido: row
    }
    let dialogRef = this.dialog.open(ViewPedidoOrcamentoComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(value =>{
     // this.loadData();
    })
  }
  generateRequest(row){

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

  add(tipo) {
    this.dialogConfig.data = {
      tipo: tipo
    };
    let dialogRef = this.dialog.open(OrcamentoComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      this.loadData();
    })
  }

}
