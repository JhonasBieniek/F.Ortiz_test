import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { NotificationService } from '../messages/notification.service';
import * as jwt_decode from 'jwt-decode';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators';


export const API_URL = "https://test2.fortiz.com.br/api/"

@Injectable()
export class ClientService {

  result: any;
  resposta
  token: any;

  constructor(private http: HttpClient, private notificationService: NotificationService) { }

  getToken(): string {
    this.token = localStorage.getItem('TOKEN_NAME');
    return this.token
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) return null;
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) token = this.getToken();
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  delete(tipo, id) {
    const uri = `${API_URL}` + tipo + `/delete/` + id + `.json`;
    const obj = {
      id
    };

    // this.notificationService.notify(`Você não possui permissão para excluir dados!`)
    // Removida a func de delete
    this
      .http
      .post(uri, obj)
      .subscribe(res => {
        this.resposta = res
        if (this.resposta.status || this.resposta.success == true) {
          this.notificationService.notify(`Deletado com Sucesso!`)
        } else {
          this.notificationService.notify(this.resposta.data.retornoMsg)
        }
      }
      );
  }

  delPedidoProdutos(id) {
    this.notificationService.notify(`Você não possui permissão para excluir dados!`)

    // const uri = `${API_URL}` +`pedido-produtos/delete/`+id +`.json`;
    // return this
    //   .http
    //   .delete(uri)
  }

  addAreaVenda(data) {
    const uri = `${API_URL}` + `area-vendas/add.json`;
    this
      .http
      .post(uri, data)
      .subscribe(res =>
        console.log('Done'));
  }

  addAreaVendasGrupo(data) {
    const uri = `${API_URL}` + `area-venda-grupos/add.json`;
    this
      .http
      .post(uri, data)
      .subscribe(res =>
        console.log('Done'));
  }

  updateAreaVenda(data): Observable<any> {
    const url = `${API_URL}area-vendas/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  updateAreaVendasGrupo(data): Observable<any> {
    const url = `${API_URL}area-venda-grupos/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  addNota(data) {
    const uri = `${API_URL}` + `notas/add.json`;
    return this
      .http
      .post(uri, data)
  }
  addDevolucao(data) {
    const uri = `${API_URL}` + `notas/editDevolucao.json`;
    return this
      .http
      .post(uri, data)
  }
  editNota(data) {
    console.log(data)
    const uri = `${API_URL}` + `notas/edit/` + data.id + `.json`;
    return this
      .http
      .post(uri, data)
  }
  addRegiao(data) {
    const uri = `${API_URL}` + `regioes/add.json`;
    this
      .http
      .post(uri, data)
      .subscribe(res =>
        console.log('Done'));
  }
  updateRegiao(data): Observable<any> {
    const url = `${API_URL}regioes/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  addProdutoTipo(dados) {
    const uri = `${API_URL}` + `produto-tipos/add.json`;
    this
      .http
      .post(uri, dados)
      .subscribe(res =>
        console.log('Done'));
  }
  updateProdutoTipo(data): Observable<any> {
    const url = `${API_URL}produto-tipos/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  addProdutoClassifications(dados) {
    const uri = `${API_URL}` + `classifications/add.json`;
    this
      .http
      .post(uri, dados)
      .subscribe(res =>
        console.log('Done'));
  }
  updateProdutoClassifications(data): Observable<any> {
    const url = `${API_URL}classifications/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  addProdutoMaterials(dados) {
    const uri = `${API_URL}` + `produto-materials/add.json`;
    this
      .http
      .post(uri, dados)
      .subscribe(res =>
        console.log('Done'));
  }
  updateProdutoMaterials(data): Observable<any> {
    const url = `${API_URL}produto-materials/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  addCargo(dados) {
    const uri = `${API_URL}` + `cargos/add.json`;
    this
      .http
      .post(uri, dados)
      .subscribe(res =>
        console.log('Done'));
  }
  updateCargo(data): Observable<any> {
    const url = `${API_URL}cargos/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  addConta(dados) {
    const uri = `${API_URL}` + `contas/add.json`;
    this
      .http
      .post(uri, dados)
      .subscribe(res =>
        console.log('Done'));
  }
  updateConta(data): Observable<any> {
    const url = `${API_URL}contas/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  addCondComerciais(dados) {
    const uri = `${API_URL}` + `condicoes-comerciais/add.json`;
    this
      .http
      .post(uri, dados)
      .subscribe(res =>
        console.log('Done'));
  }
  viewCondComerciais(id) {
    const uri = API_URL + 'condicoes-comerciais/view/' + id + ".json";
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  updateCondComerciais(data): Observable<any> {
    const url = `${API_URL}condicoes-comerciais/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  addUnidades(dados) {
    const uri = `${API_URL}` + `unidades/add.json`;
    this
      .http
      .post(uri, dados)
      .subscribe(res =>
        console.log('Done'));
  }
  updateUnidade(data): Observable<any> {
    const url = `${API_URL}unidades/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  addUsuarios(dados) {
    const uri = `${API_URL}` + `usuarios/add.json`;
    this
      .http
      .post(uri, dados[0])
      .subscribe(res =>
        console.log('Done Add User!'));
  }
  addTamanhos(dados) {
    const uri = `${API_URL}` + `tamanhos/add.json`;
    this
      .http
      .post(uri, dados)
      .subscribe(res =>
        console.log('Done'));
  }
  updateTamanhos(data): Observable<any> {
    const url = `${API_URL}tamanhos/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  addGrupos(dados) {
    const uri = `${API_URL}` + `grupos/add.json`;
    this
      .http
      .post(uri, dados)
      .subscribe(res =>
        console.log('Done'));
  }
  updateGrupos(data): Observable<any> {
    const url = `${API_URL}grupos/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  addRamos(dados) {
    const uri = `${API_URL}` + `ramoAtividades/add.json`;
    this
      .http
      .post(uri, dados)
      .subscribe(res =>
        console.log('Done'));
  }
  updateRamos(data): Observable<any> {
    const url = `${API_URL}ramoAtividades/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  addComissoes(dados) {
    const uri = `${API_URL}` + `comissoes/add.json`;
    this
      .http
      .post(uri, dados)
      .subscribe(res =>
        console.log('Done'));
  }
  updateComissoes(data): Observable<any> {
    const url = `${API_URL}comissoes/edit/${data.funcionario_id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  viewComissoes(id) {
    const uri = API_URL + 'comissoes/view/' + id + ".json";
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  addProdutos(dados) {
    const uri = `${API_URL}` + `produtos/add.json`;
    return this
      .http
      .post(uri, dados)
  }
  addProdutosLote(dados) {
    const uri = `${API_URL}` + `produtos/addLote.json`;
    return this
      .http
      .post(uri, dados)
  }
  updateProduto(data): Observable<any> {
    const url = `${API_URL}produtos/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  addPedido(data) {
    const uri = API_URL + 'pedidos/add.json';
    return this
      .http
      .post(uri, data)
  }
  updatePedido(data): Observable<any> {
    const url = `${API_URL}pedidos/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  addOrcamento(data) {
    const uri = API_URL + 'orcamentos/add.json';
    return this
      .http
      .post(uri, data)
  }
  cancelarOrcamento(id) {
    //this.notificationService.notify(`Você não possui permissão para excluir dados!`)

    const uri = `${API_URL}` + `orcamentos/cancelarOrcamento/` + id + `.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  updateOrcamento(data): Observable<any> {
    const url = `${API_URL}orcamentos/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  orcamentoGerado(id) {
    const uri = `${API_URL}` + `orcamentos/orcamentoGerado/${id}.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  addCliente(data) {
    const uri = API_URL + 'clientes/add.json';
    return this
      .http
      .post(uri, data)
  }
  updateCliente(data): Observable<any> {
    const url = `${API_URL}clientes/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  updateProdutoEstadoPreco(data): Observable<any> {
    const url = `${API_URL}produtoEstadosPrecos/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  addRepresenta(data) {
    const uri = API_URL + 'representadas/add.json';
    return this
      .http
      .post(uri, data)
  }
  updateRepresentada(data): Observable<any> {
    const url = `${API_URL}representadas/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  addFuncionario(data) {
    const uri = API_URL + 'funcionarios/add.json';
    return this
      .http
      .post(uri, data)
  }

  getFuncPgtoLote() {
    const uri = `${API_URL}` + `funcionarios/getFuncPgtoLote.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  getTecnicos() {
    const uri = `${API_URL}` + `funcionarios/getTecnicos.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  fornecedor() {
    const uri = `${API_URL}` + `financeiros/fornecedor.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  addContasAvulsas(data){
    const uri = `${API_URL}` + `financeiros/addContasAvulsas.json`;
    return this
      .http
      .post(uri, data);
  }

  editFinanceiro(data){
    const uri = `${API_URL}` + `financeiros/edit.json`;
    return this
      .http
      .post(uri, data);
  }

  contasPagarByCliente(id) {
    const uri = `${API_URL}` + `financeiros/contasPagarByCliente/${id}.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  financeiroContas(data) {
    const uri = `${API_URL}` + `financeiros/getContasFinanceiro.json`;
    return this
      .http
      .post(uri, data);
  }

  deleteConta(id) {
    const uri = `${API_URL}` + `financeiros/delete/${id}.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  getNewOrcamentos(data) {
    const uri = `${API_URL}` + `financeiros/getContasFinanceiro.json`;
    return this
      .http
      .post(uri, data);
  }

  receberPagamentos(data) {
    const uri = `${API_URL}` + `financeiros/receberPagamentos.json`;
    return this
      .http
      .post(uri, data);
  }

  chkParcelas(id, data) {
    const uri = `${API_URL}` + `notas/chk/${id}.json`;
    return this
      .http
      .post(uri, data)
  }

  getNotificationsByUser() {
    const uri = `${API_URL}` + `notifications/notificationsByUser.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  marcarLido(id) {
    const uri = `${API_URL}` + `notifications/edit/${id}.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }


  getProdutos() {
    const uri = `${API_URL}` + `produtos/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getProdutosSoft() {
    const uri = `${API_URL}` + `produtos/index2.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getProdutosIndisponivel() {
    const uri = `${API_URL}` + `produtos/produtosIndisponiveis.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getProdutosSoftPrice() {
    const uri = `${API_URL}` + `produtos/index4.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getProdutosHomologation() {
    const uri = `${API_URL}` + `produtos/indexHomologation.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getUsuarios() {
    const uri = `${API_URL}` + `usuarios/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getAreaVenda() {
    const uri = `${API_URL}` + `area-vendas/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getAreaVendaGrupos() {
    const uri = `${API_URL}` + `area-venda-grupos/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getAreaVendaId(id) {
    const uri = `${API_URL}` + `area-vendas/view/` + id + `.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getRepresentadas(): Observable<any[]> {
    const uri = `${API_URL}` + `representadas/index.json`;
    return this.http.get<any[]>(uri);
  }
  getRepresentadasAtivas(): Observable<any[]> {
    const uri = `${API_URL}` + `representadas/index2.json`;
    return this.http.get<any[]>(uri);
  }
  getClassificacoes(): Observable<any[]> {
    const uri = `${API_URL}` + `classifications/index.json`;
    return this.http.get<any[]>(uri);
  }
  getRepresentadasFunc() {
    const uri = `${API_URL}` + `representadas/getRepresentadasFunc.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getForncedores() {
    const uri = `${API_URL}` + `fornecedores/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getComissoes() {
    const uri = `${API_URL}` + `comissoes/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getFuncionarios() {
    const uri = `${API_URL}` + `funcionarios/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getFuncionario(id) {
    const uri = `${API_URL}` + `funcionarios/view/` + id + `.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getCargos() {
    const uri = `${API_URL}` + `cargos/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getProdutoTipos() {
    const uri = `${API_URL}` + `produto-tipos/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getProdutoMaterials() {
    const uri = `${API_URL}` + `produto-materials/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getProdutoClassifications() {
    const uri = `${API_URL}` + `classifications/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getContas() {
    const uri = `${API_URL}` + `contas/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getCondComerciais() {
    const uri = `${API_URL}` + `condicoes-comerciais/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getPedidos() {
    const uri = `${API_URL}` + `pedidos/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getLastsByCliente(id) {
    const uri = `${API_URL}` + `pedidos/getLastsByCliente/` + id + `.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  pedidosRelatorioByCliente(id) {
    const uri = `${API_URL}` + `pedidos/pedidosRelatorioByCliente/` + id + `.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  pedidosRelatorio(data) {
    const uri = `${API_URL}` + `pedidos/pedidosRelatorio.json`;
    return this
      .http
      .post(uri, data)
      .map(res => {
        return res;
      });
  }

  produtosVendidos(data) {
    const uri = `${API_URL}` + `PedidoProdutos/produtosVendidos.json`;
    return this
      .http
      .post(uri, data)
      .map(res => {
        return res;
      });
  }

  RelatorioComparativoVendas(data) {
    const uri = `${API_URL}` + `pedidos/RelatorioComparativoVendas.json`;
    return this
      .http
      .post(uri, data)
      .map(res => {
        return res;
      });
  }

  consumo(data) {
    const uri = `${API_URL}` + `pedidos/consumo.json`;
    return this
      .http
      .post(uri, data)
      .map(res => {
        return res;
      });
  }

  produtoPedidos(data) {
    const uri = `${API_URL}` + `pedidos/produtoPedidos.json`;
    return this
      .http
      .post(uri, data)
      .map(res => {
        return res;
      });
  }

  relatorioClientesSemCompra(data) {
    const uri = `${API_URL}` + `clientes/relatorioClientesSemCompra.json`;
    return this
      .http
      .post(uri, data)
      .map(res => {
        return res;
      });
  }

  relatorioNovosClientesCompras(data) {
    const uri = `${API_URL}` + `clientes/relatorioNovosClientesCompras.json`;
    return this
      .http
      .post(uri, data)
      .map(res => {
        return res;
      });
  }

  rankingPedidos(data) {
    const uri = `${API_URL}` + `pedidos/rankingPedidos.json`;
    return this
      .http
      .post(uri, data)
      .map(res => {
        return res;
      });
  }

  rankingPedidosSemAgrupamento(data) {
    const uri = `${API_URL}` + `pedidos/rankingPedidosSemAgrupamento.json`;
    return this
      .http
      .post(uri, data)
      .map(res => {
        return res;
      });
  }

  faturamentoPorGrupos(data) {
    const uri = `${API_URL}` + `pedidos/faturamentoPorGrupos.json`;
    return this
      .http
      .post(uri, data)
      .map(res => {
        return res;
      });
  }

  relatorioNotas(data) {
    const uri = `${API_URL}` + `notas/relatorioNotas.json`;
    return this
      .http
      .post(uri, data)
      .map(res => {
        return res;
      });
  }

  comissoesRecebidas(data) {
    const uri = `${API_URL}` + `notaParcelas/getRecebidos.json`;
    return this
      .http
      .post(uri, data)
      .map(res => {
        return res;
      });
  }

  reverterComissao(data) {
    const uri = `${API_URL}` + `notaParcelas/reverterComissao.json`;
    return this
      .http
      .post(uri, data)
      .map(res => {
        return res;
      });
  }

  getOrcPedido(id, tipo) {
    const uri = `${API_URL}` + tipo + `/view/` + id + `.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getPedidoId(id) {
    const uri = `${API_URL}` + `pedidos/view/` + id + `.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getPedidoProdutos(id) {
    const uri = `${API_URL}` + `pedidoProdutos/get/` + id + `.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getNotas() {
    const uri = `${API_URL}` + `notas/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getNotasID(id) {
    const uri = `${API_URL}` + `notas/view/` + id + `.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  removeNota(id) {
    //this.notificationService.notify(`Você não possui permissão para excluir dados!`)

    const uri = `${API_URL}` + `notas/delete/` + id + `.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  cancelarNota(id) {
    //this.notificationService.notify(`Você não possui permissão para excluir dados!`)

    const uri = `${API_URL}` + `notas/cancelar/` + id + `.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  removeNotaParcela(id) {
    //this.notificationService.notify(`Você não possui permissão para excluir dados!`)

    const uri = `${API_URL}` + `notaParcelas/delete/` + id + `.json`;
    return this
      .http
      .delete(uri)
      .map(res => {
        return res;
      });
  }
  removeNotaProduto(id) {
    const uri = `${API_URL}` + `notaProdutos/delete/` + id + `.json`;
    return this
      .http
      .delete(uri)
      .map(res => {
        return res;
      });
  }
  getNotasRelatorios(data): Observable<Object> {
    const uri = `${API_URL}` + `notas/relatorios.json`;
    return this.http.post<Object>(uri, data);
  }
  getNotasRelatoriosDevolucoes(data): Observable<Object> {
    const uri = `${API_URL}` + `notas/relatorioDevolucoes.json`;
    return this.http.post<Object>(uri, data);
  }
  getNotasRelatoriosEstornos(data): Observable<Object> {
    const uri = `${API_URL}` + `notas/relatorioEstornos.json`;
    return this.http.post<Object>(uri, data);
  }
  getPedidoSemNota() {
    const uri = `${API_URL}` + `notas/getPedidoSemNota.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getPedidoParcial() {
    const uri = `${API_URL}` + `notas/getPedidoParcial.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getRecebimentos(data) {
    const uri = `${API_URL}` + `notas/getRecebimentos.json`;
    return this
      .http
      .post(uri, data);
  }
  baixaRecebimentos(data) {
    const uri = `${API_URL}` + `notas/baixaRecebimentos.json`;
    return this
      .http
      .post(uri, data);
  }
  getOrcamentos() {
    const uri = `${API_URL}` + `orcamentos/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getOrcamentos_antigos(){
    const uri = `${API_URL}` + `orcamentos/orcamentosAntigos.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  cancelarAntigos(data){
    const uri = `${API_URL}` + `orcamentos/cancelarAntigos.json`;
    return this
      .http
      .post(uri, data);
  }
  getOrcamentosForUsers() {
    const uri = `${API_URL}` + `orcamentos/indexForUsers.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getUnidades() {
    const uri = `${API_URL}` + `unidades/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getProdutoTamanhos() {
    const uri = `${API_URL}` + `produtoTamanhos/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getProdutoCores() {
    const uri = `${API_URL}` + `produtoCores/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getProdutoAplications() {
    const uri = `${API_URL}` + `produtoAplications/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getRegioes() {
    const uri = `${API_URL}` + `regioes/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getGrupos() {
    const uri = `${API_URL}` + `grupos/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getTamanhos() {
    const uri = `${API_URL}` + `tamanhos/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getRamos() {
    const uri = `${API_URL}` + `ramoAtividades/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getEstados() {
    const uri = `${API_URL}` + `estados/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  getClientesId(id) {
    const uri = `${API_URL}` + `clientes/view/` + id + ".json";
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getPedido(id) {
    const uri = `${API_URL}` + `pedidos/view/` + id + ".json";
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getOrcamento(id) {
    const uri = `${API_URL}` + `orcamentos/view/` + id + ".json";
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getClientesCnpj(id) {
    const uri = `${API_URL}` + `clientes/findCnpj/` + id + ".json";
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getProdutosRepresentada(id) {
    const uri = `${API_URL}` + `produtos/produtosRepresentada/` + id + ".json";
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getProdutosRep(id) {
    const uri = `${API_URL}` + `produtos/produtosRep/` + id + ".json";
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  getProdRepCli(representada_id, cliente_id) {
    const uri = `${API_URL}` + `produtos/download/` + representada_id + "/" + cliente_id + ".json";
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  getClientes() {
    const uri = `${API_URL}` + `clientes/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  getTotalClientes(){
    const uri = `${API_URL}` + `clientes/totalClientes.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  getTotalRepresentadas(){
    const uri = `${API_URL}` + `representadas/totalRepresentadas.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  getTotalPedidosAbertos(){
    const uri = `${API_URL}` + `pedidos/totalPedidosAbertos.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  getTotalPedidosfaturados(){
    const uri = `${API_URL}` + `pedidos/totalPedidosFaturados.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  getClientsByRepresentada($representada_id) {
    const uri = `${API_URL}` + 'ClienteRepresentadaAreaVendas/getClientsByRepresentada/' + $representada_id + '.json';
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getClientsByRepresentadaAndArea($representada_id, $area_venda_id) {
    const uri = `${API_URL}` + 'ClienteRepresentadaAreaVendas/getClientsByRepresentadaAndArea/' + $representada_id + '/'+ $area_venda_id+ '.json';
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  getAreaByRepresentada($representada_id) {
    const uri = `${API_URL}` + 'areaVendas/getAreaByRepresentada/' + $representada_id + '.json';
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  getProdutosEstado() {
    const uri = `${API_URL}` + `produtoEstadosPrecos/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getCep(cep) {
    const uri = `${API_URL}` + 'enderecos/getCEP/' + cep + '.json';
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getProduto(id) {
    const uri = API_URL + 'produtos/get/' + id + ".json";
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  viewProduto(id) {
    const uri = API_URL + 'produtos/view/' + id + ".json";
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  getProdutoCode(code) {
    const uri = `${API_URL}` + `produtos/getByCode2.json`;
    return this
      .http
      .post(uri, code)
      .map(res => {
        return res;
      });
  }
  getEstorno(data) {
    const uri = API_URL + 'notas/estorno/' + data + ".json";
    return this.http.get(uri);
  }
  estornarParcela(data) {
    const uri = `${API_URL}` + `notas/estornarParcela.json`;
    return this.http.post(uri, data);
  }
  areceber(data) {
    const uri = `${API_URL}` + `pedidos/receber.json`;
    return this.http.post(uri, data);
  }

  repasse(data) {
    const uri = `${API_URL}` + `pedidos/repasse.json`;
    return this.http.post(uri, data);
  }

  getApiCnpj(cnpj) {
    console.log(String(cnpj).length)
    const uri = 'https://www.receitaws.com.br/v1/cnpj/';
    if (String(cnpj).length == 14) {
      return this.http.jsonp(uri + cnpj, "callback").map(res => {
        return res;
      })
    } if (String(cnpj).length == 13) {
      return this.http.jsonp(uri + '0' + cnpj, "callback").map(res => {
        return res;
      })
    } else {
      this.notificationService.notify("CNPJ INCORRETO!")
    }
  }

  getHomologacoes() {
    const uri = `${API_URL}` + `homologations/index.json`;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  getHomologacoesRelatorio(dados) {
    const uri = `${API_URL}` + `homologation-products/relHomolog.json`;
    return this
      .http
      .post(uri, dados)
      .map(res => {
        return res;
      });
  }
  addHomogacao(dados) {
    const uri = `${API_URL}` + `homologations/add.json`;
    this
      .http
      .post(uri, dados)
      .subscribe(res =>
        console.log('Done'));
  }
  addProdutoHomologacao(dados) {
    const uri = `${API_URL}` + `homologation-products/add.json`;
    return this
      .http
      .post(uri, dados)
      .map(res => {
        return res;
      });
  }
  updateHomologacao(data): Observable<any> {
    const url = `${API_URL}homologation-products/edit/${data.id}.json`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
    )
  }
  viewHomogacao(id) {
    const uri = API_URL + 'homologations/view/' + id + ".json";
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
  delHomologacao(id) {
    // this.notificationService.notify(`Você não possui permissão para excluir dados!`)
    const uri = `${API_URL}` + `homologation-products/delete/` + id + `.json`;
    return this
      .http
      .delete(uri)
  }
  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }

}