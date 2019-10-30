import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ClientService } from '../../shared/services/client.service.component';
import { MatDialog } from '@angular/material';

declare var require: any;

const data: any = require('./steps.json');

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {

  @Input('rotaRecebida') private rota;


  editing = {};
  rows = [];
  data: any =[];
  selected:any = [];
  temp:any = [];
  steps:any = [];
  path;
  nome:string = "";  
  defaultTab = 0;

  loadingIndicator = true;
  reorderable = true;

  isEditable = {};                         

  @ViewChild(ListarComponent) table: ListarComponent;
  constructor(private clientservice: ClientService, private dialog: MatDialog) {
                             
  }

  ngOnInit() {
    this.steps = data[this.rota];
    console.log(this.rota);
    if(this.rota != "orcamentos"){
      this.path  = '/pedido/novo';
      this.nome = "Pedido"
      this.clientservice.getPedidos().subscribe((res:any) =>{
        let i = 0;
        this.steps.forEach(e => {
          this.temp[i] = res.data.filter(d => d.status == e.step);
          i++;
        });
        this.rows = [...this.temp];
    });   
    }else{
      this.path  = '/pedido/orcamento';
      this.nome = "Orçamento"
      this.clientservice.getOrcamentos().subscribe((res:any) =>{
        let i = 0;
        this.steps.forEach(e => {
          this.temp[i] = res.data.filter(d => d.status == e.step);
          i++;
        });
        this.rows = [...this.temp];
    });   
    }   
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

}
