import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ClientService } from '../../shared/services/client.service.component';
import { MatDialog } from '@angular/material';
import { Router} from '@angular/router';
import page from './steps.json';

@Component({
  selector: 'app-listar',
  templateUrl: '../default.html',
  styleUrls: ['./listar.component.scss']
})

export class ListarComponent implements OnInit {

  @Input('rotaRecebida') private rota;
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
  
  @ViewChild(ListarComponent, {static: false}) table: ListarComponent;
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
  add(){
    this.router.navigate(['/pedido/novo']);
  }

}
