import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ClientService } from '../../shared/services/client.service.component';
import { NotificationService } from '../../shared/messages/notification.service';
import { Observable, from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { share, pluck, map, distinct, concatMap, reduce } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {

  form: FormGroup;
  pageTitle:string;
  showTable:boolean = false;
  resposta:[] = [];
  representadas = [];
  vendedores$:Observable<any[]>;
  auxiliares$:Observable<any[]>;
  clientes$:Observable<any[]>;
  rota:string
  show:boolean = true;
  vendedor_id = new FormControl(null);
  auxiliar_id = new FormControl(null);
  cliente_id = new FormControl(null);
  tipo = new FormControl(null);
  result: any;
  rows:any = [];
  temp = [];

  @ViewChild(RelatoriosComponent, {static: false}) table: RelatoriosComponent;

  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
  ){
  }  

  setTitulo(rota){
    if(rota == 'acumulado'){
      this.pageTitle = 'Relatório Acumulado de Comissões';
      this.show = false;
      this.form.get('tipo').setValue('recebimento');
    }
    if(rota == 'comissoes'){
      this.pageTitle = 'Relatório de Comissões';
      this.show = false;
      this.form.get('tipo').setValue('recebimento');
    }
    if(rota == 'recebimento'){
      this.pageTitle = 'Relatório de Recebimento';
    }
    if(rota == 'devolucoes'){
      this.pageTitle = 'Relatório de Devoluções';
    }
    if(rota == 'estorno'){
      this.pageTitle = 'Relatório de Estornos';
    }
  }

  ngOnInit() {
    this.clientservice.getRepresentadas().subscribe((res:any) => this.representadas = res.data);
    this.form = this.fb.group({
      dtInicio: [null],
      dtFinal: [null],
      representada_id: [null],
      tipo: ['faturamento']
    });
    this.setTitulo(this.route.snapshot.url[1].path);
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
        
    // filter our data
    // const temp = this.temp.filter(function(d) {
    //   if( d.nome.toLowerCase().indexOf(val) !== -1 || !val 

    //   return d
    // }); 
    // update the rows
    // this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table = this.rows;
    }

  clear(){
    this.form.reset();
  }
  
  Submit(){
    const source = this.clientservice.getNotasRelatorios(this.form.value).pipe(
      pluck('data'),
      share()
    );
    this.vendedores$ = source.pipe(
      concatMap(from),
      map(e => e.pedido.vendedor),
      distinct(e => e.id),
      reduce((data, e) => [...data, e], []),
    )
    this.auxiliares$ = source.pipe(
      concatMap(from),
      map(e => e.pedido.auxiliar),
      distinct(e => e.id),
      reduce((data, e) => [...data, e], []),
    )
    this.clientes$ = source.pipe(
      concatMap(from),
      map(e => e.pedido.cliente),
      distinct(e => e.id),
      reduce((data, e) => [...data, e], []),
    )
    source.subscribe( (res:[]) => {
      this.rows = res ;
      this.temp = [...this.rows];
      console.log(res)})
    
  }
}