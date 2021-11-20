import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
  pageTitle: string;
  showTable: boolean = false;
  resposta: [] = [];
  representadas = [];
  funcionarios = [];
  vendedores$: Observable<any[]>;
  auxiliares$: Observable<any[]>;
  acumulados = [];
  clientes$: Observable<any[]>;
  rota: string
  show: boolean = true;
  vendedor_id = new FormControl(null);
  auxiliar_id = new FormControl(null);
  cliente_id = new FormControl(null);
  tipo = new FormControl(null);
  result: any;
  rows: any = [];
  temp: any = [];
  data: any = [];

  areaBusca = new FormControl("");
  areas: any = [];
  $areas: any = [];

  clienteBusca = new FormControl("");
  clientes: any = [];
  $clientes: any = [];

  @ViewChild(RelatoriosComponent, { static: false }) table: RelatoriosComponent;
  vTotal: any = 0;
  cTotal: any = 0;
  cPaga: any = 0;
  totalDevolucao: any = 0;
  totalComissao: any = 0;

  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
  ) {
  }

  setTitulo(rota) {
    if (rota == 'acumulado') {
      this.pageTitle = 'Relatório Acumulado de Comissões';
      this.show = false;
      this.form.get('tipo').setValue('data_recebimento');
    }
    if (rota == 'comissoes') {
      this.pageTitle = 'Relatório de Comissões';
      this.show = false;
      this.form.get('tipo').setValue('data_recebimento');
    }
    if (rota == 'recebimento') {
      this.pageTitle = 'Relatório de Recebimento';
    }
    if (rota == 'devolucoes') {
      this.pageTitle = 'Relatório de Devoluções';
    }
    if (rota == 'estorno') {
      this.pageTitle = 'Relatório de Estornos';
    }
  }

  ngOnInit() {
    this.clientservice.getRepresentadas().subscribe((res: any) => this.representadas = res.data);
    this.clientservice.getFuncionarios().subscribe((res: any) => this.funcionarios = res.data);
    this.form = this.fb.group({
      dtInicio: [null, Validators.required],
      dtFinal: [null, Validators.required],
      area_venda_id: [null],
      funcionario_id: [null],
      representada_id: [null],
      cliente_id: [null],
      tipo: ['data_faturamento'],
      filtro: ['todas'],
      ordenacao: ['num_nota'],
      ordenacao_tipo: ['asc'],
    });
    this.rota = this.route.snapshot.url[1].path;
    this.setTitulo(this.route.snapshot.url[1].path);
  }

  updateFilter(tipo) {
    var temp = 0;
    if (tipo == 'limpar') {
      this.rows = this.data
    } else {
      if (tipo == 'cliente') {
        this.auxiliar_id.reset()
        this.vendedor_id.reset()
        temp = this.temp.filter(d =>
          d.pedido.cliente.id == this.cliente_id.value
        );
      } else if (tipo == 'vendedor') {
        this.auxiliar_id.reset()
        this.cliente_id.reset()
        temp = this.temp.filter(d =>
          d.pedido.vendedor.id == this.vendedor_id.value
        );
      } else if (tipo == 'auxiliar') {
        this.vendedor_id.reset()
        this.cliente_id.reset()
        temp = this.temp.filter(d =>
          d.pedido.auxiliar.id == this.auxiliar_id.value
        );
      } else {
        this.auxiliar_id.reset()
        this.vendedor_id.reset()
        this.cliente_id.reset()
      }
      // update the rows
      this.rows = temp;
    }
  }

  clear() {
    this.form = this.fb.group({
      dtInicio: [null, Validators.required],
      dtFinal: [null, Validators.required],
      area_venda_id: [null],
      funcionario_id: [null],
      representada_id: [null],
      cliente_id: [null],
      tipo: [null],
      filtro: ['todas']
    });

    this.$areas = [];
    this.areas = [];
    this.areaBusca.reset();

    this.$clientes = [];
    this.clientes = [];
    this.clienteBusca.reset();

    this.data = [];
    this.rows = [];
    this.temp = [];
    this.acumulados = [];

    if (this.route.snapshot.url[1].path == 'acumulado') {
      this.form.get('tipo').setValue('data_recebimento');
    }
    if (this.route.snapshot.url[1].path == 'comissoes') {
      this.form.get('tipo').setValue('data_recebimento');
    }
    if (this.route.snapshot.url[1].path == 'recebimento') {
      this.form.get('tipo').setValue('data_faturamento');
      this.pageTitle = 'Relatório de Recebimento';
    }
    if (this.route.snapshot.url[1].path == 'devolucoes') {
      //this.pageTitle = 'Relatório de Devoluções';
    }
    if (this.route.snapshot.url[1].path == 'estorno') {
      //this.pageTitle = 'Relatório de Estornos';
    }
  }

  valorTotal() {
    let vlrTotal: number = 0;
    this.rows.forEach(element => {
      vlrTotal += element.pedido.valor_total
    });
    return vlrTotal;
  }
  valorParcelas() {
    let vlrTotal: number = 0;
    this.rows.forEach(e => {
      e.nota_parcelas.forEach(element => {
        vlrTotal += element.valor
      });
    });
    return vlrTotal;
  }
  comissaoTotal() {
    let vlrTotal: number = 0;
    this.rows.forEach(element => {
      vlrTotal += element.pedido.comissao_bruto
    });
    return vlrTotal;
  }
  comissaoParcelas() {
    let vlrTotal: number = 0;
    this.rows.forEach(e => {
      e.nota_parcelas.forEach(element => {
        vlrTotal += (element.valor * e.pedido.comissao_media / 100)
      });
    });
    return vlrTotal;
  }

  getAreas(){
    this.areas = [];
    this.$areas = [];
    this.areaBusca.setValue('');
    this.form.get('area_venda_id').setValue(null);
    this.limparCiente();
    if(this.form.get('representada_id').value != null){
      this.clientservice.getAreaByRepresentada(this.form.get('representada_id').value).subscribe((res:any) =>{
        this.areas = res.data;
      });
    }
    
  }

  getClientsByRepresentadaAndArea(){
    this.$clientes = [];
    this.clienteBusca.setValue('');
    this.form.get('cliente_id').setValue(null);
    this.clientservice.getClientsByRepresentadaAndArea(this.form.get('representada_id').value, this.form.get('area_venda_id').value).subscribe((res:any) =>{
      this.clientes = res.data;
    });
  }

  searchArea() {
    let $area: Observable<any[]>;
    let nome = this.areaBusca.value;
    if (nome != "") {
      const val = nome.toLowerCase().split(" ");
      let xp = "";
      val.forEach((e) => {
        xp += `(?=.*${e})`;
      });
      const re = new RegExp(xp, "g");
      this.$areas = this.areas.filter(function (d) {
        if (
          d.nome.toLowerCase().match(re) ||
          !val
        )
          return d;
      });
    } else {
      this.$areas = $area;
    }
  }

  setArea(area) {
    this.form.get("area_venda_id").setValue(area.id);
    if(this.rota == "recebimento"){
      this.getClientsByRepresentadaAndArea();
    }
  }

  limparArea() {
    this.$areas = [];
    this.areaBusca.setValue('');
    this.form.get('area_venda_id').setValue(null);
    this.limparCiente();
  }

  setCliente(cliente) {
    this.form.get("cliente_id").setValue(cliente.id);
  }

  limparCiente() {
    this.$clientes = [];
    this.clienteBusca.setValue('');
    this.form.get('cliente_id').setValue(null);
  }

  searchCliente() {
    let $clientes: Observable<any[]>;
    let nome = this.clienteBusca.value;
    if (nome != "") {
      const val = nome.toLowerCase().split(" ");
      let xp = "";
      val.forEach((e) => {
        xp += `(?=.*${e})`;
      });
      const re = new RegExp(xp, "g");
      this.$clientes = this.clientes.filter(function (d) {
        if (
          d.razao_social.toLowerCase().match(re) ||
          !val
        )
          return d;
      });
    } else {
      this.$clientes = $clientes;
    }
  }

  Submit() {
    if(this.form.valid){
      const source = this.clientservice.getNotasRelatorios(this.form.value).pipe(
        pluck('data'),
        share()
      );

      const sourceDevolucao = this.clientservice.getNotasRelatoriosDevolucoes(this.form.value).pipe(
        pluck('data'),
        share()
      );
      const sourceEstorno = this.clientservice.getNotasRelatoriosEstornos(this.form.value).pipe(
        pluck('data'),
        share()
      );
      if (this.route.snapshot.url[1].path == 'acumulado') {
        source.subscribe((res: any) => {
          this.data = [];
          this.rows = [];
          this.temp = [];
          this.acumulados = [];
          this.vTotal = 0;
          this.cTotal = 0;
          this.cPaga = 0;
          res.map(e => {
            if(e.nota_parcelas.length > 0){
              let id = e.pedido.vendedor_id + "-" + e.pedido.auxiliar_id + "-" + e.pedido.regiao_id;
              let idx = this.acumulados.findIndex(e => e.id == id);
              
              //* Valor total das devoluções por nota
              let devolucao = 0;
              if(e.nota_produto_devolutions.length > 0){
                e.nota_produto_devolutions.forEach(produto => {
                  devolucao += (produto.qtd * produto.pedido_produto.valor_unitario);
                });
              }
    
              //* Valor total por nota e nao por pedido
              let valor = 0;
              let comissao_paga = 0;
              let comissao_recebida = 0;
              if(e.nota_parcelas.length > 0){
                e.nota_parcelas.forEach(parcela => {
                  valor += parcela.valor;
                  comissao_paga += +parcela.auxiliar_valor + parcela.vendedor_valor;
                  comissao_recebida += parcela.fortiz_valor;
                });
              }
    
              //this.vTotal += e.pedido.valor_total; //*old
              this.vTotal += valor;
              this.cTotal += comissao_recebida;
              //this.cPaga += +e.pedido.comissao_vendedor + e.pedido.comissao_auxiliar //* old
              this.cPaga += comissao_paga;
    
              if (idx != -1) {
                this.acumulados[idx].valor += valor;
                this.acumulados[idx].comissao_recebido += comissao_recebida;
                this.acumulados[idx].comissao_paga += comissao_paga;
                this.acumulados[idx].devolucao += devolucao;
              } else {
                this.acumulados.push({
                  id: id,
                  vendedor: e.pedido.vendedor,
                  auxiliar: e.pedido.auxiliar,
                  area_venda: e.pedido.area_venda,
                  regiao: e.pedido.regiao,
                  valor: valor,
                  devolucao: devolucao,
                  comissao_recebido: comissao_recebida,
                  comissao_paga: comissao_paga
                })
              }
            }
          })
          this.data = this.acumulados;
          this.rows = this.data;
          this.temp = [...this.data];
        });
      }else if(this.route.snapshot.url[1].path == 'comissoes' && this.form.get('funcionario_id').value){
        source.subscribe((res: any) => {
          this.data = [];
          this.rows = [];
          this.temp = [];
          this.acumulados = [];
          this.vTotal = 0;
          this.totalDevolucao = 0;
          this.totalComissao = 0;
          res.map(nota => {
            if(nota.nota_parcelas.length > 0){
              // let id = e.pedido.vendedor_id + "-" + e.pedido.auxiliar_id + "-" + e.pedido.regiao_id;
              let id = this.acumulados.findIndex(e => e.area_venda_id == nota.pedido.area_venda_id);
              
              //* Valor total das devoluções por nota
              let devolucao = 0;
              if(nota.nota_produto_devolutions.length > 0){
                nota.nota_produto_devolutions.forEach(produto => {
                  devolucao += (produto.qtd * produto.pedido_produto.valor_unitario);
                });
              }
    
              //* Valor total por nota e nao por pedido
              let valor = 0;
              let comissao = 0;
              if(nota.nota_parcelas.length > 0){
                nota.nota_parcelas.forEach(parcela => {
                  valor += parcela.valor;
                  if(nota.pedido.auxiliar_id == this.form.get('funcionario_id').value ){
                    comissao += parcela.auxiliar_valor;
                  }
                  if(nota.pedido.vendedor_id == this.form.get('funcionario_id').value ){
                    comissao += parcela.vendedor_valor;
                  }
                });
              }
    
              this.vTotal += valor;
              this.totalDevolucao += devolucao;
              this.totalComissao += comissao;
    
              if (id != -1) {
                this.acumulados[id].valor += valor;
                this.acumulados[id].comissao += comissao;
                this.acumulados[id].devolucao += devolucao;
              } else {
                this.acumulados.push({
                  area_venda_id: nota.pedido.area_venda_id,
                  area_venda: nota.pedido.area_venda,
                  valor: valor,
                  devolucao: devolucao,
                  comissao: comissao,
                })
              }
            }
            
          })
          this.data = this.acumulados;
          this.rows = this.data;
          this.temp = [...this.data];
        });
      }else if(this.route.snapshot.url[1].path == 'recebimento'){
        source.subscribe((res: any) => {
          this.data = [];
          this.rows = [];
          this.temp = [];
          this.acumulados = [];
          res.map(nota => {
            if(nota.nota_parcelas.length > 0){
              let parcelas = nota.pedido.condicao_comercial.dias.split("/").filter(parcela => {return parcela != ""});
              nota['total'] = nota.nota_parcelas[0].valor * parcelas.length;
              this.acumulados.push(nota);
            }
          })
          this.data = this.acumulados;
          this.rows = this.data;
          this.temp = [...this.data];
        });
      }else if(this.route.snapshot.url[1].path == 'devolucoes'){
        sourceDevolucao.subscribe((res: any) => {
          this.data = [];
          this.rows = [];
          this.temp = [];
          this.acumulados = [];
          res.map(nota => {
            console.log(nota);
            if(nota.nota_parcelas.length > 0){
              let total = 0;
              let quantidade = 0;
              nota.nota_produto_devolutions.forEach(produto => {
                total += (produto.qtd * produto.pedido_produto.valor_unitario);
                quantidade += produto.qtd;
              });
              nota['total'] = total;
              nota['quantidade'] = quantidade;
              this.acumulados.push(nota);
            }
          })
          this.data = this.acumulados;
          this.rows = this.data;
          this.temp = [...this.data];
          console.log(this.rows)
        });
      }else if(this.route.snapshot.url[1].path == 'estorno'){
        sourceEstorno.subscribe((res: any) => {
          this.data = [];
          this.rows = [];
          this.temp = [];
          this.acumulados = [];
          res.map(nota => {
            console.log(nota);
            if(nota.nota_parcelas.length > 0){
              let total = 0;
              nota.nota_parcelas.forEach(parcela => {
                total += parcela.valor;
              });
              nota['total'] = total;
              this.acumulados.push(nota);
            }
          })
          this.data = this.acumulados;
          this.rows = this.data;
          this.temp = [...this.data];
          console.log(this.rows)
        });
      }
      // if (this.show == true) {
      //   this.vendedores$ = source.pipe(
      //     concatMap(from),
      //     map(e => e.pedido.vendedor),
      //     distinct(e => e.id),
      //     reduce((data, e) => [...data, e], []),
      //   )
      //   this.auxiliares$ = source.pipe(
      //     concatMap(from),
      //     map(e => e.pedido.auxiliar),
      //     distinct(e => e.id),
      //     reduce((data, e) => [...data, e], []),
      //   )
      //   this.clientes$ = source.pipe(
      //     concatMap(from),
      //     map(e => e.pedido.cliente),
      //     distinct(e => e.id),
      //     reduce((data, e) => [...data, e], []),
      //   )
      //   source.subscribe((res: []) => {
      //     this.data = res
      //     this.rows = this.data;
      //     this.temp = [...this.data];
      //   })
      // }
    }else{
      this.form.markAllAsTouched();
    }
  }
}