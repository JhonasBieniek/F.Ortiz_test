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
  token:any;

  constructor(private http: HttpClient,  private notificationService: NotificationService) {}

  getToken(): string {
    this.token = localStorage.getItem('TOKEN_NAME');
    console.log(JSON.stringify(this.token))
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
    if(!token) token = this.getToken();
    if(!token) return true;

    const date = this.getTokenExpirationDate(token);
    if(date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  delete(tipo,id){
    const uri = `${API_URL}` + tipo +`/delete/`+id +`.json`;
    const obj = {
      id
    };
    this
      .http
      .post(uri, obj)
      .subscribe(res =>{
        this.resposta = res
          if(this.resposta.status || this.resposta.success == true){
            this.notificationService.notify(`Deletado com Sucesso!`)
          }else{
            this.notificationService.notify(this.resposta.data.retornoMsg)
          }
        }
      ); 
  }

  delPedidoProdutos(id){
    const uri = `${API_URL}` +`pedido-produtos/delete/`+id +`.json`;
    return this
      .http
      .delete(uri)
  }

  addAreaVenda(data) {
    const uri = `${API_URL}` + `area-vendas/add.json`;
    this
      .http
      .post(uri, data) 
      .subscribe(res =>
          console.log('Done'));
  }

  updateAreaVenda(data): Observable<any>{
    const url = `${API_URL}area-vendas/edit/${data.id}.json`;
     return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
     )
  }
  addNota(data){
    const uri = `${API_URL}` + `notas/add.json`;
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
  updateRegiao(data): Observable<any>{
    const url = `${API_URL}regioes/edit/${data.id}.json`;
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
  updateCargo(data): Observable<any>{
    const url = `${API_URL}cargos/edit/${data.id}.json`;
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
  updateCondComerciais(data): Observable<any>{
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
  updateUnidade(data): Observable<any>{
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
  updateTamanhos(data): Observable<any>{
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
  updateGrupos(data): Observable<any>{
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
  updateRamos(data): Observable<any>{
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
  updateComissoes(data): Observable<any>{
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
  updateProduto(data): Observable<any>{
    const url = `${API_URL}produtos/edit/${data.id}.json`;
     return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
     )
  }
  addPedido(data) {
    const uri = API_URL+ 'pedidos/add.json';
    return this
      .http
      .post(uri, data) 
      
  }
  addOrcamento(data) {
    const uri = API_URL+ 'orcamentos/add.json';
    return this
      .http
      .post(uri, data) 
      
  }
  addCliente(data){
    const uri = API_URL+ 'clientes/add.json';
    return this
      .http
      .post(uri, data) 
  }
  updateCliente(data): Observable<any>{
    const url = `${API_URL}clientes/edit/${data.id}.json`;
     return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
     )
  }
  addRepresenta(data){
    const uri = API_URL+ 'representadas/add.json';
    return this
      .http
      .post(uri, data) 
  }
  updateRepresentada(data): Observable<any>{
    const url = `${API_URL}representadas/edit/${data.id}.json`;
     return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(res => {
        return res;
      })
     )
  }
  addFuncionario(data){
    const uri = API_URL+ 'funcionarios/add.json';
    return this
      .http
      .post(uri, data) 
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
  getAreaVendaId(id) {
    const uri = `${API_URL}` + `area-vendas/view/`+id+`.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getRepresentadas() {
    const uri = `${API_URL}` + `representadas/index.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
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
  getCargos() {
    const uri = `${API_URL}` + `cargos/index.json`;
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
  getPedidoProdutos(id){
    const uri = `${API_URL}` + `pedidoProdutos/get/`+id+`.json`;
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
  getPedidoSemNota() {
    const uri = `${API_URL}` + `notas/getPedidoSemNota.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
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
  getUnidades() {
    const uri = `${API_URL}` + `unidades/index.json`;
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

  getClientesId(id) {
    const uri = `${API_URL}` +`clientes/view/` + id + ".json";
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getClientesCnpj(id) {
    const uri = `${API_URL}` +`clientes/findCnpj/` + id + ".json";
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getProdutosRepresentada(id) {
    const uri = `${API_URL}` +`produtos/produtosRepresentada/` + id + ".json";
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
  getCep(cep) {
    const uri = `${API_URL}` + 'enderecos/getCEP/' +cep + '.json';
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
  getProdutoCode(code) {
    const uri = API_URL + 'produtos/getByCode/' + code + ".json";
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }

  getApiCnpj(cnpj){
    console.log(String(cnpj).length)
    const uri = 'https://www.receitaws.com.br/v1/cnpj/';
    if(String(cnpj).length == 14){
      return this.http.jsonp(uri + cnpj, "callback").map(res => {
        return res;
      })
    }if(String(cnpj).length == 13){
      return this.http.jsonp(uri + '0' + cnpj, "callback").map(res => {
        return res;
      })
    }else{
      this.notificationService.notify("CNPJ INCORRETO!")
    }
  }
  private handleError(error: any): Observable<any>{
    console.log("ERRO NA REQUISIÇÃO => ", error);
      return throwError(error);
  }

}