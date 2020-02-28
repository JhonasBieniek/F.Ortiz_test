import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ClientService } from '../../shared/services/client.service.component';
import { MatDialog } from '@angular/material';
import { Router} from '@angular/router';
import page from './steps.json';

@Component({
  selector: 'app-pedido-listar',
  templateUrl: '../default.html',
  styleUrls: ['./pedido-listar.component.css']
})
export class PedidoListarComponent implements OnInit {

  editing = {};
  rows:any = [];
  temp:any = [];
  selected:any = [];
  page:any = page;
  steps: any = this.page.pedidos;
  defaultTab = 0;

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
  
  loadData(){
    this.clientservice.getPedidos().subscribe((res:any) =>{
      let i = 0;
      this.steps.forEach(e => {
        this.temp[i] = res.data.filter(d => d.status == e.step);
        i++;
      });
      this.rows = [...this.temp];
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
  navigate(path){
    if(path == 'new')
    this.router.navigate(['/pedido/novo']);
    else
    this.router.navigate(['/pedido/importar']);
  }
}
