import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ClientService } from '../../shared/services/client.service.component';
import { MatDialog, MatDialogConfig, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { Router} from '@angular/router';
import page from './steps.json';
import { DialogConfirmarDeleteComponent } from '../../cadastro/dialog-confirmar-delete/confirmar-delete.component';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';


@Component({
  selector: 'app-pedido-listar',
  templateUrl: '../default.html',
  styleUrls: ['./pedido-listar.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}

  ]
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
  
  @ViewChild(PedidoListarComponent, {static: true}) table: PedidoListarComponent;
  constructor(
    private clientservice: ClientService,
    private router: Router,
    private dialog: MatDialog) {
      this.loadData()      
  }
  
  private loadData(){
    this.clientservice.getPedidos().subscribe((res:any) =>{
      let i = 0;
      this.steps.forEach(e => {
        this.temp[i] = res.data.filter(d => d.status == e.step);
        i++;
      });
      this.rows = [...this.temp].sort((a,b)=> a.id - b.id);
    });                     
  }
  ngOnInit() {
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows[this.defaultTab] = this.temp[this.defaultTab].filter(function(d) {
      if( d.cliente.nome_fantasia.toLowerCase().indexOf(val) !== -1 || !val ||
          d.representada.nome_fantasia.toLowerCase().indexOf(val) !== -1 || !val ||
          d.num_pedido.toLowerCase().indexOf(val) !== -1 || !val )
      return d
    }); 
  }
  edit(row){
    this.router.navigate(['pedidos/pedido/', row.id, 'edit'])
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

  navigate(path){
    if(path == 'new')
    this.router.navigate(['pedidos/pedido/novo']);
    else
    this.router.navigate(['pedidos/pedido/importar']);
  }
}
