import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
  styleUrls: ['./relatorios.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class RelatoriosComponent implements OnInit {

  form: FormGroup;
  pageTitle:string;
  showTable:boolean = false;
  resposta:[] = [];
  representadas = [];
  vendedores$:Observable<any[]>;
  auxiliares$:Observable<any[]>;
  acumulados = [];
  clientes$:Observable<any[]>;
  rota:string
  show:boolean = true;
  vendedor_id = new FormControl(null);
  auxiliar_id = new FormControl(null);
  cliente_id = new FormControl(null);
  tipo = new FormControl(null);
  result: any;
  rows:any = [];
  temp:any = [];
  data:any = [];

  @ViewChild(RelatoriosComponent, {static: false}) table: RelatoriosComponent;
  vTotal: any = 0;
  cTotal: any = 0;
  cPaga: any = 0;

  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
  ){
  }  

  setTitulo(rota){
    console.log(rota)
    if(rota == 'acumulado'){
      this.pageTitle = 'Relatório Acumulado de Comissões';
      this.show = false;
      this.form.get('tipo').setValue('data_recebimento');
    }
    if(rota == 'comissoes'){
      this.pageTitle = 'Relatório de Comissões';
      this.show = false;
      this.form.get('tipo').setValue('data_recebimento');
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

  updateFilter(tipo) {
    var temp = 0;
    if(tipo == 'limpar'){
      this.rows = this.data
    }else{
    if(tipo == 'cliente'){
      this.auxiliar_id.reset()
      this.vendedor_id.reset()
      temp = this.temp.filter(d =>
        d.pedido.cliente.id  == this.cliente_id.value
      ); 
    }else if(tipo == 'vendedor'){
      this.auxiliar_id.reset()
      this.cliente_id.reset()
      temp = this.temp.filter(d =>
        d.pedido.vendedor.id  == this.vendedor_id.value 
      ); 
    }else if(tipo == 'auxiliar'){
      this.vendedor_id.reset()
      this.cliente_id.reset()
      temp = this.temp.filter(d =>
        d.pedido.auxiliar.id  == this.auxiliar_id.value
      ); 
    }else{
      this.auxiliar_id.reset()
      this.vendedor_id.reset()
      this.cliente_id.reset()
    }
      // update the rows
      this.rows = temp;
     }
    }

  clear(){
    this.form.reset();
  }

  valorTotal(){
    let vlrTotal:number = 0;
    this.rows.forEach(element => {
      vlrTotal += element.pedido.valor_total 
    });
    return vlrTotal;
  }
  valorParcelas(){
    let vlrTotal:number = 0;
    this.rows.forEach(e => {
      e.nota_parcelas.forEach(element => {
        vlrTotal += element.valor
      });
    });
    return vlrTotal;
  }
  comissaoTotal(){
    let vlrTotal:number = 0;
    this.rows.forEach(element => {
      vlrTotal += element.pedido.comissao_bruto 
    });
    return vlrTotal;
  }
  comissaoParcelas(){
    let vlrTotal:number = 0;
    this.rows.forEach(e => {
      e.nota_parcelas.forEach(element => {
        vlrTotal += (element.valor * e.pedido.comissao_media /100)
      });
    });
    return vlrTotal;
  }

  
  Submit(){
    const source = this.clientservice.getNotasRelatorios(this.form.value).pipe(
      pluck('data'),
      share()
    );
    if(this.route.snapshot.url[1].path == 'acumulado'){
      source.subscribe((res:any) => {
         res.map(e => {
           let id = e.pedido.vendedor_id+"-"+e.pedido.auxiliar_id+"-"+e.pedido.regiao_id;
           let idx = this.acumulados.findIndex(e => e.id == id);
           this.vTotal += e.pedido.valor_total;
           this.cTotal += e.pedido.comissao_bruto;
           this.cPaga += +e.pedido.comissao_vendedor +e.pedido.comissao_auxiliar;
           if(idx != -1){
            this.acumulados[idx].valor += e.pedido.valor_total;
            this.acumulados[idx].comissao_recebido += e.pedido.comissao_bruto;
            this.acumulados[idx].comissao_paga += +e.pedido.comissao_vendedor +e.pedido.comissao_auxiliar;
           }else{
            this.acumulados.push({
              id: id,
              vendedor: e.pedido.vendedor,
              auxiliar: e.pedido.auxiliar,
              regiao: e.pedido.regiao,
              valor: e.pedido.valor_total,
              comissao_recebido: e.pedido.comissao_bruto,
              comissao_paga: +e.pedido.comissao_vendedor +e.pedido.comissao_auxiliar
            })
           }
         })
         console.log(this.acumulados);
         this.data = this.acumulados;
         this.rows = this.data ;
         this.temp = [...this.data];
      });
    }
    if(this.show == true){
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
        this.data = res
        this.rows = this.data ;
        this.temp = [...this.data];
      })
    }
  }
}