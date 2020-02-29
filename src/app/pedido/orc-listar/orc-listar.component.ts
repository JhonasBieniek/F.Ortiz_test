import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ClientService } from '../../shared/services/client.service.component';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute} from '@angular/router';
import page from './steps.json';

@Component({
  selector: 'app-orc-listar',
  templateUrl: '../default.html',
  styleUrls: ['./orc-listar.component.css']
})

export class OrcListarComponent implements OnInit {

  editing = {};
  rows:any = [];
  temp:any = [];
  selected:any = [];
  page:any = page;
  steps: any = this.page.pedidos;
  defaultTab = 0;

  action: string = "orcamento";

  loadingIndicator = true;
  reorderable = true;

  isEditable = {};     
  
  
  
  constructor(
    private clientservice: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog) {
      this.loadData()      
  }
  
  loadData(){
    this.clientservice.getOrcamentos().subscribe((res:any) =>{
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
    this.router.navigate(['/pedido/listar-orcamento']);
  }

}
