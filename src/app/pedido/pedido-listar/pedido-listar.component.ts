import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ClientService } from '../../shared/services/client.service.component';
import { MatDialog, MatDialogConfig, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatTabChangeEvent } from '@angular/material';
import { Router} from '@angular/router';
import page from './steps.json';
import { DialogConfirmarDeleteComponent } from '../../cadastro/dialog-confirmar-delete/confirmar-delete.component';
import { Novo2Component } from '../novo2/novo2.component';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { ViewPedidoOrcamentoComponent } from '../view-pedido/view-pedido.component';
import { ExcelService } from '../../shared/services/excel.service';


@Component({
  selector: 'app-pedido-listar',
  templateUrl: '../default.html',
  styleUrls: ['./pedido-listar.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ],
  encapsulation: ViewEncapsulation.None

})
export class PedidoListarComponent implements OnInit {

  editing = {};
  rows:any = [];
  temp:any = [];
  selected:any = [];
  page:any = page;
  steps: any = this.page.pedidos;
  defaultTab = 0;
  action: string = "pedido";

  itemSelected

  loadingIndicator = true;
  reorderable = true;

  isEditable = {};    
  
  dialogConfig = new MatDialogConfig();

  
  @ViewChild(PedidoListarComponent, {static: true}) table: PedidoListarComponent;
  constructor(
    private clientservice: ClientService,
    private dialog: MatDialog) {
      this.loadData()      
  }
  
  private loadData(){
    this.clientservice.getPedidos().subscribe((res:any) =>{
      let i = 0;
      this.steps.forEach(e => {
        this.temp[i] = res.data.filter(d => d.situacao == e.step);
        i++;
      });
      this.rows = [...this.temp].sort((a,b)=> a.id - b.id);
    });                     
  }

  ngOnInit() {
    this.dialogConfig= {
      width: '98vw',
      height: '98vh'
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows[this.defaultTab] = this.temp[this.defaultTab].filter(function(d) {
      if( d.cliente.nome_fantasia.toLowerCase().indexOf(val) !== -1 || !val ||
          d.representada.nome_fantasia.toLowerCase().indexOf(val) !== -1 || !val ||
          d.cliente.cnpj.toLowerCase().indexOf(val) !== -1 || !val ||
          d.num_pedido.toLowerCase().indexOf(val) !== -1 || !val )
      return d
    }); 
  }

  add(tipo){
    this.dialogConfig.data = { 
      tipo: tipo
    };
    let dialogRef = this.dialog.open(Novo2Component, this.dialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      this.loadData();
    })
  }

  edit(row){
    this.dialogConfig.data = {
      tipo: 'edit',
      pedido: row
    }
    let dialogRef = this.dialog.open(Novo2Component, this.dialogConfig);
    dialogRef.afterClosed().subscribe(value =>{
      this.loadData();
    })
  }

  clone(row){
    this.dialogConfig.data = {
      tipo: 'clone',
      pedido: row
    }
    let dialogRef = this.dialog.open(Novo2Component, this.dialogConfig);
    dialogRef.afterClosed().subscribe(value =>{
      this.loadData();
    })
  }

  view(row){
    this.dialogConfig.data = {
      tipo: 'pedidos',
      pedido: row
    }
    let dialogRef = this.dialog.open(ViewPedidoOrcamentoComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(value =>{
     // this.loadData();
    })
  }

  delete(row){
    const dialogConfig = new MatDialogConfig();
      let tipo = 'pedidos'
      dialogConfig.data = row
      dialogConfig.data.nome = row.num_pedido
      dialogConfig.data.tipo = tipo
      let dialogRef = this.dialog.open(DialogConfirmarDeleteComponent,
      dialogConfig   
    );
    dialogRef.afterClosed().subscribe(value => 
      { (value != 1) ? this.loadData() : null });
  }


  onTabChange(event: MatTabChangeEvent) {
    this.defaultTab = event.index;
    window.dispatchEvent(new Event('resize'));
    this.selected =[];
  }

}
